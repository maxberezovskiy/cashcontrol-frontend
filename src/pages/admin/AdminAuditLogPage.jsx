import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";

const PAGE = 30;
const ACTIONS = [
  "user.update", "user.activate", "user.deactivate", "user.role_change", "user.delete",
  "user.password_reset_requested", "auth.password_reset_self_requested",
  "auth.password_reset_completed", "settings.smtp_update",
];

export default function AdminAuditLogPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [action, setAction] = useState("");
  const [actorId, setActorId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = { offset, limit: PAGE };
    if (action) params.action = action;
    if (actorId) params.actor_id = actorId;
    if (targetId) params.target_id = targetId;
    try {
      const data = await adminApi.auditLogs(params);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, [offset, action, actorId, targetId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Журнал аудита</h1>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Действие</label>
          <select value={action} onChange={(e) => { setAction(e.target.value); setOffset(0); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Все</option>
            {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Actor ID</label>
          <input value={actorId} onChange={(e) => { setActorId(e.target.value); setOffset(0); }} className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Target ID</label>
          <input value={targetId} onChange={(e) => { setTargetId(e.target.value); setOffset(0); }} className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      {error && <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Время</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Действие</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Детали</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 align-top">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(r.created_at).toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.action}</td>
                <td className="px-4 py-3 text-gray-500">{r.actor_user_id ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{r.target_user_id ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.meta ? JSON.stringify(r.meta) : ""}</td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Записей нет</td></tr>
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
