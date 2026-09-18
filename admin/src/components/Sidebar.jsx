import React from "react";
import { NavLink } from "react-router-dom";
import { FiList, FiPlusCircle, FiShoppingBag } from "react-icons/fi";

const links = [
  { to: "/add", label: "Add items", Icon: FiPlusCircle },
  { to: "/list", label: "List items", Icon: FiList },
  { to: "/orders", label: "Orders", Icon: FiShoppingBag },
];

const Sidebar = () => {
  return (
    <aside className="w-16 shrink-0 self-stretch border-r border-ink-200 bg-white md:w-56">
      <nav className="sticky top-[57px] flex flex-col gap-1.5 p-3 md:p-4">
        <p className="hidden px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400 md:block">
          Manage
        </p>

        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${
                isActive
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              }`
            }
          >
            <Icon className="shrink-0 text-lg" />
            <span className="hidden md:block">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
