import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },

    updateIsProvider: (state) => {
      if (state.user) {
        state.user.isProvider = true;
      }
    },

    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },

    logoutUser(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});


export const { setUser, logoutUser, setLoading, updateIsProvider, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
