import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts, selectAccounts, selectTotalBalance } from "@/store/accountsSlice";
import AddAccountModal from "@/components/accounts/AddAccountModal";

function formatMoney(amount) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(amount);
}

const TYPE_LABELS = { cash: "Наличные", card: "Карта", deposit: "Депозит", credit: "Кредит" };

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { dispatch(fetchAccounts()); }, [dispatch]);

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
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-2xl border border-gray-200 p-5"
            style={{ borderLeft: `4px solid ${account.color || "#22c55e"}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{account.icon || "💳"}</span>
              <div>
                <p className="font-semibold text-gray-800">{account.name}</p>
                <p className="text-xs text-gray-400">{TYPE_LABELS[account.account_type] || account.account_type}</p>
              </div>
            </div>
            <p className={`text-xl font-bold ${parseFloat(account.balance) >= 0 ? "text-primary-600" : "text-red-500"}`}>
              {formatMoney(account.balance)}
            </p>
            <p className="text-xs text-gray-400 mt-1">{account.currency}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div
            className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-400 cursor-pointer hover:border-primary-400 hover:text-primary-500 transition-colors"
            onClick={() => setShowModal(true)}
          >
            + Добавьте первый счёт
          </div>
        )}
      </div>
    </div>
  );
}
