import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts, selectAccounts, selectTotalBalance } from "@/store/accountsSlice";
import { fetchCategories, selectCategories } from "@/store/categoriesSlice";
import { transactionsApi } from "@/api/transactions";
import AddAccountModal from "@/components/accounts/AddAccountModal";

function formatMoney(amount) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(amount);
}

const TYPE_LABELS = { cash: "Наличные", card: "Карта", deposit: "Депозит", credit: "Кредит" };

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts    = useSelector(selectAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const categories  = useSelector(selectCategories);

  const [showModal, setShowModal]             = useState(false);
  const [selectedId, setSelectedId]           = useState(null);
  const [accountTransactions, setAccountTransactions] = useState([]);
  const [txLoading, setTxLoading]             = useState(false);

  useEffect(() => { dispatch(fetchAccounts()); dispatch(fetchCategories()); }, [dispatch]);

  async function selectAccount(account) {
    if (selectedId === account.id) {
      setSelectedId(null);
      setAccountTransactions([]);
      return;
    }
    setSelectedId(account.id);
    setTxLoading(true);
    try {
      const data = await transactionsApi.list({ account_id: account.id, limit: 100 });
      setAccountTransactions(data);
    } finally {
      setTxLoading(false);
    }
  }

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "—";
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  return (
    <div className="space-y-6">
      {showModal && <AddAccountModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Счета</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
        >
          + Добавить
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Суммарный баланс</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{formatMoney(totalBalance)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const isSelected = selectedId === account.id;
          return (
            <div
              key={account.id}
              onClick={() => selectAccount(account)}
              className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary-400 shadow-md ring-2 ring-primary-100"
                  : "border-gray-200 hover:shadow-md hover:-translate-y-0.5"
              }`}
              style={{ borderLeft: `4px solid ${account.color || "#22c55e"}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{account.icon || "💳"}</span>
                <div>
                  <p className="font-semibold text-gray-800">{account.name}</p>
                  <p className="text-xs text-gray-400">{TYPE_LABELS[account.account_type] || account.account_type}</p>
                </div>
                {isSelected && (
                  <span className="ml-auto text-xs text-primary-600 font-medium">Выбран</span>
                )}
              </div>
              <p className={`text-xl font-bold ${parseFloat(account.balance) >= 0 ? "text-primary-600" : "text-red-500"}`}>
                {formatMoney(account.balance)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{account.currency}</p>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <div
            className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-400 cursor-pointer hover:border-primary-400 hover:text-primary-500 transition-colors"
            onClick={() => setShowModal(true)}
          >
            + Добавьте первый счёт
          </div>
        )}
      </div>

      {selectedAccount && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span>{selectedAccount.icon || "💳"}</span>
              <h2 className="font-semibold text-gray-800">{selectedAccount.name}</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {accountTransactions.length} транзакций
              </span>
            </div>
            <button
              onClick={() => { setSelectedId(null); setAccountTransactions([]); }}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>

          {txLoading ? (
            <div className="p-8 text-center text-gray-400">Загрузка...</div>
          ) : accountTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">По этому счёту транзакций нет</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Дата</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Описание</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Категория</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accountTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-500">{new Date(t.date).toLocaleDateString("ru-RU")}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{t.description || "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{getCategoryName(t.category_id)}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-red-500"}`}>
                      {t.transaction_type === "income" ? "+" : "−"}{formatMoney(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
