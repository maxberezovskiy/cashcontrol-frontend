import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts, selectAccounts, selectTotalBalance } from "@/store/accountsSlice";
import { fetchTransactions, selectTransactions } from "@/store/transactionsSlice";
import { fetchBudgets, selectBudgets } from "@/store/budgetsSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "@/utils/format";

const COLORS = ["#2D7093", "#5C8C63", "#B8853D", "#B5604F", "#9CA3AF"];

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

      {/* Balance card — без сплошной цветной заливки: акцент только в подчёркивании */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-gray-400 text-sm">Общий баланс</p>
        <p className="text-4xl font-semibold text-gray-900 mt-1">{formatMoney(totalBalance)}</p>
        <div className="w-7 h-[3px] bg-primary-500 rounded-full mt-2 mb-2" />
        <p className="text-gray-400 text-sm">{accounts.length} счетов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Счета</h2>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{account.name}</span>
                </div>
                <span className={`text-sm font-semibold ${parseFloat(account.balance) >= 0 ? "text-primary-600" : "text-danger-500"}`}>
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
              <span className={`text-sm font-semibold ${t.transaction_type === "income" ? "text-primary-600" : "text-danger-500"}`}>
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
