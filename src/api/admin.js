import api from "./client";

// Админ-API (все эндпоинты под /admin защищены ролью admin на бэке).
export const adminApi = {
  listUsers: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  getUser: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`).then((r) => r.data),
  deactivateUser: (id) => api.post(`/admin/users/${id}/deactivate`).then((r) => r.data),
  setRole: (id, role) => api.post(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resetPassword: (id) => api.post(`/admin/users/${id}/reset-password`).then((r) => r.data),
  userAccounts: (id) => api.get(`/admin/users/${id}/accounts`).then((r) => r.data),
  userTransactions: (id, params) =>
    api.get(`/admin/users/${id}/transactions`, { params }).then((r) => r.data),
  auditLogs: (params) => api.get("/admin/audit-logs", { params }).then((r) => r.data),
  getSmtp: () => api.get("/admin/settings/smtp").then((r) => r.data),
  updateSmtp: (data) => api.put("/admin/settings/smtp", data).then((r) => r.data),
  testSmtp: (to) => api.post("/admin/settings/smtp/test", { to }).then((r) => r.data),
};
