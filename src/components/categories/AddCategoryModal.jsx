import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "@/store/categoriesSlice";
import Modal from "@/components/ui/Modal";

const PRESET_COLORS = [
  "#2D7093", "#5C8C63", "#B8853D", "#B5604F",
  "#7D6B8F", "#4F7C7A", "#9C8268", "#6B7177",
];

const EXPENSE_ICONS = ["🛒", "🍕", "🚗", "💊", "👕", "🏠", "🎬", "✈️", "📚", "💇"];
const INCOME_ICONS  = ["💼", "💰", "📈", "🏆", "🎁", "💳", "🏦", "🤝", "🖥️", "🌱"];

export default function AddCategoryModal({ defaultType = "expense", onClose }) {
  const dispatch = useDispatch();

  const [type, setType]     = useState(defaultType);
  const [name, setName]     = useState("");
  const [icon, setIcon]     = useState(defaultType === "expense" ? "🛒" : "💼");
  const [color, setColor]   = useState("#2D7093");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState(null);

  const icons = type === "expense" ? EXPENSE_ICONS : INCOME_ICONS;

  function handleTypeChange(newType) {
    setType(newType);
    setIcon(newType === "expense" ? EXPENSE_ICONS[0] : INCOME_ICONS[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Введите название категории"); return; }

    setError(null);
    setSubmitting(true);

    const result = await dispatch(createCategory({
      name: name.trim(),
      category_type: type,
      icon,
      color,
    }));

    setSubmitting(false);
    if (createCategory.fulfilled.match(result)) {
      onClose();
    } else {
      setError(result.payload || "Ошибка при создании категории");
    }
  }

  return (
    <Modal title="Новая категория" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              type === "expense" ? "bg-danger-500 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              type === "income" ? "bg-primary-500 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Доход
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === "expense" ? "Например: Продукты, Транспорт" : "Например: Зарплата, Фриланс"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>

        {/* Icons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Иконка</label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setIcon(em)}
                className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center border transition-colors ${
                  icon === em ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Цвет</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === c ? "border-gray-800 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: color + "25", color }}
          >
            {icon} {name || "Название"}
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            {type === "expense" ? "Расход" : "Доход"}
          </span>
        </div>

        {error && <p className="text-sm text-danger-500">{error}</p>}

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
            {submitting ? "Сохранение…" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
