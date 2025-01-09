import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store"; // Import your RootState from your Redux store
import { Menu } from "@/stores/menuSlice"; // Assuming Menu type is imported from the correct file

const menu: Array<Menu | "divider"> = [
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
  {
    icon: 'Airplay',
    pathname: '/approve',
    title: 'Home'
  },
];

// Fetch the logged-in user's role from the Redux store
// const userRole = useSelector((state: RootState) => state.user.user?.role);
const userRole = "FIELD-TECHNICIAN";
const filteredMenu = menu.filter(item => {
  if (item === "divider") return true; // Always show dividers

  if (userRole === "ADMIN") {
    return true; // Show all items for ADMIN
  }

  // For FIELD-TECHNICIAN, show only Dashboard, Notifications, and Employees menu
  if (userRole === "FIELD-TECHNICIAN") {
    if (item instanceof Object) {
      return item.title === "Home";
    }
  }

  return true; // Default to false for other cases
});

export default filteredMenu;
