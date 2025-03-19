import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest } from "../../services/apiService"

// Define types for Settings
interface NotificationSettings {
  email: boolean
  performance: boolean
  security: boolean
  marketing: boolean
}

interface SettingsState {
  darkMode: boolean
  notifications: NotificationSettings
  apiKey: string
  twoFactorEnabled: boolean
  loading: boolean
  error: string | null
}

// Initial state
const initialState: SettingsState = {
  darkMode: true,
  notifications: {
    email: true,
    performance: true,
    security: true,
    marketing: false,
  },
  apiKey: "",
  twoFactorEnabled: false,
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchSettings = createAsyncThunk("settings/fetchSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/settings")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch settings")
  }
})

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settings: Partial<SettingsState>, { rejectWithValue }) => {
    try {
      const response = await postRequest("/settings", settings)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update settings")
    }
  },
)

export const generateNewApiKey = createAsyncThunk("settings/generateNewApiKey", async (_, { rejectWithValue }) => {
  try {
    const response = await postRequest("/settings/generate-api-key")
    return response.data.apiKey
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to generate new API key")
  }
})

export const toggleTwoFactorAuth = createAsyncThunk(
  "settings/toggleTwoFactorAuth",
  async (enable: boolean, { rejectWithValue }) => {
    try {
      const response = await postRequest("/settings/two-factor", { enable })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to toggle two-factor authentication")
    }
  },
)

export const changePassword = createAsyncThunk(
  "settings/changePassword",
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest("/settings/change-password", {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to change password")
    }
  },
)

// Create the Settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      // Apply dark mode to the document
      if (state.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    updateNotificationSetting: (state, action: PayloadAction<{ key: keyof NotificationSettings; value: boolean }>) => {
      const { key, value } = action.payload
      state.notifications[key] = value
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSettings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false
        return { ...state, ...action.payload }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle updateSettings
    builder
      .addCase(updateSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false
        return { ...state, ...action.payload }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle generateNewApiKey
    builder
      .addCase(generateNewApiKey.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateNewApiKey.fulfilled, (state, action) => {
        state.loading = false
        state.apiKey = action.payload
      })
      .addCase(generateNewApiKey.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle toggleTwoFactorAuth
    builder
      .addCase(toggleTwoFactorAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(toggleTwoFactorAuth.fulfilled, (state, action) => {
        state.loading = false
        state.twoFactorEnabled = action.payload.enabled
      })
      .addCase(toggleTwoFactorAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle changePassword
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
        // Password changed successfully, no state update needed
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { toggleDarkMode, updateNotificationSetting } = settingsSlice.actions

// Export reducer
export default settingsSlice.reducer

