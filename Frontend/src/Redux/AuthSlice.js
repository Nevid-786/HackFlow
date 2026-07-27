import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:null,
  authStatus:false
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {

      state.user = action.payload;
      state.authStatus = true;
      // console.log("Dispacth:",state.user,action.payload)
    },
    logout: (state) => {
      state.user = null;
      state.authStatus = false;
    },
  },
})

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
