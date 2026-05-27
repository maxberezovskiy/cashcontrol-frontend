import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountsApi } from "@/api/accounts";

export const fetchAccounts = createAsyncThunk("accounts/fetch", async (_, { rejectWithValue }) => {
  try {
    return await accountsApi.list();
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

export const createAccount = createAsyncThunk("accounts/create", async (data, { rejectWithValue }) => {
  try {
    return await accountsApi.create(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

const accountsSlice = createSlice({
  name: "accounts",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => { state.loading = true; })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const selectAccounts = (state) => state.accounts.items;
export const selectAccountsLoading = (state) => state.accounts.loading;
export const selectTotalBalance = (state) =>
  state.accounts.items.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);

export default accountsSlice.reducer;
