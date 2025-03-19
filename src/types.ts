export interface Agent {
    id: string
    name: string
    description: string
    performance: string
    aum: string
    il: string
    dailyRebalance: string
    weeklyReward: string
    tags: string[]
    trending?: boolean
    status?: "Deployed" | "Draft"
    dateCreated?: string
  }
  
  export interface Stats {
    activeAgents: number
    totalAUM: string
    weeklyReturn: string
    avgIL: string
  }
  
  export interface DummyData {
    stats: Stats
    agents: Agent[]
  }