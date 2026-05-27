import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { budgetsApi } from "@/api/budgets";

export const fetchBudgets = createAsyncThunk("budgets/fetch", async (_, { rejectWithValue }) => {
  try {
    return await budgetsApi.list();
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

const budgetsSlice = createSlice({
  name: "budgets",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => { state.loading = true; })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectBudgets = (state) => state.budgets.items;
export default budgetsSlice.reducer;
