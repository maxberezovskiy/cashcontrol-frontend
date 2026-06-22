import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";

const EMPTY = {
  transport: "smtp",
  host: "", port: 587, username: "", password: "", use_tls: "starttls",
  from_email: "", enabled: false,
  api_provider: "brevo", api_key: "",
};

export default function AdminSmtpSettingsPage() {
  const [form, setForm] = useState(EMPTY);
  const [passwordSet, setPasswordSet] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [testTo, setTestTo] = useState("");

  const load = async () => {
    setError(null);
    try {
      const d = await adminApi.getSmtp();
      setForm({
        transport: d.transport || "smtp",
        host: d.host || "", port: d.port || 587, username: d.username || "",
        password: "", use_tls: d.use_tls || "starttls",
        from_email: d.from_email || "", enabled: !!d.enabled,
        api_provider: d.api_provider || "brevo", api_key: "",
      });
      setPasswordSet(!!d.password_set);
      setApiKeySet(!!d.api_key_set);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const save = async () => {
    setError(null);
    setMsg(null);
    // Шлём только поля выбранного транспорта; пустые секреты не отправляем (write-only).
    const payload = { transport: form.transport, enabled: form.enabled };
    if (form.from_email) payload.from_email = form.from_email;
    if (form.transport === "smtp") {
      payload.host = form.host;
      payload.port = form.port ? Number(form.port) : null;
      payload.username = form.username;
      payload.use_tls = form.use_tls;
      if (form.password) payload.password = form.password;
    } else {
      payload.api_provider = form.api_provider;
      if (form.api_key) payload.api_key = form.api_key;
    }
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
  const isApi = form.transport === "api";

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Настройки почты</h1>

      {error && <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      {msg && <div className="bg-success-50 text-success-700 text-sm rounded-lg px-4 py-3">{msg}</div>}

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Способ отправки</label>
          <select value={form.transport} onChange={set("transport")} className={field}>
            <option value="smtp">SMTP</option>
            <option value="api">HTTPS-API (если SMTP закрыт сетью)</option>
          </select>
        </div>

        {isApi ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Провайдер</label>
              <select value={form.api_provider} onChange={set("api_provider")} className={field}>
                <option value="brevo">Brevo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                API-ключ {apiKeySet && <span className="text-success-600">(задан)</span>}
              </label>
              <input type="password" value={form.api_key} onChange={set("api_key")} className={field}
                     placeholder={apiKeySet ? "оставьте пустым, чтобы не менять" : "xkeysib-…"} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Отправитель (from)</label>
              <input value={form.from_email} onChange={set("from_email")} className={field}
                     placeholder="подтверждённый в Brevo адрес" />
            </div>
          </div>
        ) : (
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
                Пароль {passwordSet && <span className="text-success-600">(задан)</span>}
              </label>
              <input type="password" value={form.password} onChange={set("password")} className={field}
                     placeholder={passwordSet ? "оставьте пустым, чтобы не менять" : ""} />
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
        )}

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
