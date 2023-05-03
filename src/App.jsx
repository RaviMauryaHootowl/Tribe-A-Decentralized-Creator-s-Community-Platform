import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUp/SignUpPage";
import CreatorFeed from "./pages/CreatorFeed/CreatorFeed";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StoreProvider } from "./utils/Store";
import WagmiProvider from "./utils/WagmiProvider";
import Redirect from "./pages/Redirect/Redirect";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/signup",
            element: <SignUpPage />,
        },
        {
            path: "/creator",
            element: <CreatorFeed />,
        },
        {
          path: "/redirect",
          element: <Redirect />
        }
    ]);

    return (
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
            <StoreProvider>
                <WagmiProvider>
                    <RouterProvider router={router}></RouterProvider>
                </WagmiProvider>
            </StoreProvider>
        </GoogleOAuthProvider>
    );
};

export default App;
