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
  error: string | null,
  userID:string 
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isWalletConnected: false,
  walletAddress: null,
  walletBalance: null,
  userProfile: null,
  userID: '',
  loading: false,
  error: null,
}

// Async thunks for API calls

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password, rememberMe }: { email: string; password: string; rememberMe: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest("/login", { email, password, rememberMe })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials.")
    }
  },
)

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest("/signup", { name, email, password })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed. Please try again.")
    }
  },
)

export const registerWithWallet = createAsyncThunk(
  "auth/registerWithWallet",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      // First connect wallet
      const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" // Simulated wallet address

      // Then register with the wallet
      const response = await postRequest("/auth/register-wallet", { name, walletAddress })
      return {
        ...response.data,
        walletAddress,
        walletBalance: "0.0",
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Wallet registration failed. Please try again.")
    }
  },
)


export const connectWallet = createAsyncThunk("auth/connectWallet", async (walletAddress, { rejectWithValue }) => {
  try {
    // In a real app, this would interact with a wallet provider like MetaMask
    // For this example, we'll simulate a successful connection
    // const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    // const walletBalance = "42580.25"

    // Register wallet with backend
    const response = await postRequest("/wallet_auth",  walletAddress )

    return {
      walletAddress,
      // walletBalance,
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
export const getUserPrivatekey = createAsyncThunk(
  "auth/updateUserProfile",
  async (id:any, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/get_private_key?id=${id}`)
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
      localStorage.removeItem("wallet_address")

    },
    setWalletBalance: (state, action: PayloadAction<string>) => {
      state.walletBalance = action.payload
    },
  },
  extraReducers: (builder) => {
        // Handle login
        builder
        .addCase(login.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(login.fulfilled, (state, action) => {
          
          state.loading = false
          state.isAuthenticated = true
          // state.userProfile = action.payload.user
          state.userProfile = {
            id: action.payload.response.id,
            email: action.payload.response.email,
            name: action.payload.response.name,
            walletAddress: action.payload.response.wallet_address || "", // Default empty string
            bio: action.payload.response.bio || "", // Default empty string
            avatar: action.payload.response.avatar || "", // Default empty string
          }
          state.userID= action.payload?.response?.id  || null
  
          // Store auth token if provided
          if (action.payload.response.public_key) {
            localStorage.setItem("public_key", action.payload.response.public_key)
            localStorage.setItem("wallet_address", action.payload.response.wallet_address)
          }
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
  
      // Handle register
      builder
        .addCase(register.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(register.fulfilled, (state, action) => {
          state.loading = false
          state.isAuthenticated = true
          // state.userProfile = {id:action.payload.id,email:action.payload.email,name:action.payload.name}
          state.userProfile = {
            id: action.payload.response.id,
            email: action.payload.response.email,
            name: action.payload.response.name,
            walletAddress: action.payload.response.wallet_address || "", // Default empty string
            bio: action.payload.response.bio || "", // Default empty string
            avatar: action.payload.response.avatar || "", // Default empty string
          }
          state.userID= action.payload?.response?.id  || null
          // Store auth token if provided
          if (action.payload.response.public_key) {
            localStorage.setItem("public_key", action.payload.response.public_key)
            localStorage.setItem("wallet_address", action.payload.response.wallet_address)
          }
        })
        .addCase(register.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
  
      // Handle registerWithWallet
      builder
        .addCase(registerWithWallet.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(registerWithWallet.fulfilled, (state, action) => {
          state.loading = false
          state.isAuthenticated = true
          state.isWalletConnected = true
          state.walletAddress = action.payload.walletAddress
          state.walletBalance = action.payload.walletBalance
          state.userProfile = action.payload.user
  
          // Store auth token if provided
          if (action.payload.token) {
            localStorage.setItem("auth_token", action.payload.token)
          }
        })
        .addCase(registerWithWallet.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
        
    // Handle connectWallet
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false
        state.isWalletConnected = true
        // state.walletAddress = action.payload.walletAddress.wallet_address
        // state.walletBalance = action.payload.walletBalance
        // state.isAuthenticated = true

        // If the response includes user profile data
        // if (action.payload.userProfile) {
        //   state.userProfile = action.payload.userProfile
        // }

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

