import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  selectUsers,
  selectUsersTotal,
  selectAdminLoading,
  selectAdminError,
} from "@/store/adminSlice";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";

const PAGE = 20;

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const total = useSelector(selectUsersTotal);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [offset, setOffset] = useState(0);
  const [actionError, setActionError] = useState(null);

  const load = () => {
    const params = { offset, limit: PAGE };
    if (q) params.q = q;
    if (role) params.role = role;
    if (isActive !== "") params.is_active = isActive;
    dispatch(fetchUsers(params));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [offset, role, isActive]);

  const onSearch = (e) => {
    e.preventDefault();
    if (offset !== 0) setOffset(0);
    else load();
  };

  const doAction = async (fn, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setActionError(null);
    try {
      await fn();
      load();
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>

      <form onSubmit={onSearch} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Поиск</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="email или имя"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Роль</label>
          <select value={role} onChange={(e) => { setRole(e.target.value); setOffset(0); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Все</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Статус</label>
          <select value={isActive} onChange={(e) => { setIsActive(e.target.value); setOffset(0); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Все</option>
            <option value="true">Активные</option>
            <option value="false">Отключённые</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600">
          Найти
        </button>
      </form>

      {(error || actionError) && (
        <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">{actionError || error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Имя</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Роль</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Статус</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/users/${u.id}`} className="text-primary-600 font-medium hover:underline">{u.email}</Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{u.full_name || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_superuser ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.is_superuser ? "admin" : "user"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? "bg-success-100 text-success-700" : "bg-danger-100 text-danger-600"}`}>
                    {u.is_active ? "активен" : "отключён"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  {u.is_active ? (
                    <button onClick={() => doAction(() => adminApi.deactivateUser(u.id), `Деактивировать ${u.email}?`)} className="text-xs text-warning-600 hover:underline">Отключить</button>
                  ) : (
                    <button onClick={() => doAction(() => adminApi.activateUser(u.id))} className="text-xs text-success-600 hover:underline">Включить</button>
                  )}
                  <button onClick={() => doAction(() => adminApi.deleteUser(u.id), `Удалить ${u.email}? Будут безвозвратно удалены ВСЕ его счета, транзакции и бюджеты.`)} className="text-xs text-danger-600 hover:underline">Удалить</button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Ничего не найдено</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Всего: {total}{loading && " · загрузка…"}</span>
        <div className="space-x-2">
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100">← Назад</button>
          <span>{Math.floor(offset / PAGE) + 1} / {Math.max(1, Math.ceil(total / PAGE))}</span>
          <button disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100">Вперёд →</button>
        </div>
      </div>
    </div>
  );
}
