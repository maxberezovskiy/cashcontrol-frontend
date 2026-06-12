import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth";
import { extractApiError } from "@/utils/apiError";

const TOKEN_KEY = "cc_access_token";
const REFRESH_KEY = "cc_refresh_token";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authApi.login(email, password);
    } catch (err) {
      return rejectWithValue(extractApiError(err) || "Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await authApi.register(userData);
    } catch (err) {
      return rejectWithValue(extractApiError(err) || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    refreshToken: localStorage.getItem(REFRESH_KEY) || null,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    },
    setTokens(state, action) {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      localStorage.setItem(TOKEN_KEY, action.payload.access_token);
      localStorage.setItem(REFRESH_KEY, action.payload.refresh_token);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        localStorage.setItem(TOKEN_KEY, action.payload.access_token);
        localStorage.setItem(REFRESH_KEY, action.payload.refresh_token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setTokens, clearError } = authSlice.actions;
export const selectIsAuthenticated = (state) => !!state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;
