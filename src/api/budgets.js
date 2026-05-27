import api from "./client";

export const budgetsApi = {
  list: () => api.get("/budgets/").then((r) => r.data),
  create: (data) => api.post("/budgets/", data).then((r) => r.data),
  update: (id, data) => api.patch(`/budgets/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/budgets/${id}`),
};
