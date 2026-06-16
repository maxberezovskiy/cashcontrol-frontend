import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "@/api/admin";
import { extractApiError } from "@/utils/apiError";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      return await adminApi.listUsers(params);
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { users: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectUsers = (state) => state.admin.users;
export const selectUsersTotal = (state) => state.admin.total;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export default adminSlice.reducer;
