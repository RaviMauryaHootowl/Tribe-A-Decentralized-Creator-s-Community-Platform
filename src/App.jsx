import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUp/SignUpPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: (<SignUpPage />),
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
