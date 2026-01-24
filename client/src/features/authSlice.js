import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuth: false,
  adminToken: '',
  admin: [],
}

export const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.isAuth = action.payload?.isAuth
      state.adminToken = action.payload?.authToken
      state.admin = action.payload?.admin
    },

    logoutAdmin: state => {
      state.isAuth = false
      state.adminToken = ''
      state.admin = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginAdmin, logoutAdmin } = authSlice.actions

export default authSlice.reducer
