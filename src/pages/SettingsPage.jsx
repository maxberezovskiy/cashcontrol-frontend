import { useEffect, useState } from "react";
import { telegramApi } from "@/api/telegram";
import { extractApiError } from "@/utils/apiError";

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || "";

function formatExpiry(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function TelegramCard() {
  const [status, setStatus] = useState(null); // { linked, telegram_id }
  const [code, setCode] = useState(null); // { code, expires_at }
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    setError("");
    try {
      setStatus(await telegramApi.status());
    } catch (e) {
      setError(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleGenerate = async () => {
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      setCode(await telegramApi.generateCode());
    } catch (e) {
      setError(extractApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleUnlink = async () => {
    setBusy(true);
    setError("");
    try {
      await telegramApi.unlink();
      setCode(null);
      await loadStatus();
    } catch (e) {
      setError(extractApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code.code);
    setCopied(true);
  };

  const deepLink =
    BOT_USERNAME && code ? `https://t.me/${BOT_USERNAME}?start=${code.code}` : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📲</span>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Telegram-бот</h2>
          <p className="text-xs text-gray-500">
            Управляйте финансами и добавляйте операции прямо в Telegram
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg bg-danger-50 text-danger-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Загрузка…</p>
      ) : status?.linked ? (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 text-sm px-3 py-1">
            <span>✅</span> Аккаунт привязан
          </div>
          <div>
            <button
              onClick={handleUnlink}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Отвязать Telegram
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Нажмите «Сгенерировать код».</li>
            <li>
              Откройте бота{BOT_USERNAME ? ` @${BOT_USERNAME}` : ""} в Telegram.
            </li>
            <li>
              Отправьте боту <code className="px-1 bg-gray-100 rounded">/link КОД</code>.
            </li>
          </ol>

          {code ? (
            <div className="rounded-xl border border-dashed border-primary-300 bg-primary-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-2xl font-bold tracking-widest text-gray-900">
                  {code.code}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {copied ? "Скопировано" : "Копировать"}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Код действует до {formatExpiry(code.expires_at)}. Никому его не передавайте.
              </p>
              {deepLink && (
                <a
                  href={deepLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
                >
                  Открыть в Telegram →
                </a>
              )}
              <div>
                <button
                  onClick={handleGenerate}
                  disabled={busy}
                  className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Сгенерировать новый код
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {busy ? "…" : "Сгенерировать код"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
      <TelegramCard />
    </div>
  );
}
