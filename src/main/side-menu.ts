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
        icon: "UserSearch",
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
        icon: "Plus",
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
        icon: "Presentation",
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
    icon: "Spline",
    title: "Tasks and KPIs",
    subMenu: [
      {
        icon: "View",
        pathname: "/tasks",
        title: "Create Task",
      },
      {
        icon: "Eye",
        pathname: "/view-report",
        title: "View Reports",
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
    icon: "GalleryThumbnails",
    pathname: "/my-assignments",
    title: "My Assignments",
  },
  {
    icon: "Calendar",
    pathname: "/my-tasks",
    title: "My Tasks",
  },
  {
    icon: "Sparkles",
    pathname: "/my-kpis",
    title: "Performance KPI",
  },
  
  "divider",
  
  {
    icon: "BellDot",
    pathname: "/notification",
    title: "Notifications",
  },
  {
    icon: "HelpCircle",
    pathname: "/support",
    title: "Support / Help",
  },
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
  {
    icon: "Eye",
    pathname: "/test",
    title: "Test",
  }
];

export default menu;
