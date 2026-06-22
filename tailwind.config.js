/** @type {import('tailwindcss').Config} */

// Все палитры вынесены в CSS-переменные (значения — в src/index.css), чтобы
// переключать светлую/тёмную тему по классу `.dark` на корне без правок
// компонентов. Это путь, предписанный docs/DESIGN_SYSTEM.md (раздел «Тёмная тема»):
// CSS custom properties для нейтральных И семантических токенов.
const tone = (prefix, stops) =>
  Object.fromEntries(
    stops.map((s) => [s, `rgb(var(--c-${prefix}-${s}) / <alpha-value>)`])
  );

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: tone("gray", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        primary: tone("primary", [50, 100, 200, 300, 500, 600, 700]),
        success: tone("success", [50, 100, 200, 300, 500, 600, 700]),
        warning: tone("warning", [50, 100, 200, 300, 500, 600, 700]),
        danger: tone("danger", [50, 100, 200, 300, 500, 600, 700]),
      },
    },
  },
  plugins: [],
};
