import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const dispatch = useDispatch();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => dispatch(logout())}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
