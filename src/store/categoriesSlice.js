import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesApi } from "@/api/categories";

export const fetchCategories = createAsyncThunk("categories/fetch", async (_, { rejectWithValue }) => {
  try {
    return await categoriesApi.list();
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

export const createCategory = createAsyncThunk("categories/create", async (data, { rejectWithValue }) => {
  try {
    return await categoriesApi.create(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail);
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const selectCategories = (state) => state.categories.items;
export const selectExpenseCategories = (state) =>
  state.categories.items.filter((c) => c.category_type === "expense");
export const selectIncomeCategories = (state) =>
  state.categories.items.filter((c) => c.category_type === "income");

export default categoriesSlice.reducer;
