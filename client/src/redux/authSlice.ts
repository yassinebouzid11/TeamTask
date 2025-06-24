import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user") || "null");

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  const res = await axios.post("http://localhost:5000/auth/login", data);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
});

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    const res = await axios.post(
      "http://localhost:5000/auth/register",
      data
    );
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
