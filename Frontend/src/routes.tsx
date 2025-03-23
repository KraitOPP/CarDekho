import { createBrowserRouter } from "react-router";
import Error404Page from "./Pages/Error404";
import HomePage from "./Pages/home";
import LoginPage from "./Pages/Authentication/login";
import RegisterPage from "./Pages/Authentication/register";
import AuthLayout from "./Layout/authLayout";
import MainLayout from "./Layout/mainLayout";
import ProfilePage from "./Pages/User/profile";
import ForgetPasswordPage from "./Pages/Authentication/forget-password";

export const router = createBrowserRouter([
  {
    path:"*",
    element: <Error404Page/>
  },
  {
    path: "/",
    element: <MainLayout />,
    children:[
      {
        path:"/",
        element: <HomePage />
      },
      {
          path: "u/profile",
          element: <ProfilePage />
      },
    ]
  },
  {
    path: "/accounts/",
    element: <AuthLayout />,
    children:[
      {
          path: "sign-in",
          element: <LoginPage />
      },
      {
          path: "sign-up",
          element: <RegisterPage />
      },
      {
          path: "forget-password",
          element: <ForgetPasswordPage />
      },
    ]
  },
]);