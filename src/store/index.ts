import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import marketplaceReducer from "./slices/marketplaceSlice"
import agentBuilderReducer from "./slices/agentBuilderSlice"
import myAgentsReducer from "./slices/myAgentsSlice"
import lpDashboardReducer from "./slices/lpDashboardSlice"
import authReducer from "./slices/authSlice"
import settingsReducer from "./slices/settingsSlice"

// Configure the Redux store
export const store = configureStore({
  reducer: {
    marketplace: marketplaceReducer,
    agentBuilder: agentBuilderReducer,
    myAgents: myAgentsReducer,
    lpDashboard: lpDashboardReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
})

// Export types for dispatch and state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Custom hooks for typed dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

