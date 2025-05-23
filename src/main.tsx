import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { LivePresentation } from "./components/presentation/LivePresentation";
import OutputWindow from "./pages/OutputWindow"; // Ensure this path is correct

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/output",
    element: <OutputWindow />,
  },
  {
    path: "/live-presentation-output",
    element: <LivePresentation />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
