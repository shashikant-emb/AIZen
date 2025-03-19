import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest } from "../../services/apiService"

// Define types for Auth
interface UserProfile {
  id: string
  name: string
  email: string
  walletAddress: string
  bio: string
  avatar: string
}

interface AuthState {
  isAuthenticated: boolean
  isWalletConnected: boolean
  walletAddress: string | null
  walletBalance: string | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isWalletConnected: false,
  walletAddress: null,
  walletBalance: null,
  userProfile: null,
  loading: false,
  error: null,
}

// Async thunks for API calls
export const connectWallet = createAsyncThunk("auth/connectWallet", async (_, { rejectWithValue }) => {
  try {
    // In a real app, this would interact with a wallet provider like MetaMask
    // For this example, we'll simulate a successful connection
    const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    const walletBalance = "42580.25"

    // Register wallet with backend
    const response = await postRequest("/auth/connect-wallet", { walletAddress })

    return {
      walletAddress,
      walletBalance,
      ...response.data,
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to connect wallet")
  }
})

export const disconnectWallet = createAsyncThunk("auth/disconnectWallet", async (_, { rejectWithValue }) => {
  try {
    // In a real app, this would disconnect from the wallet provider
    await postRequest("/auth/disconnect-wallet")
    return true
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to disconnect wallet")
  }
})

export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/auth/profile")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch user profile")
  }
})

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await postRequest("/auth/profile", profileData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update user profile")
    }
  },
)

// Create the Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.userProfile = null
      localStorage.removeItem("auth_token")
    },
    setWalletBalance: (state, action: PayloadAction<string>) => {
      state.walletBalance = action.payload
    },
  },
  extraReducers: (builder) => {
    // Handle connectWallet
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false
        state.isWalletConnected = true
        state.walletAddress = action.payload.walletAddress
        state.walletBalance = action.payload.walletBalance
        state.isAuthenticated = true

        // If the response includes user profile data
        if (action.payload.userProfile) {
          state.userProfile = action.payload.userProfile
        }

        // Store auth token if provided
        if (action.payload.token) {
          localStorage.setItem("auth_token", action.payload.token)
        }
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle disconnectWallet
    builder
      .addCase(disconnectWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(disconnectWallet.fulfilled, (state) => {
        state.loading = false
        state.isWalletConnected = false
        state.walletAddress = null
        state.walletBalance = null
        state.isAuthenticated = false
        state.userProfile = null
        localStorage.removeItem("auth_token")
      })
      .addCase(disconnectWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchUserProfile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle updateUserProfile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = { ...state.userProfile, ...action.payload }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { logout, setWalletBalance } = authSlice.actions

// Export reducer
export default authSlice.reducer

