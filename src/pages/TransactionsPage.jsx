import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, selectTransactions, selectTransactionsLoading, deleteTransaction } from "@/store/transactionsSlice";
import { fetchAccounts, selectAccounts } from "@/store/accountsSlice";
import { fetchCategories, selectCategories } from "@/store/categoriesSlice";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import Modal from "@/components/ui/Modal";

function formatMoney(amount) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(amount);
}

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const accounts    = useSelector(selectAccounts);
  const categories  = useSelector(selectCategories);
  const loading     = useSelector(selectTransactionsLoading);

  const [activeAccountId, setActiveAccountId] = useState(null);
  const [showAdd, setShowAdd]                 = useState(false);
  const [editing, setEditing]                 = useState(null);
  const [deleting, setDeleting]               = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  useEffect(() => {
    const params = { limit: 100 };
    if (activeAccountId) params.account_id = activeAccountId;
    dispatch(fetchTransactions(params));
  }, [dispatch, activeAccountId]);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getAccount      = (id) => accounts.find((a) => a.id === id);
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "—";

  function handleAccountFilter(id) {
    setActiveAccountId((prev) => (prev === id ? null : id));
  }

  async function handleDelete() {
    setDeleteLoading(true);
    await dispatch(deleteTransaction(deleting.id));
    setDeleteLoading(false);
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}

      {editing && (
        <EditTransactionModal
          transaction={editing}
          accountName={getAccount(editing.account_id)?.name || "—"}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <Modal title="Удалить транзакцию?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-gray-600 mb-1">
            {deleting.description || "Без описания"} —{" "}
            <span className={deleting.transaction_type === "income" ? "text-primary-600 font-semibold" : "text-red-500 font-semibold"}>
              {deleting.transaction_type === "income" ? "+" : "−"}{formatMoney(deleting.amount)}
            </span>
          </p>
          <p className="text-sm text-gray-400 mb-5">Это действие нельзя отменить.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleting(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60"
            >
              {deleteLoading ? "Удаление…" : "Удалить"}
            </button>
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Транзакции</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
        >
          + Добавить
        </button>
      </div>

      {accounts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveAccountId(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeAccountId === null
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Все счета
          </button>
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAccountFilter(a.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeAccountId === a.id
                  ? "text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={
                activeAccountId === a.id
                  ? { backgroundColor: a.color || "#22c55e", borderColor: a.color || "#22c55e" }
                  : {}
              }
            >
              {a.icon && <span>{a.icon}</span>}
              {a.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Дата</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Описание</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Счёт</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Категория</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Сумма</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setEditing(t)}
                  className="group hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-5 py-3 text-gray-500">{new Date(t.date).toLocaleDateString("ru-RU")}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{t.description || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{getAccount(t.account_id)?.name || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{getCategoryName(t.category_id)}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-red-500"}`}>
                    {t.transaction_type === "income" ? "+" : "−"}{formatMoney(t.amount)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleting(t); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">Транзакций пока нет</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
