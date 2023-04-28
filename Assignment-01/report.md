<div align="center">
    <h1 style="display: flex; flex-direction: column; gap: 24px;">
        <span>哈尔滨工业大学</span>
        <span>《数据库系统》</span>
        <span>实验报告一</span>
        <span>(2023年度春季学期)</span>
    </h1>
</div>

|       |            |
| :---: | :--------: |
| 姓名  |    ***     |
| 学号  | 120L02xxxx |
| 学院  |  计算学部  |
| 教师  |            |



# 实验1

## 一、实验目的

掌握MySQL关系数据库管理系统的基本命令，并熟练使用SQL语言管理MySQL数据库。掌握SQL语言的使用方法，学会使用SQL语言进行关系数据库查询，特别是聚集查询、连接查询和嵌套查询。

## 二、实验环境

操作系统：Ubuntu 20.04

MySQL版本：5.7.39

## 三、实验过程及结果

### 创建数据表：

Employee 表：

```sql
CREATE TABLE employee(
    cname varchar(12),
    cssn char(18),
    address text,
    salary int,
    superssn char(18),
    dno char(3),
    primary key(cssn)
);
```

Department 表：

```sql
CREATE TABLE department(
	dname varchar(15),
    dno char(3),
    mgrssn char(18),
    mgrstartdate date,
    primary key(dno)
);
```

Project 表：

```sql
CREATE TABLE project(
	pname VARCHAR(3),
    pno CHAR(2),
    plocation TEXT,
    dno CHAR(3),
    PRIMARY KEY(pno)
);
```

Works on 表：

```sql
CREATE TABLE works_on(
	cssn CHAR(18),
    pno CHAR(2),
    hours INT,
    PRIMARY KEY(cssn, pno)
);
```

### 导入数据

使用 `LOAD DATA` 命令

### 查询

+ 参加了项目名为“SQL Project”的员工名字

  ```sql
  SELECT cname FROM employee
  WHERE cssn in (
  	SELECT cssn FROM project, works_on
      WHERE project.pno=works_on.pno AND pname="SQL" AND hours>0
  );
  ```

  ![image-20230324095317875](images\image-20230324095317875.jpg)

+ 在“研发部”工作且工资低于3000元的员工名字和地址

  ```sql
  SELECT cname, address FROM employee, department
  WHERE employee.dno=department.dno AND dname="研发部" AND salary<3000;
  ```

  ![image-20230324100416751](images\image-20230324100416751.jpg)

+ 没有参加项目编号为P1的项目的员工姓名

  ```sql
  SELECT cname FROM employee
  WHERE cssn NOT IN (
  	SELECT cssn FROM works_on
      WHERE pno="P1" AND hours>0
  );
  ```

  ![image-20230324100613029](images\image-20230324100613029.jpg)

+ 由张红领导的工作人员的姓名和所在部门的名字

  ```sql
  SELECT cname, dname FROM employee, department
  WHERE employee.dno=department.dno AND superssn in (
  	SELECT cssn FROM employee
      WHERE cname="张红"
  );
  ```
  
  ![image-20230324101056106](images\image-20230324101056106.jpg)
  
+ 至少参加了项目编号为P1和P2的项目的员工号
  
  ```sql
  SELECT cssn FROM works_on
  WHERE pno="P1" AND hours>0 AND cssn IN (
  	SELECT cssn FROM works_on
      WHERE pno="P2" AND hours>0
  );
  ```
  
  ![image-20230324101317681](images\image-20230324101317681.jpg)
  
+ 参加了全部项目的员工号码和姓名
  
  ```sql
  SELECT cssn, cname FROM employee
  WHERE NOT EXISTS(
  	SELECT pno FROM project
      WHERE NOT EXISTS(
      	SELECT * FROM works_on
          WHERE works_on.pno=project.pno AND works_on.cssn=employee.cssn
      )
  );
  ```
  
  ![image-20230324101602589](images\image-20230324101602589.jpg)
  
+ 员工平均工资低于3000元的部门名称
  
  ```sql
  SELECT dname FROM department
  WHERE dno in (
  	SELECT dno FROM employee
      GROUP BY dno HAVING AVG(salary)<3000
  );
  ```
  
  ![image-20230324101728731](images\image-20230324101728731.jpg)

+ 至少参与了3个项目且工作总时间不超过8小时的员工名字

  ```sql
  SELECT cname FROM employee
  WHERE cssn IN (
  	SELECT cssn FROM works_on
      GROUP BY cssn HAVING COUNT(pno)>=3 AND SUM(hours)<=8
  );
  ```

  ![image-20230324101924747](images\image-20230324101924747.jpg)

+ 至少参与了3个项目且工作总时间不超过8小时的员工名字

  ```sql
  SELECT sums.dno, sumsalary/sumhours as hoursavgsalary
  FROM (
  	SELECT dno, SUM(salary) as sumsalary
      FROM employee GROUP BY dno
  ) as sums, (
  	SELECT dno, SUM(hours) as sumhours
      FROM works_on JOIN employee
      ON works_on.cssn=employee.cssn
      GROUP BY dno
  ) as sumh
  WHERE sums.dno=sumh.dno;
  ```

  ![image-20230324102249156](images\image-20230324102249156.jpg)


## 四、实验心得

通过本次实验，熟悉了 SQL 语言的常用查询方法，包括条件查询、子查询等。

列举遇到并解决的问题：

+ 远程导入数据

  由于 MySQL 部署在远程服务器的 Docker 容器内，无法使用 `LOAD DATA` 导入数据，因此使用 SQL Workbench 进行导入，由于仅支持导入 `csv/json` 格式数据，故需要手动转换，同时设置数据表对应字段字符集为 `UTF-8` 以适应中文字段值

+ MySQL 终端查询中文字段时默认显示乱码，解决方案是在 `/ect/my.cnf` 添加以下内容：

  ```cnf
  [client]
  default-character-set=utf8mb4
  
  [mysql]
  default-character-set=utf8mb4
  
  
  [mysqld]
  collation-server = utf8mb4_unicode_520_ci
  init-connect='SET NAMES utf8mb4'
  character-set-server = utf8mb4
  ```

  重启 Docker 容器即可

+ MySQL 终端无法输入中文字符，只需要在启动 MySQL 终端前设置环境变量 `export LANG=en_US.UTF-8` 即可