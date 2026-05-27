import api from "./client";

export const transactionsApi = {
  list: (params = {}) => api.get("/transactions/", { params }).then((r) => r.data),
  create: (data) => api.post("/transactions/", data).then((r) => r.data),
  update: (id, data) => api.patch(`/transactions/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/transactions/${id}`),
};
