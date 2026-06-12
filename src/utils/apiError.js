// FastAPI returns `detail` as a string for HTTPException errors, but as a
// list of objects for 422 validation errors — rendering that list directly
// in JSX crashes React, so always reduce it to a string here.
export function extractApiError(err) {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "string" ? d : d.msg || JSON.stringify(d)))
      .join("; ");
  }
  if (detail) return JSON.stringify(detail);
  return err.message || null;
}
