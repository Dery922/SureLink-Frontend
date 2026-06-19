import { createSlice } from "@reduxjs/toolkit";

// 🚀 STEP 1: Read browser storage immediately during file compilation
const preservedToken =
  localStorage.getItem("authToken") || localStorage.getItem("token");
const preservedUserString = localStorage.getItem("user");

let rehydratedUser = null;

try {
  if (
    preservedUserString &&
    preservedUserString !== "undefined" &&
    preservedUserString !== "null"
  ) {
    rehydratedUser = JSON.parse(preservedUserString);
  }
} catch (error) {
  console.error(
    "❌ Redux slice initialization failed to parse user cache:",
    error,
  );
}

// 🚀 STEP 2: Seed the initial state with the cache data
const initialState = {
  user: rehydratedUser, // ⚡ Starts with the cached user object instead of null!
  isAuthenticated: !!preservedToken,
  loading: false, // Turn off by default since cache handles the initial paint
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;

      const incomingUser = action.payload?.user
        ? action.payload.user
        : action.payload;
      if (incomingUser && typeof incomingUser === "object") {
        state.user = {
          ...incomingUser,
          id: incomingUser.id || incomingUser._id,
          role: incomingUser.role || incomingUser.type || "customer",
          type: incomingUser.type || incomingUser.role || "customer",
        };
      }
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    setInitializingFalse: (state) => {
      state.loading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  setInitializingFalse,
} = authSlice.actions;

export default authSlice.reducer;
