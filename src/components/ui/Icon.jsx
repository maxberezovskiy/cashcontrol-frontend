import * as LucideIcons from "lucide-react";

/**
 * Универсальный рендерер иконок.
 * Принимает строковое имя Lucide-иконки (новый формат, сохраняется в БД)
 * или эмодзи/текст (legacy-данные) — в этом случае рендерится как текст.
 *
 * Использование:
 *   <AppIcon name={account.icon} size={20} className="text-gray-500" />
 */
export function AppIcon({ name, size = 18, className = "", ...props }) {
  if (!name) {
    const Fallback = LucideIcons.CreditCard;
    return <Fallback size={size} className={className} {...props} />;
  }

  const Icon = LucideIcons[name];
  if (Icon) return <Icon size={size} className={className} {...props} />;

  // Legacy: эмодзи или произвольный текст из БД
  return (
    <span className="leading-none select-none" style={{ fontSize: size }}>
      {name}
    </span>
  );
}
