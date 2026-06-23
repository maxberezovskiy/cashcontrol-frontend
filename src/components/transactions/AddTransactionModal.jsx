import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction } from "@/store/transactionsSlice";
import { selectAccounts } from "@/store/accountsSlice";
import { selectCategories } from "@/store/categoriesSlice";
import Modal from "@/components/ui/Modal";
import { Wallet } from "lucide-react";
import { dateInputToISO, toDateInputValue } from "@/utils/date";

const TYPES = [
  { value: "expense", label: "Расход" },
  { value: "income", label: "Доход" },
  { value: "transfer", label: "Перевод" },
];

function today() {
  return toDateInputValue(new Date());
}

export default function AddTransactionModal({ onClose }) {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const categories = useSelector(selectCategories);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const filteredCategories = categories.filter((c) => {
    if (type === "expense") return c.category_type === "expense";
    if (type === "income") return c.category_type === "income";
    return false;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Введите сумму больше нуля");
      return;
    }
    if (!accountId) {
      setError("Выберите счёт");
      return;
    }
    if (type === "transfer" && !toAccountId) {
      setError("Выберите счёт назначения");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      transaction_type: type,
      amount: parseFloat(amount),
      account_id: parseInt(accountId),
      category_id: categoryId ? parseInt(categoryId) : null,
      to_account_id: type === "transfer" && toAccountId ? parseInt(toAccountId) : null,
      date: dateInputToISO(date),
      description: description.trim() || null,
    };

    const result = await dispatch(createTransaction(payload));
    setSubmitting(false);

    if (createTransaction.fulfilled.match(result)) {
      onClose();
    } else {
      setError(result.payload || "Ошибка при создании транзакции");
    }
  }

  if (accounts.length === 0) {
    return (
      <Modal title="Новая транзакция" onClose={onClose}>
        <div className="py-6 text-center space-y-3">
          <Wallet size={36} className="mx-auto text-gray-300" />
          <p className="text-sm font-medium text-gray-700">Сначала создайте счёт</p>
          <p className="text-xs text-gray-400">Перейдите в раздел «Счета» и добавьте хотя бы один счёт.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Новая транзакция" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => { setType(t.value); setCategoryId(""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                type === t.value
                  ? "bg-primary-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Сумма</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Счёт</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* To account (transfer only) */}
        {type === "transfer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Счёт назначения</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— Выберите —</option>
              {accounts.filter((a) => a.id !== parseInt(accountId)).map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        {type !== "transfer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— Без категории —</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Необязательно"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
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
            {submitting ? "Сохранение…" : "Добавить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
