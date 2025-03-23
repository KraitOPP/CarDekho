import { createBrowserRouter } from "react-router";
import Error404Page from "./Pages/Error404";
import HomePage from "./Pages/home";
import LoginPage from "./Pages/Authentication/login";
import RegisterPage from "./Pages/Authentication/register";

export const router = createBrowserRouter([
  {
    path:"*",
    element: <Error404Page/>
  },
  {
    path:"/",
    element: <HomePage />
  },
  // {
  //   path: "/",
  //   element: <MainLayout />,
  //   children:[
  //     {
  //         path: "u/profile",
  //         element: <ProfilePage />
  //     },
  //   ]
  // },
  {
    path: "/accounts/",
    // element: <AuthLayout />,
    children:[
      {
          path: "sign-in",
          element: <LoginPage />
      },
      {
          path: "sign-up",
          element: <RegisterPage />
      },
      // {
      //     path: "forget-password",
      //     element: <ForgetPasswordPage />
      // },
    ]
  },
]);