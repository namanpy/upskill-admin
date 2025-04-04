import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

// Define the type for sub menu items
type SubMenuItem = {
  displayName: string;
  route: string;
};

// Define the type for menu items
type MenuItem = {
  displayName: string;
  route: string;
  icon: React.ElementType;
  subItems?: SubMenuItem[];
};

// Define the menu items
const menuItems: MenuItem[] = [
  {
    displayName: "Home",
    route: "/",
    icon: HomeIcon,
    subItems: [
      { displayName: "Dashboard", route: "/dashboard" },
      { displayName: "Analytics", route: "/analytics" },
    ],
  },
  {
    displayName: "Category",
    route: "/about",
    icon: CategoryIcon,
    subItems: [
      { displayName: "All Categories", route: "/category/list" },
      { displayName: "Add Categories", route: "/category/add" },
    ],
  },
  {
    displayName: "Course",
    route: "/about",
    icon: SchoolIcon,
    subItems: [
      { displayName: "All Courses", route: "/courses/list" },
      { displayName: "Add Course", route: "/courses/add" },
    ],
  },
  {
    displayName: "Settings",
    route: "/settings",
    icon: SettingsIcon,
    subItems: [
      { displayName: "Profile", route: "/settings/profile" },
      { displayName: "Security", route: "/settings/security" },
    ],
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(state);
    };

  const handleSubMenuClick = (route: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [route]: !prev[route],
    }));
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{ position: "fixed", top: 10, left: 10 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.route}>
              <ListItem onClick={() => handleSubMenuClick(item.route)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.displayName} />
                {item.subItems &&
                  (openSubMenus[item.route] ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={openSubMenus[item.route]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.route} sx={{ pl: 4 }}>
                        <Link
                          href={subItem.route}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <ListItemText primary={subItem.displayName} />
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
