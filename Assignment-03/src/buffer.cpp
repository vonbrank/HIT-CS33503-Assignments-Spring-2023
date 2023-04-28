/**
 * @author See Contributors.txt for code contributors and overview of BadgerDB.
 *
 * @section LICENSE
 * Copyright (c) 2012 Database Group, Computer Sciences Department, University of Wisconsin-Madison.
 */

#include <memory>
#include <iostream>
#include "buffer.h"
#include "exceptions/buffer_exceeded_exception.h"
#include "exceptions/page_not_pinned_exception.h"
#include "exceptions/page_pinned_exception.h"
#include "exceptions/bad_buffer_exception.h"
#include "exceptions/hash_not_found_exception.h"

namespace badgerdb
{

    BufMgr::BufMgr(std::uint32_t bufs)
        : numBufs(bufs)
    {
        bufDescTable = new BufDesc[bufs];

        for (FrameId i = 0; i < bufs; i++)
        {
            bufDescTable[i].frameNo = i;
            bufDescTable[i].valid = false;
        }

        bufPool = new Page[bufs];

        int htsize = ((((int)(bufs * 1.2)) * 2) / 2) + 1;
        hashTable = new BufHashTbl(htsize); // allocate the buffer hash table

        clockHand = bufs - 1;
    }

    BufMgr::~BufMgr()
    {
        delete hashTable;
        delete[] bufDescTable;
        delete[] bufPool;
    }

    void BufMgr::advanceClock()
    {
        clockHand++;
        if (clockHand >= numBufs)
        {

            clockHand %= numBufs;
        }
    }

    void BufMgr::allocBuf(FrameId &frame)
    {

        // 记下有多少个 page 被 pin 住了
        unsigned pinned = 0;

        do
        {
            // 遍历 bufDescTable，找一个可以分配的位置
            advanceClock();

            // 无效的位置可以分配
            if (!bufDescTable[clockHand].valid)
            {
                frame = clockHand;
                break;
            }

            if (bufDescTable[clockHand].refbit)
            {
                // refbit 为 true 说明最近访问过，现在标记为 false
                bufDescTable[clockHand].refbit = false;
                continue;
            }

            // 如果被 pin 住了，并且不是 buffer 中所有的 page 都 pin 住了，那就看下一个
            if (bufDescTable[clockHand].pinCnt)
            {
                pinned++;
                if (pinned == numBufs)
                {
                    throw BufferExceededException();
                }
                else
                    continue;
            }

            // refbit 为 false 的位置说明是最近没有访问过，可以分配
            // 改页要被替换

            // 数据脏页要写回
            if (bufDescTable[clockHand].dirty)
            {
                bufDescTable[clockHand].file->writePage(bufPool[clockHand]);
                bufDescTable[clockHand].dirty = false;
            }

            // 被替换的页需要从 hashTable 中移除
            if (bufDescTable[clockHand].valid)
            {
                try
                {
                    hashTable->remove(bufDescTable[clockHand].file, bufDescTable[clockHand].pageNo);
                }
                catch (const HashNotFoundException &)
                {
                }
            }

            frame = clockHand;
            break;

        } while (true);
    }

    void BufMgr::readPage(File *file, const PageId pageNo, Page *&page)
    {

        FrameId frameId;
        try
        {
            // 从 hashTable 找这个 (fiel, pageNumber) 对应的 frameId
            hashTable->lookup(file, pageNo, frameId);

            // 将对应的 frame 设为最近已经访问，引用数 + 1
            bufDescTable[frameId].refbit = true;
            bufDescTable[frameId].pinCnt++;
        }
        catch (HashNotFoundException &)
        {
            // frame 不在 buffer 中就从 file 读取进来
            allocBuf(frameId);
            bufPool[frameId] = file->readPage(pageNo);
            hashTable->insert(file, pageNo, frameId);
            bufDescTable[frameId].Set(file, pageNo);
        }

        // 返回所得 page 的地址
        page = &bufPool[frameId];
    }

    void BufMgr::unPinPage(File *file, const PageId pageNo, const bool dirty)
    {
        FrameId frameId;

        try
        {
            // 从 hashTable 找到要的 frame
            hashTable->lookup(file, pageNo, frameId);
        }
        catch (HashNotFoundException &)
        {
            // 找不到直接返回即可
            return;
        }

        // 找到了就把 pin 值 -1
        if (bufDescTable[frameId].pinCnt > 0)
        {
            bufDescTable[frameId].pinCnt--;
            if (dirty)
            {
                bufDescTable[frameId].dirty = true;
            }
        }
        else
        {
            // 如果 pin 值已经是 0 了就抛出异常
            throw PageNotPinnedException(bufDescTable[frameId].file->filename(), bufDescTable[frameId].pageNo, frameId);
        }
    }

    void BufMgr::flushFile(const File *file)
    {
        for (FrameId frameId = 0; frameId < numBufs; frameId++)
        {
            if (bufDescTable[frameId].file == file)
            {
                // 无效页抛出异常
                if (!bufDescTable[frameId].valid)
                {
                    throw BadBufferException(frameId, bufDescTable[frameId].dirty, bufDescTable[frameId].valid, bufDescTable[frameId].refbit);
                }

                // 被 pin 住的页也要抛出异常
                if (bufDescTable[frameId].pinCnt > 0)
                {
                    throw PagePinnedException(file->filename(), bufDescTable[frameId].pageNo, frameId);
                }

                // 脏页要写回文件
                if (bufDescTable[frameId].dirty)
                {
                    bufDescTable[frameId].file->writePage(bufPool[frameId]);
                    bufDescTable[frameId].dirty = false;
                }

                // 完事之后要把页从 hashTable 中移除
                hashTable->remove(file, bufDescTable[frameId].pageNo);
                bufDescTable[frameId].Clear();
            }
        }
    }

    void BufMgr::allocPage(File *file, PageId &pageNo, Page *&page)
    {
        // 从 file 中分配一个页
        Page newPage = file->allocatePage();

        // 从 buffer 中分配一个 frame，获得其 frameId，也就是 bufPoll 元素的索引
        FrameId frameId;
        allocBuf(frameId);

        // 把 file 中分配到的 page 复制到 bufPoll 中去
        bufPool[frameId] = newPage;

        PageId newPageNumber = newPage.page_number();

        // 把 (file, page_number) 与 frameId 关联起来，
        // 并设置初值
        hashTable->insert(file, newPageNumber, frameId);
        bufDescTable[frameId].Set(file, newPageNumber);

        // 返回 pageNo 和 page 的值
        pageNo = newPageNumber;
        page = &bufPool[frameId];
    }

    void BufMgr::disposePage(File *file, const PageId PageNo)
    {
        FrameId frameId;
        try
        {
            // 尝试从 hashTable 中找出这一页
            hashTable->lookup(file, PageNo, frameId);

            // 如果 buffer 中有这一页，那就从 buffer 中移除这一页的数据
            hashTable->remove(file, PageNo);
            bufDescTable[frameId].Clear();
        }
        catch (HashNotFoundException &)
        {
        }

        // 从文件中删除这一页
        file->deletePage(PageNo);
    }

    void BufMgr::printSelf(void)
    {
        BufDesc *tmpbuf;
        int validFrames = 0;

        for (std::uint32_t i = 0; i < numBufs; i++)
        {
            tmpbuf = &(bufDescTable[i]);
            std::cout << "FrameNo:" << i << " ";
            tmpbuf->Print();

            if (tmpbuf->valid == true)
                validFrames++;
        }

        std::cout << "Total Number of Valid Frames:" << validFrames << "\n";
    }

}
