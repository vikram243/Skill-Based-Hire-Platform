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

    updatePersonalInfo: (state, action) => {
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        state.user.fullName = action.payload.fullName;
        state.user.bio = action.payload.bio;
      }
    },

    updateLocation: (state, action) => {
      if (state.user) {
        state.user.location = action.payload;
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


export const { setUser, logoutUser, setLoading, updateIsProvider, updateAvatar, updatePersonalInfo, updateLocation } = userSlice.actions;
export default userSlice.reducer;