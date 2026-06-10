import { useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

// ─── Translations ────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    nav: {
      features: "Features",
      testimonials: "Testimonials",
      pricing: "Pricing",
      login: "Sign in",
      cta: "Get started free",
    },
    hero: {
      badge: "Take control of your money",
      headline1: "Personal finance",
      headline2: "made effortless",
      sub: "CashControl helps you track spending, stick to budgets and see the full picture of your finances — all in one place.",
      cta: "Get started free",
      secondary: "Learn more",
      footnote: "Free forever. No credit card required.",
      preview: {
        title: "Finance overview",
        month: "June 2026",
        income: "Income",
        expenses: "Expenses",
        balance: "Balance",
      },
    },
    features: {
      label: "Features",
      heading: "Everything you need to feel in control",
      sub: "Simple tools that actually help — no information overload, no complex setup.",
      items: [
        {
          title: "Smart Dashboard",
          description: "See all your income, expenses and account balances in one clear view. Real-time updates keep you informed.",
        },
        {
          title: "Budget Control",
          description: "Set spending limits by category and get alerts before you overspend. Stay on track every month effortlessly.",
        },
        {
          title: "Transaction History",
          description: "Automatically categorise and search all your transactions. Filter by date, category or account in seconds.",
        },
        {
          title: "Multiple Accounts",
          description: "Manage cash, cards, savings and investments all in one place. A unified picture of your net worth.",
        },
      ],
    },
    testimonials: {
      label: "Testimonials",
      heading: "Trusted by thousands",
      sub: "Here's what people say about CashControl",
      items: [
        {
          quote: "CashControl completely changed how I think about money. I spotted ₽15,000 in wasted subscriptions in the first week.",
          name: "Alexey M.",
          role: "Product Manager",
          initials: "AM",
        },
        {
          quote: "Finally a budget app that doesn't feel like a spreadsheet. The dashboard is beautiful and genuinely useful.",
          name: "Maria K.",
          role: "Freelance Designer",
          initials: "MK",
        },
        {
          quote: "I've tried 6 finance apps. CashControl is the only one I kept using after the first month.",
          name: "Dmitry V.",
          role: "Software Engineer",
          initials: "DV",
        },
      ],
    },
    pricing: {
      label: "Pricing",
      heading: "Simple, honest pricing",
      sub: "Start free, upgrade to Pro whenever you're ready",
      popular: "Most popular",
      plans: [
        {
          name: "Free",
          price: "0",
          period: "forever",
          description: "Perfect to get started",
          features: ["1 account", "Up to 50 transactions/mo", "Basic categories", "Dashboard"],
          cta: "Get started free",
          highlight: false,
        },
        {
          name: "Pro",
          price: "299",
          period: "per month",
          description: "For serious financial control",
          features: ["Unlimited accounts", "Unlimited transactions", "Smart budgets with alerts", "Detailed analytics", "Data export"],
          cta: "Try free for 14 days",
          highlight: true,
        },
      ],
    },
    finalCta: {
      heading: "Start taking control of your finances today",
      sub: "Free, no credit card. Setup takes 2 minutes.",
      cta: "Create your free account",
    },
    footer: {
      copy: "© 2026 CashControl. All rights reserved.",
    },
  },

  ru: {
    nav: {
      features: "Возможности",
      testimonials: "Отзывы",
      pricing: "Цены",
      login: "Войти",
      cta: "Начать бесплатно",
    },
    hero: {
      badge: "Управляй деньгами, а не таблицами",
      headline1: "Финансовый контроль",
      headline2: "без усилий",
      sub: "CashControl помогает отслеживать расходы, соблюдать бюджет и видеть полную картину своих финансов — в одном месте.",
      cta: "Начать бесплатно",
      secondary: "Узнать больше",
      footnote: "Бесплатно навсегда. Не нужна карта.",
      preview: {
        title: "Обзор финансов",
        month: "Июнь 2026",
        income: "Доходы",
        expenses: "Расходы",
        balance: "Баланс",
      },
    },
    features: {
      label: "Возможности",
      heading: "Всё для финансового спокойствия",
      sub: "Простые инструменты, которые реально помогают — без перегруза и сложных настроек.",
      items: [
        {
          title: "Умный дашборд",
          description: "Смотри доходы, расходы и балансы всех счетов в одном месте. Обновления в реальном времени.",
        },
        {
          title: "Контроль бюджета",
          description: "Устанавливай лимиты по категориям и получай уведомления до того, как перерасходуешь. Каждый месяц — без лишних усилий.",
        },
        {
          title: "История транзакций",
          description: "Автоматическая категоризация и поиск по всем транзакциям. Фильтрация по дате, категории или счёту.",
        },
        {
          title: "Несколько счетов",
          description: "Управляй наличными, картами, сбережениями и инвестициями в одном приложении. Полная картина твоего состояния.",
        },
      ],
    },
    testimonials: {
      label: "Отзывы",
      heading: "Уже тысячи пользователей",
      sub: "Вот что они говорят о CashControl",
      items: [
        {
          quote: "CashControl полностью изменил мой подход к деньгам. За первую неделю я нашёл ₽15 000 в ненужных подписках.",
          name: "Алексей М.",
          role: "Product Manager",
          initials: "АМ",
        },
        {
          quote: "Наконец-то приложение для бюджета, которое не выглядит как таблица. Красивый и по-настоящему полезный дашборд.",
          name: "Мария К.",
          role: "Freelance Designer",
          initials: "МК",
        },
        {
          quote: "Я перепробовал 6 финансовых приложений. CashControl — единственное, которым я продолжаю пользоваться после первого месяца.",
          name: "Дмитрий В.",
          role: "Software Engineer",
          initials: "ДВ",
        },
      ],
    },
    pricing: {
      label: "Цены",
      heading: "Просто и честно",
      sub: "Начни бесплатно, переходи на Pro когда нужно",
      popular: "Популярный",
      plans: [
        {
          name: "Free",
          price: "0",
          period: "навсегда",
          description: "Чтобы начать и оценить",
          features: ["1 счёт", "До 50 транзакций/мес", "Базовые категории", "Dashboard"],
          cta: "Начать бесплатно",
          highlight: false,
        },
        {
          name: "Pro",
          price: "299",
          period: "в месяц",
          description: "Для серьёзного контроля финансов",
          features: ["Неограниченные счета", "Неограниченные транзакции", "Умные бюджеты с алертами", "Детальная аналитика", "Экспорт данных"],
          cta: "Попробовать 14 дней бесплатно",
          highlight: true,
        },
      ],
    },
    finalCta: {
      heading: "Начни контролировать финансы сегодня",
      sub: "Бесплатно, без карты. Настройка занимает 2 минуты.",
      cta: "Создать аккаунт бесплатно",
    },
    footer: {
      copy: "© 2026 CashControl. Все права защищены.",
    },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const LangContext = createContext({ lang: "en", t: TRANSLATIONS.en });
const useLang = () => useContext(LangContext);

// ─── Language switcher ────────────────────────────────────────────────────────

function FlagUK() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="60" height="42" fill="#012169"/>
      <path d="M0,0 L60,42 M60,0 L0,42" stroke="#fff" strokeWidth="8"/>
      <path d="M0,0 L60,42 M60,0 L0,42" stroke="#C8102E" strokeWidth="5"/>
      <path d="M30,0 V42 M0,21 H60" stroke="#fff" strokeWidth="14"/>
      <path d="M30,0 V42 M0,21 H60" stroke="#C8102E" strokeWidth="8"/>
    </svg>
  );
}

function FlagRU() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="60" height="14" fill="#fff"/>
      <rect y="14" width="60" height="14" fill="#0039A6"/>
      <rect y="28" width="60" height="14" fill="#D52B1E"/>
    </svg>
  );
}

function LangSwitcher({ lang, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Switch language"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors duration-200 cursor-pointer select-none"
    >
      {lang === "en" ? <FlagRU /> : <FlagUK />}
      {lang === "en" ? "RU" : "EN"}
    </button>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar({ lang, onToggleLang }) {
  const { t } = useLang();
  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, flexShrink: 0 }} className="rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">CashControl</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">{t.nav.features}</a>
          <a href="#testimonials" className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">{t.nav.testimonials}</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">{t.nav.pricing}</a>
        </div>

        <div className="flex items-center gap-3">
          <LangSwitcher lang={lang} onToggle={onToggleLang} />
          <Link to="/login" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
            {t.nav.login}
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            {t.nav.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useLang();
  const h = t.hero;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 pt-24 pb-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {h.badge}
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          {h.headline1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            {h.headline2}
          </span>
        </h1>

        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">{h.sub}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-lg shadow-blue-600/25"
          >
            {h.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            {h.secondary}
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500">{h.footnote}</p>

        <div className="mt-16 mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">{h.preview.title}</span>
              <span className="text-xs text-gray-500">{h.preview.month}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: h.preview.income,   value: "₽128 400", color: "text-emerald-400" },
                { label: h.preview.expenses, value: "₽74 200",  color: "text-rose-400" },
                { label: h.preview.balance,  value: "₽54 200",  color: "text-blue-400" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1 h-12">
              {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 78, 88].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-blue-600/40" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="24" height="24" key="f1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="24" height="24" key="f2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="24" height="24" key="f3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="24" height="24" key="f4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>,
];

function Features() {
  const { t } = useLang();
  const f = t.features;
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">{f.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{f.heading}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{f.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {f.items.map((item, i) => (
            <div
              key={item.title}
              className="group flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                {FEATURE_ICONS[i]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const { t } = useLang();
  const s = t.testimonials;
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">{s.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{s.heading}</h2>
          <p className="text-lg text-gray-500">{s.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {s.items.map((item) => (
            <div key={item.name} className="flex flex-col p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="#2563EB" width="16" height="16">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const { t } = useLang();
  const p = t.pricing;
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">{p.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{p.heading}</h2>
          <p className="text-lg text-gray-500">{p.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {p.plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl border-2 transition-shadow duration-200 ${
                plan.highlight ? "border-blue-600 shadow-xl shadow-blue-600/10" : "border-gray-100"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                  {p.popular}
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">₽{plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2.5} width="16" height="16" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  const { t } = useLang();
  const c = t.finalCta;
  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4">{c.heading}</h2>
        <p className="text-lg text-gray-400 mb-10">{c.sub}</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-lg shadow-blue-600/25"
        >
          {c.cta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLang();
  return (
    <footer className="py-8 bg-gray-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 24, flexShrink: 0 }} className="rounded-md bg-blue-600 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75" />
            </svg>
          </div>
          <span className="text-white/60 text-sm font-medium">CashControl</span>
        </div>
        <p className="text-gray-600 text-sm">{t.footer.copy}</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const toggleLang = () => setLang((l) => (l === "en" ? "ru" : "en"));
  const t = TRANSLATIONS[lang];

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="min-h-screen" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
        <NavBar lang={lang} onToggleLang={toggleLang} />
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </LangContext.Provider>
  );
}
