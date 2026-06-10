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

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await transactionsApi.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await transactionsApi.remove(id);
      return id;
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
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export default transactionsSlice.reducer;
