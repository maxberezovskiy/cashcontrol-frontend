import api from "./client";

export const accountsApi = {
  list: () => api.get("/accounts/").then((r) => r.data),
  create: (data) => api.post("/accounts/", data).then((r) => r.data),
  update: (id, data) => api.patch(`/accounts/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/accounts/${id}`),
};
