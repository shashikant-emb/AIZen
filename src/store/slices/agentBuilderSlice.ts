import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getRequest, postRequest } from "../../services/apiService"

// Define types for the agent builder
interface AgentFormData {
  name: string
  role: string
  description: string
  goals: string
  instructions: string
  capabilities: string[]
  tools: string[]
}

interface AgentResponse {
  id: string
  name: string
  role: string
  goals: string
  description: string
  tools: string[]
  rebalanceFrequency: number
  riskProfile: string
  autoExecute: boolean
}

interface ChatMessage {
  text: string
  isUser: boolean
}

interface AgentBuilderState {
  formData: AgentFormData
  isLoading: boolean
  isDeployed: boolean
  deployedAgent: AgentResponse | null
  chatMessages: ChatMessage[]
  error: string | null
  savedAgents: AgentResponse[]
  simulationResults: any | null
}

// Initial state
const initialState: AgentBuilderState = {
  formData: {
    name: "",
    role: "",
    description: "",
    goals: "",
    instructions: "",
    capabilities: ["Liquidity Provision", "Asset Rebalancing"],
    tools: ["RSI", "Momentum", "Alpha-based Trigger"],
  },
  isLoading: false,
  isDeployed: false,
  deployedAgent: null,
  chatMessages: [{ text: "Hello! I'm your liquidity rebalancer agent. How can I assist you today?", isUser: false }],
  error: null,
  savedAgents: [],
  simulationResults: null,
}

// Async thunks for API calls
export const saveAgent = createAsyncThunk(
  "agentBuilder/saveAgent",
  async (formData: AgentFormData, { rejectWithValue }) => {
    try {
      const response = await postRequest("/agents/save", formData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to save agent")
    }
  },
)

export const simulateAgent = createAsyncThunk(
  "agentBuilder/simulateAgent",
  async (formData: AgentFormData, { rejectWithValue }) => {
    try {
      const response = await postRequest("/agents/simulate", formData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to simulate agent")
    }
  },
)

export const deployAgent = createAsyncThunk(
  "agentBuilder/deployAgent",
  async (formData: AgentFormData, { rejectWithValue }) => {
    try {
      const response = await postRequest("/agents/deploy", formData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to deploy agent")
    }
  },
)

export const sendChatMessage = createAsyncThunk(
  "agentBuilder/sendChatMessage",
  async ({ agentId, message }: { agentId: string; message: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/agents/${agentId}/chat`, { message })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send message")
    }
  },
)

export const fetchSavedAgents = createAsyncThunk("agentBuilder/fetchSavedAgents", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest("/agents/saved")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch saved agents")
  }
})

// Create the agent builder slice
const agentBuilderSlice = createSlice({
  name: "agentBuilder",
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: keyof AgentFormData; value: any }>) => {
      const { field, value } = action.payload
      state.formData[field] = value
    },
    toggleCapability: (state, action: PayloadAction<string>) => {
      const capability = action.payload
      if (state.formData.capabilities.includes(capability)) {
        state.formData.capabilities = state.formData.capabilities.filter((c) => c !== capability)
      } else {
        state.formData.capabilities.push(capability)
      }
    },
    toggleTool: (state, action: PayloadAction<string>) => {
      const tool = action.payload
      if (state.formData.tools.includes(tool)) {
        state.formData.tools = state.formData.tools.filter((t) => t !== tool)
      } else {
        state.formData.tools.push(tool)
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload)
    },
    resetChat: (state) => {
      state.chatMessages = [
        { text: "Hello! I'm your liquidity rebalancer agent. How can I assist you today?", isUser: false },
      ]
    },
    resetAgentBuilder: (state) => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    // Handle saveAgent
    builder
      .addCase(saveAgent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveAgent.fulfilled, (state, action) => {
        state.isLoading = false
        state.savedAgents.push(action.payload)
      })
      .addCase(saveAgent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Handle simulateAgent
    builder
      .addCase(simulateAgent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(simulateAgent.fulfilled, (state, action) => {
        state.isLoading = false
        state.simulationResults = action.payload
      })
      .addCase(simulateAgent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Handle deployAgent
    builder
      .addCase(deployAgent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deployAgent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isDeployed = true
        state.deployedAgent = action.payload
      })
      .addCase(deployAgent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Handle sendChatMessage
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.chatMessages.push({
          text: action.payload.response,
          isUser: false,
        })
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Handle fetchSavedAgents
    builder
      .addCase(fetchSavedAgents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSavedAgents.fulfilled, (state, action) => {
        state.isLoading = false
        state.savedAgents = action.payload
      })
      .addCase(fetchSavedAgents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// Export actions
export const { updateFormField, toggleCapability, toggleTool, addChatMessage, resetChat, resetAgentBuilder } =
  agentBuilderSlice.actions

// Export reducer
export default agentBuilderSlice.reducer

