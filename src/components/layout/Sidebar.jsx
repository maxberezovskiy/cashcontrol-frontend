import { NavLink } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Главная", icon: "🏠", end: true },
  { to: "/transactions", label: "Транзакции", icon: "💸" },
  { to: "/accounts", label: "Счета", icon: "🏦" },
  { to: "/budgets", label: "Бюджеты", icon: "🎯" },
  { to: "/categories", label: "Категории", icon: "📂" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">💰 CashControl</h1>
        <p className="text-xs text-gray-500 mt-0.5">Семейный бюджет</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
