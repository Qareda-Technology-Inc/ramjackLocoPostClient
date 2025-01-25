import { useRoutes } from "react-router-dom";
import EmployeeHome from "../pages/EmployeeHome";
import Employees from "../pages/Employees";
import Test from "../pages/FaqLayout2";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ErrorPage from "../pages/ErrorPage";
import ViewEmployee from "../pages/ViewEmployee";
import EditEmployee from "../pages/EditEmployee";
import Layout from "../themes";
import PrivateRoute from "@/components/PrivateRoute";
import Unauthorized from "@/pages/Unauthorized";
import AddUser from "@/pages/AddUser";
import Sites from "@/pages/Sites";
import AddSite from "@/pages/AddSite";
import Assignment from "@/pages/Assignment";
import Assignments from "@/pages/Assignments";
import EditAssignment from "@/pages/EditAssignment";
import Dashboard from "@/pages/Dashboard";
import ViewSite from "@/pages/ViewSite";
import EditSite from "@/pages/EditSite";
import ViewAssignment from "@/pages/ViewAssignment";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import ChangePassword from"@/pages/ChangePassword";
import ResetPassword from "@/pages/ResetPassword";
import ViewAllAssignments from "@/pages/viewAllAssignment";
import KPIForm from "@/pages/KPIForm";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <PrivateRoute element={<Dashboard />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER"]} />,
        },
        {
          path: "employees",
          element: <PrivateRoute element={<Employees />} allowedRoles={["ADMIN", "PRESIDENT", "MANAGER"]} />,
        },
        {
          path: "view-employee/:id",
          element: <PrivateRoute element={<ViewEmployee />} allowedRoles={["ADMIN", "PRESIDENT", "MANAGER"]} />,
        },
        {
          path: "edit-employee/:id",
          element: <PrivateRoute element={<EditEmployee />} allowedRoles={["ADMIN", "PRESIDENT", "MANAGER"]} />,
        },
        {
          path: "add-employee",
          element: <PrivateRoute element={<AddUser />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "sites",
          element: <PrivateRoute element={<Sites />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER"]} />,
        },
        {
          path: "add-site",
          element: <PrivateRoute element={<AddSite />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "view-site/:id",
          element: <PrivateRoute element={<ViewSite />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },

        {
          path: "edit-site/:id",
          element: <PrivateRoute element={<EditSite />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "view-assign",
          element: <PrivateRoute element={<Assignments />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "assign-employee",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "edit-assignment/:id",
          element: <PrivateRoute element={<EditAssignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "generate-report",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "view-report",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "notification",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "systems-settings",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "user-permissions",
          element: <PrivateRoute element={<Assignment />} allowedRoles={["ADMIN", "MANAGER"]} />,
        },
        {
          path: "approve",
          element: <PrivateRoute element={<EmployeeHome />} allowedRoles={["FIELD-TECHNICIAN", "FIELD-ENGINEERS", "SITE-REP"]} />, 
        },
        {
          path: "view-assignment/:id",
          element: <PrivateRoute element={<ViewAssignment />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER", "FIELD-ENGINEER", "SITE-REP"]} />,
        },
        {
          path: "assignments",
          element: <PrivateRoute element={<ViewAllAssignments />} allowedRoles={["FIELD-TECHNICIAN", "MANAGER", "FIELD-ENGINEER", "SITE-REP"]} />,
        },
        {
          path: "/profile/:userId",
          element: <PrivateRoute element={<Profile />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER", "FIELD-ENGINEER", "SITE-REP"]} />,
        },
        {
          path: "/edit-profile/:userId",
          element: <PrivateRoute element={<EditProfile />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER", "FIELD-ENGINEER", "SITE-REP"]} />,
        },
        {
          path: "/test",
          element: <PrivateRoute element={<KPIForm />} allowedRoles={["ADMIN", "FIELD-TECHNICIAN", "MANAGER", "FIELD-ENGINEER", "SITE-REP"]} />,
        },
        {
          path: "/tasks",
          element: <PrivateRoute element={<KPIForm />} allowedRoles={["ADMIN", "MANAGER", "SITE-REP"]} />,
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
