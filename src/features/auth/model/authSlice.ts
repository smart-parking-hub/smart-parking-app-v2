import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Role = 'DRIVER' | 'MERCHANT' | 'ADMIN'
interface AuthState { role: Role | null }
const initialState: AuthState = { role: null }
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated(state, action: PayloadAction<{ role: Role }>) { state.role = action.payload.role },
    signedOut(state) { state.role = null },
  },
})
export const { authenticated, signedOut } = authSlice.actions
export default authSlice.reducer
