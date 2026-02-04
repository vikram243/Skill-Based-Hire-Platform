import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    completed: 0,
    pending: 0,
    activeOrders: 0,
    totalSpent: 0,
    totalOrders: 0,
    recentOrders: []
  },
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setStats(state, action) {
      state.stats = action.payload;
      state.error = null;
      state.loading = false;
    },
    clearStats(state) {
      state.stats = {
        completed: 0,
        pending: 0,
        activeOrders: 0,
        totalSpent: 0,
        totalOrders: 0,
        recentOrders: []
      };
    },
  },
});

export const { setLoading, setError, setStats, clearStats } = ordersSlice.actions;
export default ordersSlice.reducer;