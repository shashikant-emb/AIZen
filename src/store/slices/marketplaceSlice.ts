import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest } from "../../services/apiService"
import { Agent, Stats } from "../../types"

// Define the state type for the marketplace slice
interface MarketplaceState {
  agents: Agent[]
  filteredAgents: Agent[]
  stats: Stats
  filters: {
    searchQuery: string
    selectedStrategy: string
    selectedRiskLevel: string
    selectedSort: string
    selectedTimePeriod: string
    selectedTags: string[]
  }
  loading: boolean
  error: string | null
}

// Initial state
const initialState: MarketplaceState = {
  agents: [],
  filteredAgents: [],
  stats: {
    activeAgents: 0,
    totalAUM: "$0",
    weeklyReturn: "0%",
    avgIL: "0%",
  },
  filters: {
    searchQuery: "",
    selectedStrategy: "All Strategies",
    selectedRiskLevel: "All Levels",
    selectedSort: "AUM (High to Low)",
    selectedTimePeriod: "7 Days",
    selectedTags: ["All"],
  },
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchAgents = createAsyncThunk("marketplace/fetchAgents", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/agents")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch agents")
  }
})

export const fetchMarketplaceStats = createAsyncThunk("marketplace/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/marketplace/stats")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch marketplace stats")
  }
})

export const commissionAgent = createAsyncThunk(
  "marketplace/commissionAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/agents/${agentId}/commission`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to commission agent")
    }
  },
)

// Create the marketplace slice
const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedStrategy: (state, action: PayloadAction<string>) => {
      state.filters.selectedStrategy = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedRiskLevel: (state, action: PayloadAction<string>) => {
      state.filters.selectedRiskLevel = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedSort: (state, action: PayloadAction<string>) => {
      state.filters.selectedSort = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedTimePeriod: (state, action: PayloadAction<string>) => {
      state.filters.selectedTimePeriod = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedTags = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.filteredAgents = state.agents
    },
  },
  extraReducers: (builder) => {
    // Handle fetchAgents
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false
        state.agents = action.payload
        state.filteredAgents = filterAgents(action.payload, state.filters)
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchMarketplaceStats
    builder
      .addCase(fetchMarketplaceStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketplaceStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchMarketplaceStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle commissionAgent
    builder
      .addCase(commissionAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(commissionAgent.fulfilled, (state) => {
        state.loading = false
        // You might want to update the agent's status or other properties here
      })
      .addCase(commissionAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Helper function to filter agents based on filters
const filterAgents = (agents: Agent[], filters: MarketplaceState["filters"]) => {
  let filtered = [...agents]

  // Apply search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  // Apply strategy filter
  if (filters.selectedStrategy !== "All Strategies") {
    filtered = filtered.filter((agent) => agent.tags.includes(filters.selectedStrategy))
  }

  // Apply risk level filter
  if (filters.selectedRiskLevel !== "All Levels") {
    filtered = filtered.filter((agent) => agent.tags.includes(filters.selectedRiskLevel))
  }

  // Apply tag filter
  if (!filters.selectedTags.includes("All")) {
    filtered = filtered.filter((agent) => filters.selectedTags.some((tag) => agent.tags.includes(tag)))
  }

  // Apply sorting
  switch (filters.selectedSort) {
    case "AUM (High to Low)":
      filtered.sort(
        (a, b) => Number.parseFloat(b.aum.replace(/[^0-9.]/g, "")) - Number.parseFloat(a.aum.replace(/[^0-9.]/g, "")),
      )
      break
    case "AUM (Low to High)":
      filtered.sort(
        (a, b) => Number.parseFloat(a.aum.replace(/[^0-9.]/g, "")) - Number.parseFloat(b.aum.replace(/[^0-9.]/g, "")),
      )
      break
    case "Weekly Return":
      filtered.sort((a, b) => Number.parseFloat(b.weeklyReward) - Number.parseFloat(a.weeklyReward))
      break
    case "IL":
      filtered.sort((a, b) => Number.parseFloat(a.il) - Number.parseFloat(b.il))
      break
    default:
      break
  }

  return filtered
}

// Export actions
export const {
  setSearchQuery,
  setSelectedStrategy,
  setSelectedRiskLevel,
  setSelectedSort,
  setSelectedTimePeriod,
  setSelectedTags,
  resetFilters,
} = marketplaceSlice.actions

// Export reducer
export default marketplaceSlice.reducer

