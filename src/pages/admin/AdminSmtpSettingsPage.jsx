import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";

const EMPTY = { host: "", port: 587, username: "", password: "", use_tls: "starttls", from_email: "", enabled: false };

export default function AdminSmtpSettingsPage() {
  const [form, setForm] = useState(EMPTY);
  const [passwordSet, setPasswordSet] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [testTo, setTestTo] = useState("");

  const load = async () => {
    setError(null);
    try {
      const d = await adminApi.getSmtp();
      setForm({
        host: d.host || "", port: d.port || 587, username: d.username || "",
        password: "", use_tls: d.use_tls || "starttls",
        from_email: d.from_email || "", enabled: !!d.enabled,
      });
      setPasswordSet(!!d.password_set);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const save = async () => {
    setError(null);
    setMsg(null);
    // Пустой пароль не отправляем — иначе затрём сохранённый.
    const payload = { ...form, port: form.port ? Number(form.port) : null };
    if (!payload.password) delete payload.password;
    try {
      await adminApi.updateSmtp(payload);
      setMsg("Настройки сохранены");
      await load();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const sendTest = async () => {
    setError(null);
    setMsg(null);
    try {
      const r = await adminApi.testSmtp(testTo);
      setMsg(r.detail || "Тестовое письмо отправлено");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const field = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Настройки SMTP</h1>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      {msg && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">{msg}</div>}

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Хост</label>
            <input value={form.host} onChange={set("host")} className={field} placeholder="smtp.provider.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Порт</label>
            <input type="number" value={form.port} onChange={set("port")} className={field} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Аккаунт</label>
            <input value={form.username} onChange={set("username")} className={field} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Пароль {passwordSet && <span className="text-green-600">(задан)</span>}
            </label>
            <input type="password" value={form.password} onChange={set("password")} className={field} placeholder={passwordSet ? "оставьте пустым, чтобы не менять" : ""} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Шифрование</label>
            <select value={form.use_tls} onChange={set("use_tls")} className={field}>
              <option value="starttls">STARTTLS</option>
              <option value="ssl">SSL</option>
              <option value="none">Нет</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Отправитель (from)</label>
            <input value={form.from_email} onChange={set("from_email")} className={field} placeholder="noreply@provider.com" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.enabled} onChange={set("enabled")} />
          Отправка писем включена
        </label>
        <button onClick={save} className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600">Сохранить</button>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Тестовое письмо</h2>
        <div className="flex gap-2">
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} className={field} placeholder="email для проверки" />
          <button onClick={sendTest} disabled={!testTo} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40 whitespace-nowrap">Отправить</button>
        </div>
        <p className="text-xs text-gray-400">Письмо отправляется по текущим настройкам, даже если отправка выключена.</p>
      </section>
    </div>
  );
}
