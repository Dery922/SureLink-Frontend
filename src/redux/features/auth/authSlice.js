import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, updateCurrentUser } from "../../../services/services";

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

//thunk to fetch current login user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await updateCurrentUser(updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

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
        localStorage.setItem("user", JSON.stringify(state.user));
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
    // ✅ NEW: setUser action for onboarding and manual user updates
    setUser: (state, action) => {
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
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(state.user));
      } else {
        console.warn("setUser called with invalid user data:", incomingUser);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          ...action.payload,
          id: action.payload.id || action.payload._id,
          role: action.payload.role || action.payload.type || "customer",
          type: action.payload.type || action.payload.role || "customer",
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...action.payload,
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  setInitializingFalse,
  setUser, // ✅ EXPORT setUser action
} = authSlice.actions;

export default authSlice.reducer;
