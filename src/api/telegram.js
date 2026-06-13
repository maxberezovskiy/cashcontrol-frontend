import api from "./client";

export const telegramApi = {
  status: () => api.get("/telegram/status").then((r) => r.data),
  generateCode: () => api.post("/telegram/link-code").then((r) => r.data),
  unlink: () => api.post("/telegram/unlink").then((r) => r.data),
};
