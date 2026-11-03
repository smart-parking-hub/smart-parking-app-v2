import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  isSidebarCollapsed: boolean
  activeModule: string | null
}

const initialState: UiState = {
  isSidebarCollapsed: false,
  activeModule: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
    },
    setActiveModule: (state, action: PayloadAction<string | null>) => {
      state.activeModule = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setActiveModule } = uiSlice.actions
export default uiSlice.reducer
