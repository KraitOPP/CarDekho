import { createBrowserRouter } from "react-router";
import Error404Page from "./Pages/Error404";
import HomePage from "./Pages/home";
import LoginPage from "./Pages/Authentication/login";
import RegisterPage from "./Pages/Authentication/register";
import AuthLayout from "./Layout/authLayout";
import MainLayout from "./Layout/mainLayout";
import ProfilePage from "./Pages/User/profile";
import ForgetPasswordPage from "./Pages/Authentication/forget-password";
import ContactPage from "./Pages/ContactPage";
import CarBookingPage from "./Pages/BookingPage";
import CarRentalTestimonialPage from "./Pages/PostTestimonials";
import VehicleBrandManagement from "./Pages/Admin/AddBrand";
import VehicleManagement from "./Pages/Admin/AddVehicle";
import Dashboard from "./Pages/Admin/Dashboard";
import TestimonialManagement from "./Pages/Admin/TestimonialManagement";
import BookingManagement from "./Pages/Admin/BookingManagement";
import CustomerManagement from "./Pages/Admin/CustomerManagement";

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
        path:"/car/:id",
        element: <CarBookingPage />
      },
      {
        path: "u/profile",
        element: <ProfilePage />
      },
      {
        path:"/testimonial/add-new",
        element: <CarRentalTestimonialPage />
      },
      {
          path: "contact-us",
          element: <ContactPage />
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
  {
    path: "/dashboard/",
    element: <MainLayout />,
    children:[
      {
          path: "",
          element: <Dashboard />
      },
      {
          path: "booking",
          element: <BookingManagement />
      },
      {
          path: "users",
          element: <CustomerManagement />
      },
      {
          path: "vehicle",
          element: <VehicleManagement />
      },
      {
          path: "vehicle/brands",
          element: <VehicleBrandManagement />
      },
      {
          path: "testimonial",
          element: <TestimonialManagement />
      },
    ]
  },
]);