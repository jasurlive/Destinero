import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMap,
  FiList,
  FiHelpCircle,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import "../css/menu.css";
import { useTheme } from "../hooks/useTheme";
import { useShortcuts } from "../hooks/useShortcuts";

export type MenuItem = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  mobile?: boolean;
};

export default function Menu({
  items = [
    { label: "Map", icon: <FiMap />, href: "/", mobile: true },
    { label: "Places", icon: <FiList />, href: "/places", mobile: true },
    { label: "Help", icon: <FiHelpCircle />, href: "/help", mobile: true },
  ],
}: {
  items?: MenuItem[];
}) {
  const [collapsed, setCollapsed] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useShortcuts({ "ctrl+j": toggleTheme });

  const menuItems: MenuItem[] = [
    ...items,
    {
      label: theme === "dark" ? "Light theme" : "Dark theme",
      icon: theme === "dark" ? <FiSun /> : <FiMoon />,
      onClick: toggleTheme,
      mobile: true,
    },
  ];

  return (
    <nav className={`menu ${collapsed ? "menu-collapsed" : ""}`}>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setCollapsed((value) => !value)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {menuItems.map((item) => {
        const className = `menu-item ${
          item.mobile ? "menu-mobile-visible" : "menu-desktop-only"
        }`;

        const content = (
          <>
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </>
        );

        return item.onClick ? (
          <button
            key={item.label}
            type="button"
            className={className}
            onClick={item.onClick}
            title={item.label}
          >
            {content}
          </button>
        ) : item.href ? (
          // NavLink adds .active on the current page; `end` so "/" isn't active everywhere
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={className}
            title={item.label}
          >
            {content}
          </NavLink>
        ) : null;
      })}
    </nav>
  );
}
