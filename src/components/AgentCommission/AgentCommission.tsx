"use client"

import  React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { useToast } from "../Toast/Toast"
import AgentCard from "../AgentCard/AgentCard"
import "./AgentCommission.css"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Dummy data for the agent
const dummyAgent = {
  id: "1",
  name: "Alpha Hunter",
  description:
    "Aggressive high-volume trading agent focused on capturing short-term alpha across multiple DEXes with minimal impermanent loss.",
  performance: "+34.5%",
  aum: "$3.2M",
  il: "3.1%",
  dailyRebalance: "12x",
  weeklyReward: "8.2%",
  tags: ["Momentum", "High Risk", "Ethereum"],
  trending: true,
}

// Dummy data for performance chart
const performanceData: ChartData<"line"> = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Agent Performance",
      data: [2.3, 3.1, 4.2, 3.8, 5.4, 6.8, 7.2, 8.1, 7.6, 9.2, 10.5, 12.3],
      borderColor: "#8a56ff",
      backgroundColor: "rgba(138, 86, 255, 0.1)",
      tension: 0.4,
      fill: true,
    },
    // {
    //   label: "Market Average",
    //   data: [1.8, 2.2, 2.7, 2.5, 3.1, 3.5, 3.8, 4.2, 4.0, 4.5, 5.1, 5.8],
    //   borderColor: "#56ccf2",
    //   backgroundColor: "rgba(86, 204, 242, 0.1)",
    //   tension: 0.4,
    //   fill: true,
    // },
  ],
}

// Dummy data for allocation chart
const allocationData: ChartData<"bar"> = {
  labels: ["ETH-USDC", "WBTC-ETH", "ARB-ETH", "OP-USDC", "MATIC-ETH"],
  datasets: [
    {
      label: "Allocation %",
      data: [35, 25, 15, 15, 10],
      backgroundColor: [
        "rgba(138, 86, 255, 0.7)",
        "rgba(86, 204, 242, 0.7)",
        "rgba(0, 200, 83, 0.7)",
        "rgba(255, 193, 7, 0.7)",
        "rgba(255, 82, 82, 0.7)",
      ],
    },
  ],
}

// Dummy data for operations
const dummyOperations = [
  {
    id: 1,
    type: "Rebalance",
    timestamp: "2025-03-18 14:32:15",
    status: "Completed",
    details: "ETH-USDC position adjusted by +2.5%",
  },
  {
    id: 2,
    type: "Fee Collection",
    timestamp: "2025-03-18 08:15:22",
    status: "Completed",
    details: "Collected 0.05 ETH in trading fees",
  },
  {
    id: 3,
    type: "Position Adjustment",
    timestamp: "2025-03-17 19:45:33",
    status: "Completed",
    details: "Reduced exposure to WBTC-ETH by 3%",
  },
  {
    id: 4,
    type: "Rebalance",
    timestamp: "2025-03-17 12:10:05",
    status: "Completed",
    details: "ARB-ETH position adjusted by -1.8%",
  },
  {
    id: 5,
    type: "Liquidity Addition",
    timestamp: "2025-03-16 22:30:18",
    status: "Completed",
    details: "Added 0.2 ETH to OP-USDC pool",
  },
]

// Chart options
const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#a0a0b0",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
      ticks: {
        color: "#a0a0b0",
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
      ticks: {
        color: "#a0a0b0",
      },
    },
  },
}

const barChartOptions: ChartOptions<"bar"> = {
  ...chartOptions,
  indexAxis: "y",
  plugins: {
    ...chartOptions.plugins,
    legend: {
      display: false,
    },
  },
}

const AgentCommission: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>()
  const { myAgents } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, error,userProfile } = authSelectors
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [agent, setAgent] = useState(dummyAgent)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate API call to fetch agent details
    const fetchAgentDetails = async () => {
      try {
        setLoading(true)
        // In a real app, this would be a call to your API
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        const payload={
            agent_id:agentId,
            // user_if:userProfile?.id
           }
           const res = await myAgents.fetchMyAgent(payload)
            setAgent({
            //   ...dummyAgent,
              ...res?.payload?.response,
              tags:[],
              id: agentId || "my-1",
            })

        // // For now, we'll just use the dummy data
        // setAgent({
        //   ...dummyAgent,
        //   id: agentId || "1",
        // })

        showToast("Agent commissioned successfully!", "success")
      } catch (error) {
        showToast("Failed to load agent details", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchAgentDetails()
  }, [agentId, showToast])

  const handleBackToMarketplace = () => {
    navigate("/marketplace")
  }

  return (
    <div className="agent-commission-page">
      <div className="commission-header">
        <button className="back-button" onClick={handleBackToMarketplace}>
          ← Back to Marketplace
        </button>
        <h1>Commissioned Agent</h1>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agent details...</p>
        </div>
      ) : (
        <>
          <div className="commission-content">
            <div className="agent-details-card">
              <AgentCard agent={agent} showActions={false} />
            </div>

            <div className="agent-dashboard">
              <div className="dashboard-tabs">
                <button
                  className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab-button ${activeTab === "performance" ? "active" : ""}`}
                  onClick={() => setActiveTab("performance")}
                >
                  Performance
                </button>
                <button
                  className={`tab-button ${activeTab === "operations" ? "active" : ""}`}
                  onClick={() => setActiveTab("operations")}
                >
                  Operations
                </button>
                {/* <button
                  className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button> */}
              </div>

              <div className="dashboard-content">
                {activeTab === "overview" && (
                  <div className="overview-tab">
                    <div className="stats-row">
                      <div className="stat-card">
                        <h3>Current AUM</h3>
                        <div className="stat-value">{agent.aum}</div>
                      </div>
                      <div className="stat-card">
                        <h3>Weekly Return</h3>
                        <div className="stat-value positive">{agent.weeklyReward ||"8.2%"}</div>
                      </div>
                      <div className="stat-card">
                        <h3>Impermanent Loss</h3>
                        <div className="stat-value">{agent.il}</div>
                      </div>
                      <div className="stat-card">
                        <h3>Daily Rebalances</h3>
                        <div className="stat-value">{agent.dailyRebalance||"12x"}</div>
                      </div>
                    </div>

                    <div className="charts-row">
                      <div className="chart-container">
                        <h3>Performance History</h3>
                        <div className="chart-wrapper">
                          <Line data={performanceData} options={chartOptions} />
                        </div>
                      </div>
                      <div className="chart-container">
                        <h3>Current Allocation</h3>
                        <div className="chart-wrapper">
                          <Bar data={allocationData} options={barChartOptions} />
                        </div>
                      </div>
                    </div>

                    <div className="recent-operations">
                      <h3>Recent Operations</h3>
                      <div className="operations-table-container">
                        <table className="operations-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Timestamp</th>
                              <th>Status</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dummyOperations.slice(0, 3).map((op) => (
                              <tr key={op.id}>
                                <td>{op.type}</td>
                                <td>{op.timestamp}</td>
                                <td className="status-cell">{op.status}</td>
                                <td>{op.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div className="performance-tab">
                    <div className="chart-container full-width">
                      <h3>Detailed Performance History</h3>
                      <div className="chart-wrapper">
                        <Line data={performanceData} options={chartOptions} />
                      </div>
                    </div>

                    <div className="performance-metrics">
                      <div className="metric-card">
                        <h3>Total Return</h3>
                        <div className="metric-value positive">+34.5%</div>
                        <p className="metric-period">Since inception</p>
                      </div>
                      <div className="metric-card">
                        <h3>Monthly Return</h3>
                        <div className="metric-value positive">+8.2%</div>
                        <p className="metric-period">Last 30 days</p>
                      </div>
                      <div className="metric-card">
                        <h3>Weekly Return</h3>
                        <div className="metric-value positive">+2.4%</div>
                        <p className="metric-period">Last 7 days</p>
                      </div>
                      <div className="metric-card">
                        <h3>Daily Return</h3>
                        <div className="metric-value positive">+0.3%</div>
                        <p className="metric-period">Last 24 hours</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "operations" && (
                  <div className="operations-tab">
                    <h3>Agent Operations History</h3>
                    <div className="operations-table-container">
                      <table className="operations-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Timestamp</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dummyOperations.map((op) => (
                            <tr key={op.id}>
                              <td>{op.type}</td>
                              <td>{op.timestamp}</td>
                              <td className="status-cell">{op.status}</td>
                              <td>{op.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="settings-tab">
                    <h3>Agent Settings</h3>
                    <div className="settings-form">
                      <div className="form-group">
                        <label>Rebalance Frequency</label>
                        <select defaultValue="12">
                          <option value="4">4 times per day</option>
                          <option value="8">8 times per day</option>
                          <option value="12">12 times per day</option>
                          <option value="24">24 times per day</option>
                        </select>
                        <p className="form-help">How often the agent will rebalance your positions</p>
                      </div>

                      <div className="form-group">
                        <label>Risk Tolerance</label>
                        <select defaultValue="medium">
                          <option value="low">Low Risk</option>
                          <option value="medium">Medium Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                        <p className="form-help">Determines the agent's trading strategy aggressiveness</p>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span>Auto-compound rewards</span>
                        </label>
                        <p className="form-help">Automatically reinvest earned rewards</p>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span>Enable notifications</span>
                        </label>
                        <p className="form-help">Receive notifications about agent activities</p>
                      </div>

                      <div className="form-actions">
                        <button className="gradient-button">Save Settings</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AgentCommission

