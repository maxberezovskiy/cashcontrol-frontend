import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts, selectAccounts, selectTotalBalance } from "@/store/accountsSlice";
import { fetchTransactions, selectTransactions } from "@/store/transactionsSlice";
import { fetchBudgets, selectBudgets } from "@/store/budgetsSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

function formatMoney(amount) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const transactions = useSelector(selectTransactions);
  const budgets = useSelector(selectBudgets);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions({ limit: 5 }));
    dispatch(fetchBudgets());
  }, [dispatch]);

  const expenseData = budgets
    .filter((b) => b.spent > 0)
    .map((b) => ({ name: b.name, value: parseFloat(b.spent) }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Обзор</h1>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <p className="text-primary-100 text-sm">Общий баланс</p>
        <p className="text-4xl font-bold mt-1">{formatMoney(totalBalance)}</p>
        <p className="text-primary-100 text-sm mt-2">{accounts.length} счетов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Счета</h2>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{account.icon || "💳"}</span>
                  <span className="text-sm font-medium text-gray-800">{account.name}</span>
                </div>
                <span className={`text-sm font-semibold ${parseFloat(account.balance) >= 0 ? "text-primary-600" : "text-red-500"}`}>
                  {formatMoney(account.balance)}
                </span>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Добавьте первый счёт</p>
            )}
          </div>
        </div>

        {/* Budget chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Расходы по бюджетам</h2>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {expenseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatMoney(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">Нет данных</p>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Последние транзакции</h2>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{t.description || "Без описания"}</p>
                <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString("ru-RU")}</p>
              </div>
              <span className={`text-sm font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-red-500"}`}>
                {t.transaction_type === "income" ? "+" : "-"}{formatMoney(t.amount)}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Транзакций пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
}
