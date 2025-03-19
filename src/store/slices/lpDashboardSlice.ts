import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest } from "../../services/apiService"

// Define types for LP Dashboard
interface Pool {
  id: string
  token1: string
  token2: string
  chain: string
  protocol: string
  value: string
  apy: number
  il: number
  earnings: string
}

interface Reward {
  id: string
  protocol: string
  chain: string
  name: string
  rate: string
  claimable: string
  value: string
}

interface LPDashboardOverview {
  tvl: string
  tvlChange: number
  earnings: string
  earningsChange: number
  avgApy: number
  apyChange: number
  impermanentLoss: number
  ilChange: number
}

interface LPDashboardState {
  overview: LPDashboardOverview
  pools: Pool[]
  filteredPools: Pool[]
  rewards: Reward[]
  selectedTimeframe: string
  selectedChain: string
  performanceData: any
  loading: boolean
  error: string | null
}

// Initial state
const initialState: LPDashboardState = {
  overview: {
    tvl: "0",
    tvlChange: 0,
    earnings: "0",
    earningsChange: 0,
    avgApy: 0,
    apyChange: 0,
    impermanentLoss: 0,
    ilChange: 0,
  },
  pools: [],
  filteredPools: [],
  rewards: [],
  selectedTimeframe: "7d",
  selectedChain: "All Chains",
  performanceData: null,
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchLPDashboardData = createAsyncThunk(
  "lpDashboard/fetchLPDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest("/lp-dashboard")
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch LP dashboard data")
    }
  },
)

export const fetchPoolsData = createAsyncThunk(
  "lpDashboard/fetchPoolsData",
  async (chain = "All Chains", { rejectWithValue }) => {
    try {
      const endpoint = chain === "All Chains" ? "/lp-dashboard/pools" : `/lp-dashboard/pools?chain=${chain}`
      const response = await getRequest(endpoint)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch pools data")
    }
  },
)

export const fetchRewardsData = createAsyncThunk("lpDashboard/fetchRewardsData", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/lp-dashboard/rewards")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch rewards data")
  }
})

export const fetchPerformanceData = createAsyncThunk(
  "lpDashboard/fetchPerformanceData",
  async (timeframe: string, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/lp-dashboard/performance?timeframe=${timeframe}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch performance data")
    }
  },
)

export const claimReward = createAsyncThunk(
  "lpDashboard/claimReward",
  async (rewardId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/lp-dashboard/rewards/${rewardId}/claim`)
      return { id: rewardId, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to claim reward")
    }
  },
)

export const addLiquidity = createAsyncThunk("lpDashboard/addLiquidity", async (data: any, { rejectWithValue }) => {
  try {
    const response = await postRequest("/lp-dashboard/add-liquidity", data)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to add liquidity")
  }
})

export const removeLiquidity = createAsyncThunk(
  "lpDashboard/removeLiquidity",
  async (poolId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/lp-dashboard/pools/${poolId}/remove`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to remove liquidity")
    }
  },
)

// Create the LP Dashboard slice
const lpDashboardSlice = createSlice({
  name: "lpDashboard",
  initialState,
  reducers: {
    setSelectedTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload
    },
    setSelectedChain: (state, action: PayloadAction<string>) => {
      state.selectedChain = action.payload
      if (state.selectedChain === "All Chains") {
        state.filteredPools = state.pools
      } else {
        state.filteredPools = state.pools.filter((pool) => pool.chain === state.selectedChain)
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetchLPDashboardData
    builder
      .addCase(fetchLPDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLPDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.overview = action.payload.overview
      })
      .addCase(fetchLPDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchPoolsData
    builder
      .addCase(fetchPoolsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPoolsData.fulfilled, (state, action) => {
        state.loading = false
        state.pools = action.payload
        if (state.selectedChain === "All Chains") {
          state.filteredPools = action.payload
        } else {
          state.filteredPools = action.payload.filter((pool) => pool.chain === state.selectedChain)
        }
      })
      .addCase(fetchPoolsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchRewardsData
    builder
      .addCase(fetchRewardsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRewardsData.fulfilled, (state, action) => {
        state.loading = false
        state.rewards = action.payload
      })
      .addCase(fetchRewardsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchPerformanceData
    builder
      .addCase(fetchPerformanceData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.loading = false
        state.performanceData = action.payload
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle claimReward
    builder
      .addCase(claimReward.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        state.loading = false
        const index = state.rewards.findIndex((reward) => reward.id === action.payload.id)
        if (index !== -1) {
          state.rewards[index] = { ...state.rewards[index], claimable: "0", ...action.payload }
        }
      })
      .addCase(claimReward.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle addLiquidity
    builder
      .addCase(addLiquidity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addLiquidity.fulfilled, (state, action) => {
        state.loading = false
        state.pools.push(action.payload)
        if (state.selectedChain === "All Chains" || action.payload.chain === state.selectedChain) {
          state.filteredPools.push(action.payload)
        }
      })
      .addCase(addLiquidity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle removeLiquidity
    builder
      .addCase(removeLiquidity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeLiquidity.fulfilled, (state, action) => {
        state.loading = false
        state.pools = state.pools.filter((pool) => pool.id !== action.payload.id)
        state.filteredPools = state.filteredPools.filter((pool) => pool.id !== action.payload.id)
      })
      .addCase(removeLiquidity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { setSelectedTimeframe, setSelectedChain } = lpDashboardSlice.actions

// Export reducer
export default lpDashboardSlice.reducer

