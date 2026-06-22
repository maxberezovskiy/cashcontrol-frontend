import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginThunk, selectAuthLoading, selectAuthError, selectIsAuthenticated, clearError } from "@/store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (data) => {
    await dispatch(loginThunk(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Добро пожаловать</h1>
        <p className="text-sm text-gray-500 mb-6">Войдите в свой аккаунт</p>

        {error && (
          <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Введите email" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              {...register("password", { required: "Введите пароль" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-danger-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="text-right -mt-1">
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
              Забыли пароль?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
