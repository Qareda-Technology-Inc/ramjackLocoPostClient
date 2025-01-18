import { Menu } from "@/stores/menuSlice";

// First, let's create a type for menu items
type MenuItem = Menu | "divider";

const menu: MenuItem[] = [
  {
    icon: "Home",
    title: "Dashboard",
    pathname: '/',
  },
  {
    icon: "Users",
    title: "Employees",
    subMenu: [
      {
        icon: "Users",
        pathname: "/employees",
        title: "View All Employees",
      },
      {
        icon: "UserPlus",
        pathname: "/add-employee",
        title: "Add Employee",
      },
    ],
  },
  {
    icon: "TentTree",
    title: "Sites",
    subMenu: [
      {
        icon: "Globe",
        pathname: "/sites",
        title: "View All sites",
      },
      {
        icon: "MapPin",
        pathname: "/add-site",
        title: "Add Site",
      },
    ],
  },
  {
    icon: "Notebook",
    title: "Assignments",
    subMenu: [
      {
        icon: "NotebookTabs",
        pathname: "/view-assign",
        title: "View All Assignment",
      },
      {
        icon: "NotebookPen",
        pathname: "/assign-employee",
        title: "Assign Employee to Site",
      },
    ],
  },
  {
    icon: "Database",
    title: "Reports",
    subMenu: [
      {
        icon: "DatabaseBackup",
        pathname: "/generate-report",
        title: "Generate report",
      },
      {
        icon: "Eye",
        pathname: "/view-report",
        title: "View Reports",
      },
    ],
  },
  {
    icon: "Bell",
    pathname: "/notification",
    title: "Notifications",
  },
  "divider",
  {
    icon: "Settings",
    title: "Settings",
    subMenu: [
      {
        icon: "Wrench",
        pathname: "/systems-settings",
        title: "Systems Settings",
      },
      {
        icon: "UserCog",
        pathname: "/user-permissions",
        title: "Role and Permission Management",
      },
    ],
  },
  "divider",
  {
    icon: "LogOut",
    pathname: "/login",
    title: "Logout",
  },
];

export default menu;
