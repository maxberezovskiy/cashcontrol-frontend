import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectExpenseCategories, selectIncomeCategories } from "@/store/categoriesSlice";

function CategoryList({ title, categories, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{title}</h2>
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
  const incomeCategories = useSelector(selectIncomeCategories);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
      <CategoryList title="Расходы" categories={expenseCategories} />
      <CategoryList title="Доходы" categories={incomeCategories} />
    </div>
  );
}
