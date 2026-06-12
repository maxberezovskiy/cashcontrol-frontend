import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgets, selectBudgets } from "@/store/budgetsSlice";
import { formatMoney } from "@/utils/format";

const PERIOD_LABELS = { monthly: "Месяц", weekly: "Неделя", yearly: "Год" };

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);

  useEffect(() => { dispatch(fetchBudgets()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Бюджеты</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const spent = parseFloat(budget.spent || 0);
          const limit = parseFloat(budget.amount);
          const pct = Math.min((spent / limit) * 100, 100);
          const isOver = spent > limit;

          return (
            <div key={budget.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">{budget.name}</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {PERIOD_LABELS[budget.period]}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-lg font-bold ${isOver ? "text-red-500" : "text-gray-900"}`}>
                  {formatMoney(spent)}
                </span>
                <span className="text-sm text-gray-400">/ {formatMoney(limit)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOver ? "bg-red-500" : "bg-primary-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{pct.toFixed(0)}% использовано</p>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
            Бюджеты не настроены
          </div>
        )}
      </div>
    </div>
  );
}
