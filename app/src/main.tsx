import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import TrackItem from "./TrackItem.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//setting up react router.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/tracks/:id",
    element: <TrackItem />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
