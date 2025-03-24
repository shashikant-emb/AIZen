import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest, deleteRequest } from "../../services/apiService"
import { Agent } from "../../types"

// Define types for My Agents
interface MyAgentsStats {
  totalAgents: number
  deployedAgents: number
  totalAUM: string
  avgPerformance: string
}

interface MyAgentsState {
  agents: Agent[]
  filteredAgents: Agent[]
  stats: MyAgentsStats
  filters: {
    searchQuery: string
    selectedFilter: string
    selectedSort: string
  }
  loading: boolean
  error: string | null
}

// Initial state
const initialState: MyAgentsState = {
  agents: [],
  filteredAgents: [],
  stats: {
    totalAgents: 0,
    deployedAgents: 0,
    totalAUM: "$0",
    avgPerformance: "0%",
  },
  filters: {
    searchQuery: "",
    selectedFilter: "All Agents",
    selectedSort: "Date Created (Newest)",
  },
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchMyAgents = createAsyncThunk("myAgents/fetchMyAgents", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/agents/my")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch my agents")
  }
})

export const fetchMyAgentsStats = createAsyncThunk("myAgents/fetchMyAgentsStats", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/agents/my/stats")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch agent stats")
  }
})

export const deployMyAgent = createAsyncThunk(
  "myAgents/deployMyAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/agents/${agentId}/deploy`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to deploy agent")
    }
  },
)

export const stopMyAgent = createAsyncThunk("myAgents/stopMyAgent", async (agentId: string, { rejectWithValue }) => {
  try {
    const response = await postRequest(`/agents/${agentId}/stop`)
    return { id: agentId, ...response.data }
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to stop agent")
  }
})

export const deleteMyAgent = createAsyncThunk(
  "myAgents/deleteMyAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      await deleteRequest(`/agents/${agentId}`)
      return agentId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete agent")
    }
  },
)

export const duplicateMyAgent = createAsyncThunk(
  "myAgents/duplicateMyAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/agents/${agentId}/duplicate`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to duplicate agent")
    }
  },
)

// Helper function to filter agents based on filters
const filterAgents = (agents: Agent[], filters: MyAgentsState["filters"]) => {
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

  // Apply status filter
  if (filters.selectedFilter !== "All Agents") {
    filtered = filtered.filter((agent) => agent.status === filters.selectedFilter)
  }

  // Apply sorting
  switch (filters.selectedSort) {
    case "Date Created (Newest)":
      filtered.sort((a, b) => new Date(b.dateCreated || "").getTime() - new Date(a.dateCreated || "").getTime())
      break
    case "Date Created (Oldest)":
      filtered.sort((a, b) => new Date(a.dateCreated || "").getTime() - new Date(b.dateCreated || "").getTime())
      break
    case "Performance (High to Low)":
      filtered.sort(
        (a, b) =>
          Number.parseFloat(b.performance.replace(/[^0-9.-]/g, "")) -
          Number.parseFloat(a.performance.replace(/[^0-9.-]/g, "")),
      )
      break
    case "AUM (High to Low)":
      filtered.sort(
        (a, b) => Number.parseFloat(b.aum.replace(/[^0-9.]/g, "")) - Number.parseFloat(a.aum.replace(/[^0-9.]/g, "")),
      )
      break
    default:
      break
  }

  return filtered
}

// Create the My Agents slice
const myAgentsSlice = createSlice({
  name: "myAgents",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedFilter: (state, action: PayloadAction<string>) => {
      state.filters.selectedFilter = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    setSelectedSort: (state, action: PayloadAction<string>) => {
      state.filters.selectedSort = action.payload
      state.filteredAgents = filterAgents(state.agents, state.filters)
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.filteredAgents = state.agents
    },
  },
  extraReducers: (builder) => {
    // Handle fetchMyAgents
    builder
      .addCase(fetchMyAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyAgents.fulfilled, (state, action) => {
        state.loading = false
        state.agents = action.payload
        state.filteredAgents = filterAgents(action.payload, state.filters)
      })
      .addCase(fetchMyAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchMyAgentsStats
    builder
      .addCase(fetchMyAgentsStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyAgentsStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchMyAgentsStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle deployMyAgent
    builder
      .addCase(deployMyAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deployMyAgent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.agents.findIndex((agent) => agent.id === action.payload.id)
        if (index !== -1) {
          state.agents[index] = { ...state.agents[index], ...action.payload, status: "Deployed" }
          state.filteredAgents = filterAgents(state.agents, state.filters)
        }
      })
      .addCase(deployMyAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle stopMyAgent
    builder
      .addCase(stopMyAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(stopMyAgent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.agents.findIndex((agent) => agent.id === action.payload.id)
        if (index !== -1) {
          state.agents[index] = { ...state.agents[index], ...action.payload, status: "Draft" }
          state.filteredAgents = filterAgents(state.agents, state.filters)
        }
      })
      .addCase(stopMyAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle deleteMyAgent
    builder
      .addCase(deleteMyAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMyAgent.fulfilled, (state, action) => {
        state.loading = false
        state.agents = state.agents.filter((agent) => agent.id !== action.payload)
        state.filteredAgents = filterAgents(state.agents, state.filters)
      })
      .addCase(deleteMyAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle duplicateMyAgent
    builder
      .addCase(duplicateMyAgent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(duplicateMyAgent.fulfilled, (state, action) => {
        state.loading = false
        state.agents.push(action.payload)
        state.filteredAgents = filterAgents(state.agents, state.filters)
      })
      .addCase(duplicateMyAgent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { setSearchQuery, setSelectedFilter, setSelectedSort, resetFilters } = myAgentsSlice.actions

// Export reducer
export default myAgentsSlice.reducer

