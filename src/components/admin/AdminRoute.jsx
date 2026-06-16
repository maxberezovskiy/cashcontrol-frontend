import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsAdmin,
} from "@/store/authSlice";

// Пускает только администратора. Пока профиль (/me) не загружен — показываем
// загрузку, чтобы не сделать ложный redirect до того, как роль станет известна.
export default function AdminRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user === null) {
    return <div className="p-10 text-center text-gray-400">Загрузка…</div>;
  }
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
