import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import accountsReducer from "./accountsSlice";
import transactionsReducer from "./transactionsSlice";
import categoriesReducer from "./categoriesSlice";
import budgetsReducer from "./budgetsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer,
    categories: categoriesReducer,
    budgets: budgetsReducer,
  },
});
