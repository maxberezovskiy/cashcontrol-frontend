import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";
import { formatMoney } from "@/utils/format";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [txns, setTxns] = useState([]);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ email: "", full_name: "" });

  const reload = useCallback(async () => {
    setError(null);
    try {
      const u = await adminApi.getUser(id);
      setUser(u);
      setForm({ email: u.email, full_name: u.full_name || "" });
      const [acc, tx] = await Promise.all([
        adminApi.userAccounts(id),
        adminApi.userTransactions(id, { limit: 20 }),
      ]);
      setAccounts(acc);
      setTxns(tx);
    } catch (err) {
      setError(extractApiError(err));
    }
  }, [id]);

  useEffect(() => { reload(); }, [reload]);

  const run = async (fn, confirmMsg, successMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setError(null);
    setMsg(null);
    try {
      await fn();
      if (successMsg) setMsg(successMsg);
      await reload();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <Link to="/admin/users" className="text-sm text-primary-600 hover:underline">← К списку</Link>
        {error ? <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">{error}</div>
               : <div className="text-gray-400">Загрузка…</div>}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/users" className="text-sm text-primary-600 hover:underline">← К списку</Link>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_superuser ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{user.is_superuser ? "admin" : "user"}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? "bg-success-100 text-success-700" : "bg-danger-100 text-danger-600"}`}>{user.is_active ? "активен" : "отключён"}</span>
      </div>

      {error && <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      {msg && <div className="bg-success-50 text-success-700 text-sm rounded-lg px-4 py-3">{msg}</div>}

      {/* Профиль */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Профиль</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Имя</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <button onClick={() => run(() => adminApi.updateUser(id, form), null, "Профиль сохранён")} className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600">Сохранить</button>
      </section>

      {/* Управление */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Управление</h2>
        <div className="flex flex-wrap gap-2">
          {user.is_active ? (
            <button onClick={() => run(() => adminApi.deactivateUser(id), `Деактивировать ${user.email}?`)} className="px-3 py-2 rounded-lg border border-warning-300 text-warning-700 text-sm hover:bg-warning-50">Деактивировать</button>
          ) : (
            <button onClick={() => run(() => adminApi.activateUser(id))} className="px-3 py-2 rounded-lg border border-success-300 text-success-700 text-sm hover:bg-success-50">Активировать</button>
          )}
          <button onClick={() => run(() => adminApi.setRole(id, user.is_superuser ? "user" : "admin"), `Сменить роль на ${user.is_superuser ? "user" : "admin"}?`)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            {user.is_superuser ? "Снять роль admin" : "Назначить admin"}
          </button>
          <button onClick={() => run(() => adminApi.resetPassword(id), `Отправить ${user.email} письмо для сброса пароля?`, "Письмо для сброса пароля отправлено")} className="px-3 py-2 rounded-lg border border-primary-300 text-primary-700 text-sm hover:bg-primary-50">Сбросить пароль</button>
        </div>
      </section>

      {/* Read-only финансы */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Финансы (только просмотр)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {accounts.map((a) => (
            <div key={a.id} className="border border-gray-200 rounded-xl p-3">
              <p className="text-sm font-medium text-gray-700">{a.icon || "💳"} {a.name}</p>
              <p className="text-lg font-bold text-gray-900">{formatMoney(a.balance)}</p>
              <p className="text-xs text-gray-400">{a.currency}</p>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-gray-400 text-sm col-span-full">Счетов нет</p>}
        </div>
        <h3 className="text-sm font-medium text-gray-600 pt-2">Последние транзакции</h3>
        {txns.length === 0 ? (
          <p className="text-gray-400 text-sm">Транзакций нет</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {txns.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 text-gray-500">{new Date(t.date).toLocaleDateString("ru-RU")}</td>
                  <td className="py-2 text-gray-700">{t.description || "—"}</td>
                  <td className={`py-2 text-right font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-danger-500"}`}>
                    {t.transaction_type === "income" ? "+" : "−"}{formatMoney(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
