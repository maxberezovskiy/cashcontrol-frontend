import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTransaction } from "@/store/transactionsSlice";
import { selectCategories } from "@/store/categoriesSlice";
import Modal from "@/components/ui/Modal";

const TYPE_LABELS = { income: "Доход", expense: "Расход", transfer: "Перевод" };
const TYPE_COLORS = { income: "text-primary-600", expense: "text-red-500", transfer: "text-blue-500" };

export default function EditTransactionModal({ transaction, accountName, onClose }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const filteredCategories = categories.filter((c) => {
    if (transaction.transaction_type === "expense") return c.category_type === "expense";
    if (transaction.transaction_type === "income")  return c.category_type === "income";
    return false;
  });

  const [amount, setAmount]           = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description || "");
  const [note, setNote]               = useState(transaction.note || "");
  const [categoryId, setCategoryId]   = useState(transaction.category_id ?? "");
  const [date, setDate]               = useState(transaction.date.slice(0, 10));
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { setError("Введите сумму больше нуля"); return; }
    setError(null);
    setSubmitting(true);

    const result = await dispatch(updateTransaction({
      id: transaction.id,
      data: {
        amount: parseFloat(amount),
        description: description.trim() || null,
        note: note.trim() || null,
        category_id: categoryId !== "" ? parseInt(categoryId) : null,
        date: new Date(date).toISOString(),
      },
    }));

    setSubmitting(false);
    if (updateTransaction.fulfilled.match(result)) {
      onClose();
    } else {
      setError(result.payload || "Ошибка при сохранении");
    }
  }

  return (
    <Modal title="Редактировать транзакцию" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Type + account (read-only) */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5">
          <span className={`text-xs font-semibold uppercase ${TYPE_COLORS[transaction.transaction_type]}`}>
            {TYPE_LABELS[transaction.transaction_type]}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500">{accountName}</span>
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
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>

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

        {/* Category */}
        {transaction.transaction_type !== "transfer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— Без категории —</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ""}{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Необязательно"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Заметка</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Необязательно"
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

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
            {submitting ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
