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
    riskLevel:string
    strategyType:string
    status?: "Deployed" | "Draft"
    dateCreated?: string
    created_date?:string
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