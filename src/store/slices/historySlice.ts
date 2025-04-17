// import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
// import { getRequest, postRequest, deleteRequest } from "../../services/apiService"
// import { Agent } from "../../types"

// interface AgentHistory {
//     event: string;
//     timestamp: string;
//   }
  
//   interface History {
//     id: string;
//     agentName: string;
//     agentType: string;
//     timestamp: string;
//     duration: string;
//     status: string;
//     performance: string;
//     agentHistory: AgentHistory[];
//   }
// interface MyAgentsHistoryState {
//   history: History[]
//   loading: boolean
//   error: string | null
// }

// // Initial state
// const initialState: MyAgentsHistoryState = {
//   history: [],
//   loading: false,
//   error: null,
// }

// // // Async thunks for API calls
// export const fetchAgentsHistory = createAsyncThunk("history/fetchAgentsHistory", async (_, { rejectWithValue }) => {
//   try {
//     const response = await getRequest("agent_history")
//     return response.data
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data || "Failed to fetch my agents")
//   }
// })


import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, deleteRequest } from "../../services/apiService"

// Define types for History
export interface HistoryItem {
  id: string
  agentName: string
  agentType: string
  timestamp: string
  duration: string
  status: "Completed" | "Failed" | "In Progress"
  performance: string
  agentHistory: HistoryStats[];
}

interface HistoryStats {
  totalExecutions: number
  completed: number
  failed: number
  inProgress: number
}

interface HistoryState {
  items: HistoryItem[]
  filteredItems: HistoryItem[]
  stats: HistoryStats
  filters: {
    searchQuery: string
    selectedPeriod: string
    selectedStatus: string
  }
  selectedItem: HistoryItem | null
  loading: boolean
  error: string | null
}

// Initial state
const initialState: HistoryState = {
  items: [],
  filteredItems: [],
  stats: {
    totalExecutions: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
  },
  filters: {
    searchQuery: "",
    selectedPeriod: "Last 7 Days",
    selectedStatus: "All",
  },
  selectedItem: null,
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchHistoryItems = createAsyncThunk("history/fetchHistoryItems", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/agent_history/")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch history items")
  }
})
export const fetchCommisonedHistoryItems = createAsyncThunk("history/fetchHistory", async (userID, { rejectWithValue }) => {
  try {
    console.log("userID",userID)
    const response = await getRequest(`/agent_history/${userID}`)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch history items")
  }
})

export const fetchHistoryStats = createAsyncThunk("history/fetchHistoryStats", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/history/stats")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch history stats")
  }
})

export const fetchHistoryItemDetails = createAsyncThunk(
  "history/fetchHistoryItemDetails",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/history/${itemId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch history item details")
    }
  },
)

export const downloadHistoryReport = createAsyncThunk(
  "history/downloadHistoryReport",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/history/${itemId}/report`, {
        responseType: "blob",
      })

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `report-${itemId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      return itemId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to download report")
    }
  },
)

export const deleteHistoryItem = createAsyncThunk(
  "history/deleteHistoryItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      await deleteRequest(`/history/${itemId}`)
      return itemId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete history item")
    }
  },
)

// Helper function to filter history items based on filters
const filterHistoryItems = (items: HistoryItem[], filters: HistoryState["filters"]) => {
  let filtered = [...items]

  // Apply search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (item) => item.agentName.toLowerCase().includes(query) || item.agentType.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (filters.selectedStatus !== "All") {
    filtered = filtered.filter((item) => item.status === filters.selectedStatus)
  }

  // Apply period filter
  // In a real app, you would filter based on actual dates
  // For this example, we'll just simulate it
  switch (filters.selectedPeriod) {
    case "Last 24 Hours":
      // Simulate filtering for last 24 hours
      filtered = filtered.slice(0, Math.ceil(filtered.length * 0.3))
      break
    case "Last 7 Days":
      // Simulate filtering for last 7 days
      filtered = filtered.slice(0, Math.ceil(filtered.length * 0.7))
      break
    case "Last 30 Days":
      // Simulate filtering for last 30 days
      filtered = filtered.slice(0, Math.ceil(filtered.length * 0.9))
      break
    case "All Time":
    default:
      // No filtering needed
      break
  }

  return filtered
}

// Create the History slice
const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
      state.filteredItems = filterHistoryItems(state.items, state.filters)
    },
    setSelectedPeriod: (state, action: PayloadAction<string>) => {
      state.filters.selectedPeriod = action.payload
      state.filteredItems = filterHistoryItems(state.items, state.filters)
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.filters.selectedStatus = action.payload
      state.filteredItems = filterHistoryItems(state.items, state.filters)
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.filteredItems = state.items
    },
    selectHistoryItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = state.items.find((item) => item.id === action.payload) || null
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null
    },
  },
  extraReducers: (builder) => {
    // Handle fetchHistoryItems
    builder
      .addCase(fetchHistoryItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHistoryItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
        // state.filteredItems = filterHistoryItems(action.payload, state.filters)

        // Update stats based on items
        // state.stats.totalExecutions = action.payload.length
        // state.stats.completed = action.payload.filter((item) => item.status === "Completed").length
        // state.stats.failed = action.payload.filter((item) => item.status === "Failed").length
        // state.stats.inProgress = action.payload.filter((item) => item.status === "In Progress").length
      })
      .addCase(fetchHistoryItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchHistoryStats
    builder
      .addCase(fetchHistoryStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHistoryStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchHistoryStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle fetchHistoryItemDetails
    builder
      .addCase(fetchHistoryItemDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHistoryItemDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload
      })
      .addCase(fetchHistoryItemDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle downloadHistoryReport
    builder
      .addCase(downloadHistoryReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadHistoryReport.fulfilled, (state) => {
        state.loading = false
        // No state update needed for successful download
      })
      .addCase(downloadHistoryReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle deleteHistoryItem
    builder
      .addCase(deleteHistoryItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteHistoryItem.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.filteredItems = state.filteredItems.filter((item) => item.id !== action.payload)

        // Update stats
        state.stats.totalExecutions = state.items.length
        state.stats.completed = state.items.filter((item) => item.status === "Completed").length
        state.stats.failed = state.items.filter((item) => item.status === "Failed").length
        state.stats.inProgress = state.items.filter((item) => item.status === "In Progress").length

        // Clear selected item if it was deleted
        if (state.selectedItem && state.selectedItem.id === action.payload) {
          state.selectedItem = null
        }
      })
      .addCase(deleteHistoryItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const {
  setSearchQuery,
  setSelectedPeriod,
  setSelectedStatus,
  resetFilters,
  selectHistoryItem,
  clearSelectedItem,
} = historySlice.actions

// Export reducer
export default historySlice.reducer

