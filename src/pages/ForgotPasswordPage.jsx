import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "@/api/auth";
import { extractApiError } from "@/utils/apiError";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    setError(null);
    try {
      // Анти-энумерация: бэк всегда отвечает 200, поэтому показываем успех безусловно.
      await authApi.passwordResetRequest(email);
      setSent(true);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Сброс пароля</h1>
        <p className="text-sm text-gray-500 mb-6">
          Укажите email — пришлём ссылку для смены пароля.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
              Если аккаунт с таким email существует, мы отправили на него ссылку для
              сброса пароля. Проверьте почту.
            </div>
            <Link
              to="/login"
              className="block text-center text-primary-600 font-medium hover:underline text-sm"
            >
              Вернуться ко входу
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
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
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Отправка…" : "Отправить ссылку"}
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              <Link to="/login" className="text-primary-600 font-medium hover:underline">
                Вернуться ко входу
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
