import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";

const customRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export default customRouter;
