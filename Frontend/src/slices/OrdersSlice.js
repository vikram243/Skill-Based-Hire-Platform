import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder(state, action) {
      state.order = action.payload;
      console.log("Updated stats state:", state.order);
      state.error = null;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError, setOrder } = ordersSlice.actions;
export default ordersSlice.reducer;