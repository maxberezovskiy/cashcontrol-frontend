// Date inputs work in the user's local calendar, while the API stores UTC
// instants. Convert through local midnight in both directions so the date
// the user picks is the date they see back, in any timezone.

export function toDateInputValue(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function dateInputToISO(value) {
  return new Date(`${value}T00:00:00`).toISOString();
}
