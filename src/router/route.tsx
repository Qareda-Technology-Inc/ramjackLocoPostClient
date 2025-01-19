import { useRoutes } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import DashboardOverview2 from "../pages/DashboardOverview2";
import EmployeeHome from "../pages/EmployeeHome";
import Employees from "../pages/Employees";
import UsersLayout3 from "../pages/UsersLayout3";
import ProfileOverview2 from "../pages/ProfileOverview2";
import ProfileOverview3 from "../pages/ProfileOverview3";
import WizardLayout1 from "../pages/WizardLayout1";
import WizardLayout2 from "../pages/WizardLayout2";
import WizardLayout3 from "../pages/WizardLayout3";
import BlogLayout1 from "../pages/BlogLayout1";
import BlogLayout2 from "../pages/BlogLayout2";
import BlogLayout3 from "../pages/BlogLayout3";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ErrorPage from "../pages/ErrorPage";
import ViewEmployee from "../pages/ViewEmployee";
import EditEmployee from "../pages/EditEmployee";

import ProductList from "../pages/Sites";

import RegularForm from "../pages/RegularForm";

import Layout from "../themes";

import PrivateRoute from "@/components/PrivateRoute";
import Unauthorized from "@/pages/Unauthorized";
import AddUser from "@/pages/AddUser";
import Sites from "@/pages/Sites";
import AddSite from "@/pages/AddSite";
import Assignment from "@/pages/Assignment";
import Assignments from "@/pages/Assignments";
import EditAssignment from "@/pages/EditAssignment";
import Accordion from "@/pages/Accordion";
import Alert from "@/pages/Alert";
import WysiwygEditor from "@/pages/WysiwygEditor";
import TomSelect from "@/pages/TomSelect";
import Dashboard from "@/pages/Dashboard";
import ViewSite from "@/pages/ViewSite";
import EditSite from "@/pages/EditSite";
import ViewAssignment from "@/pages/ViewAssignment";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";

import ChangePassword from"@/pages/ChangePassword";
import ResetPassword from "@/pages/ResetPassword";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <PrivateRoute element={<Dashboard />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN"]} />,
        },
        {
          path: "employees",
          element: <PrivateRoute element={<Employees />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
        },
        {
          path: "view-employee/:id",
          element: <PrivateRoute element={<ViewEmployee />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
        },
        {
          path: "edit-employee/:id",
          element: <PrivateRoute element={<EditEmployee />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
        },
        {
          path: "add-employee",
          element: <PrivateRoute element={<AddUser />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "sites",
          element: <PrivateRoute element={<Sites />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN"]} />,
        },
        {
          path: "add-site",
          element: <PrivateRoute element={<AddSite />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-site/:id",
          element: <PrivateRoute element={<ViewSite />} allowedRoles={["ADMIN"]} />,
        },

        {
          path: "edit-site/:id",
          element: <PrivateRoute element={<EditSite />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-assign",
          element: <PrivateRoute element={<Assignments />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "assign-employee",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "edit-assignment/:id",
          element: <PrivateRoute element={<EditAssignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "generate-report",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-report",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "notification",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "systems-settings",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "user-permissions",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "approve",
          element: <PrivateRoute element={<EmployeeHome />} allowedRoles={["FIELD-TECHNICIAN", "PRESIDENT"]} />, 
        },
        {
          path: "view-assignment/:id",
          element: <PrivateRoute element={<ViewAssignment />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "/profile/:userId",
          element: <PrivateRoute element={<Profile />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "PRESIDENT"]} />,
        },
        {
          path: "/edit-profile/:userId",
          element: <PrivateRoute element={<EditProfile />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "PRESIDENT"]} />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    // forgot password
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />
    },
    // first time login
    {
      path: "/change-password",
      element: <ChangePassword />
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
