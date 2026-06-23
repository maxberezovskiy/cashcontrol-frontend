import { useState } from "react";
import { useDispatch } from "react-redux";
import { Banknote, CreditCard, PiggyBank, Receipt } from "lucide-react";
import { createAccount } from "@/store/accountsSlice";
import Modal from "@/components/ui/Modal";

const TYPES = [
  { value: "cash",    label: "Наличные", icon: "Banknote"  },
  { value: "card",    label: "Карта",    icon: "CreditCard" },
  { value: "deposit", label: "Депозит",  icon: "PiggyBank"  },
  { value: "credit",  label: "Кредит",   icon: "Receipt"    },
];

const PRESET_COLORS = [
  "#2D7093", "#5C8C63", "#B8853D", "#B5604F",
  "#7D6B8F", "#4F7C7A", "#9C8268", "#6B7177",
];

// Иконки только для выбора типа счёта (не сохраняются — у счёта своей иконки нет).
const ICON_MAP = { Banknote, CreditCard, PiggyBank, Receipt };

export default function AddAccountModal({ onClose }) {
  const dispatch = useDispatch();

  const [name, setName]         = useState("");
  const [type, setType]         = useState("card");
  const [balance, setBalance]   = useState("0");
  const [currency, setCurrency] = useState("RUB");
  const [color, setColor]       = useState("#2D7093");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Введите название счёта"); return; }

    setError(null);
    setSubmitting(true);

    const result = await dispatch(createAccount({
      name: name.trim(),
      account_type: type,
      balance: parseFloat(balance) || 0,
      currency: currency.trim() || "RUB",
      color,
    }));

    setSubmitting(false);
    if (createAccount.fulfilled.match(result)) {
      onClose();
    } else {
      setError(result.payload || "Ошибка при создании счёта");
    }
  }

  return (
    <Modal title="Новый счёт" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Тип счёта</label>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map((t) => {
              const Ic = ICON_MAP[t.icon];
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    type === t.value
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {Ic && <Ic size={18} />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Сбербанк, Кошелёк"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>

        {/* Balance + Currency */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Начальный баланс</label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              maxLength={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Цвет</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === c ? "border-gray-800 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-xl shrink-0"
            style={{ backgroundColor: color + "25" }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{name || "Название счёта"}</p>
            <p className="text-xs text-gray-400">{TYPES.find((t) => t.value === type)?.label} · {currency}</p>
          </div>
          <span className="ml-auto text-sm font-bold text-gray-700">
            {parseFloat(balance || 0).toLocaleString("ru-RU")} {currency}
          </span>
        </div>

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-60"
          >
            {submitting ? "Сохранение…" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
