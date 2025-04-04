// import { configureStore } from "@reduxjs/toolkit"
// import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
// import marketplaceReducer from "./slices/marketplaceSlice"
// import agentBuilderReducer from "./slices/agentBuilderSlice"
// import myAgentsReducer from "./slices/myAgentsSlice"
// import lpDashboardReducer from "./slices/lpDashboardSlice"
// import authReducer from "./slices/authSlice"
// import settingsReducer from "./slices/settingsSlice"
// import historyReducer from "./slices/historySlice"
// // Configure the Redux store
// export const store = configureStore({
//   reducer: {
//     marketplace: marketplaceReducer,
//     agentBuilder: agentBuilderReducer,
//     myAgents: myAgentsReducer,
//     lpDashboard: lpDashboardReducer,
//     auth: authReducer,
//     settings: settingsReducer,
//     history: historyReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   devTools: process.env.NODE_ENV !== "production",
// })

// // Export types for dispatch and state
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// // Custom hooks for typed dispatch and selector
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage" // Use localStorage
import thunk from "redux-thunk"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"

import marketplaceReducer from "./slices/marketplaceSlice"
import agentBuilderReducer from "./slices/agentBuilderSlice"
import myAgentsReducer from "./slices/myAgentsSlice"
import lpDashboardReducer from "./slices/lpDashboardSlice"
import authReducer from "./slices/authSlice"
import settingsReducer from "./slices/settingsSlice"
import historyReducer from "./slices/historySlice"

// 🔹 Persist configuration
const persistConfig = {
  key: "root_v1", // Change key to avoid old cache conflicts
  storage,
  whitelist: ["auth", /*"settings", "myAgents"*/], // Only persist these reducers
}

// 🔹 Combine reducers first
const rootReducer = combineReducers({
  marketplace: marketplaceReducer,
  agentBuilder: agentBuilderReducer,
  myAgents: myAgentsReducer,
  lpDashboard: lpDashboardReducer,
  auth: authReducer, // Auth will be persisted
  settings: settingsReducer,
  history: historyReducer,
})

// 🔹 Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 🔹 Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
})

// 🔹 Persistor for rehydrating state
export const persistor = persistStore(store)

// 🔹 Export types for dispatch and state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 🔹 Custom hooks for typed dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
