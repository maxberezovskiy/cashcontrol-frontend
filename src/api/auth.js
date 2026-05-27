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
};
