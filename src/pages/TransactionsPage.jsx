import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, selectTransactions, selectTransactionsLoading } from "@/store/transactionsSlice";
import { fetchAccounts, selectAccounts } from "@/store/accountsSlice";
import { fetchCategories, selectCategories } from "@/store/categoriesSlice";

function formatMoney(amount) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(amount);
}

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const accounts = useSelector(selectAccounts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectTransactionsLoading);

  useEffect(() => {
    dispatch(fetchTransactions({ limit: 100 }));
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getAccountName = (id) => accounts.find((a) => a.id === id)?.name || "—";
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Транзакции</h1>
      </div>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500">{new Date(t.date).toLocaleDateString("ru-RU")}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{t.description || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{getAccountName(t.account_id)}</td>
                  <td className="px-5 py-3 text-gray-500">{getCategoryName(t.category_id)}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-red-500"}`}>
                    {t.transaction_type === "income" ? "+" : "-"}{formatMoney(t.amount)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">Транзакций пока нет</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
