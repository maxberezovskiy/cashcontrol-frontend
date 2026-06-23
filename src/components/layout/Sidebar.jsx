import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  Tag,
  Settings,
  Users,
  ScrollText,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { selectIsAdmin } from "@/store/authSlice";

const navItems = [
  { to: "/",             label: "Главная",    Icon: LayoutDashboard, end: true },
  { to: "/transactions", label: "Транзакции", Icon: ArrowLeftRight },
  { to: "/accounts",     label: "Счета",      Icon: Wallet },
  { to: "/budgets",      label: "Бюджеты",    Icon: Target },
  { to: "/categories",   label: "Категории",  Icon: Tag },
  { to: "/settings",     label: "Настройки",  Icon: Settings },
];

const adminItems = [
  { to: "/admin/users", label: "Пользователи",   Icon: Users },
  { to: "/admin/audit", label: "Журнал аудита",  Icon: ScrollText },
  { to: "/admin/smtp",  label: "Настройки SMTP", Icon: Mail },
];

const linkClass = ({ isActive }) =>
  clsx(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
    isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100"
  );

export default function Sidebar() {
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200 flex items-center gap-2.5">
        <Wallet size={20} className="text-primary-600 shrink-0" />
        <div>
          <h1 className="text-base font-bold text-primary-600 leading-tight">CashControl</h1>
          <p className="text-xs text-gray-500">Семейный бюджет</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="flex items-center gap-1.5 px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <ShieldCheck size={12} />
              Администрирование
            </p>
            {adminItems.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={16} className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
