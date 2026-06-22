import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "@/api/auth";
import { extractApiError } from "@/utils/apiError";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async ({ password }) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.passwordResetConfirm(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Новый пароль</h1>
        <p className="text-sm text-gray-500 mb-6">Придумайте новый пароль для входа.</p>

        {!token ? (
          <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">
            Ссылка недействительна — отсутствует токен.{" "}
            <Link to="/forgot-password" className="font-medium underline">
              Запросить новую
            </Link>
          </div>
        ) : done ? (
          <div className="bg-success-50 text-success-700 text-sm rounded-lg px-4 py-3">
            Пароль обновлён. Перенаправляем на страницу входа…
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Введите пароль",
                    minLength: { value: 8, message: "Минимум 8 символов" },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-danger-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
                <input
                  type="password"
                  {...register("confirm", {
                    required: "Повторите пароль",
                    validate: (v) => v === watch("password") || "Пароли не совпадают",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="••••••••"
                />
                {errors.confirm && <p className="text-danger-500 text-xs mt-1">{errors.confirm.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Сохранение…" : "Сохранить пароль"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
