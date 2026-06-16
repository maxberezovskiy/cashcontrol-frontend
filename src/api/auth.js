import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const authApi = {
  register: (data) =>
    axios.post(`${BASE_URL}/auth/register`, data).then((r) => r.data),

  login: (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return axios
      .post(`${BASE_URL}/auth/login`, form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },

  // /me использует bare axios (а не client), чтобы authSlice не создавал циклический
  // импорт через client. Токен берём из того же ключа localStorage, что и authSlice.
  me: () => {
    const token = localStorage.getItem("cc_access_token");
    return axios
      .get(`${BASE_URL}/users/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((r) => r.data);
  },

  passwordResetRequest: (email) =>
    axios.post(`${BASE_URL}/auth/password-reset/request`, { email }).then((r) => r.data),

  passwordResetConfirm: (token, new_password) =>
    axios
      .post(`${BASE_URL}/auth/password-reset/confirm`, { token, new_password })
      .then((r) => r.data),
};
