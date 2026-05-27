import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { transactionsApi } from "@/api/transactions";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await transactionsApi.list(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data, { rejectWithValue }) => {
    try {
      return await transactionsApi.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export default transactionsSlice.reducer;
