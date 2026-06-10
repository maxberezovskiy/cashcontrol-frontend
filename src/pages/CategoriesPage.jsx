import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectExpenseCategories, selectIncomeCategories } from "@/store/categoriesSlice";
import AddCategoryModal from "@/components/categories/AddCategoryModal";

function CategorySection({ title, categories, type, onAdd }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          + Добавить
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: cat.color ? cat.color + "20" : "#f3f4f6", color: cat.color || "#374151" }}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </span>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400">Нет категорий</p>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const expenseCategories = useSelector(selectExpenseCategories);
  const incomeCategories  = useSelector(selectIncomeCategories);
  const [modalType, setModalType] = useState(null); // "expense" | "income" | null

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Категории</h1>

      {modalType && (
        <AddCategoryModal
          defaultType={modalType}
          onClose={() => setModalType(null)}
        />
      )}

      <CategorySection
        title="Расходы"
        categories={expenseCategories}
        type="expense"
        onAdd={() => setModalType("expense")}
      />
      <CategorySection
        title="Доходы"
        categories={incomeCategories}
        type="income"
        onAdd={() => setModalType("income")}
      />
    </div>
  );
}
