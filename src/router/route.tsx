import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1";
import DashboardOverview2 from "../pages/DashboardOverview2";
import DashboardOverview3 from "../pages/DashboardOverview3";
import Employees from "../pages/Employees";
import UsersLayout2 from "../pages/UsersLayout2";
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
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import ProfileOverview1 from "../pages/ViewEmployee";
import EditEmployee from "../pages/EditEmployee";

import RegularForm from "../pages/RegularForm";

import Layout from "../themes";

import PrivateRoute from "@/components/PrivateRoute";
import Unauthorized from "@/pages/Unauthorized";
import AddUser from "@/pages/AddUser";
import Sites from "@/pages/Sites";
import AddSite from "@/pages/AddSite";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <PrivateRoute element={<DashboardOverview1 />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
        },
        {
          path: "dashboard-overview-2",
          element: <PrivateRoute element={<DashboardOverview2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "dashboard-overview-3",
          element: <PrivateRoute element={<DashboardOverview3 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "employees",
          element: <PrivateRoute element={<Employees />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
        },
        {
          path: "view-employee/:id",
          element: <PrivateRoute element={<ProfileOverview1 />} allowedRoles={["ADMIN", "PRESIDENT"]} />,
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
          element: <PrivateRoute element={<Sites />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "add-site",
          element: <PrivateRoute element={<AddSite />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-site/id",
          element: <PrivateRoute element={<AddSite />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "edit-site/id",
          element: <PrivateRoute element={<AddSite />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-assign",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "assign-employee",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "assignment-crud",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "generate-report",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "view-report",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "notification",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "systems-settings",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
        {
          path: "user-permissions",
          element: <PrivateRoute element={<UsersLayout2 />} allowedRoles={["ADMIN"]} />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
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
