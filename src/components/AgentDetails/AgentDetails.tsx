"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { useToast } from "../Toast/Toast"
import AgentCard from "../AgentCard/AgentCard"
import "./AgentDetails.css"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

// Dummy data for the agent
const dummyAgent = {
  id: "my-1",
  name: "OrionBot",
  description: "Advanced algorithmic agent for DeFi liquidity optimization with minimal impermanent loss.",
  performance: "+18.2%",
  aum: "$450K",
  il: "1.2%",
  dailyRebalance: "6x",
  weeklyReward: "4.5%",
  tags: ["Liquidity", "Rebalancer", "Ethereum"],
  status: "Deployed",
  dateCreated: "2025-02-15",
}

// Dummy data for performance chart
const performanceData: ChartData<"line"> = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
  datasets: [
    {
      label: "Agent Performance",
      data: [1.2, 2.5, 3.8, 5.2, 7.1, 9.5, 12.8, 18.2],
      borderColor: "#8a56ff",
      backgroundColor: "rgba(138, 86, 255, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
}

// Dummy data for pool allocation chart
const allocationData: ChartData<"doughnut"> = {
  labels: ["ETH-USDC", "WBTC-ETH", "ARB-ETH", "OP-USDC", "MATIC-ETH"],
  datasets: [
    {
      data: [40, 25, 15, 10, 10],
      backgroundColor: [
        "rgba(138, 86, 255, 0.7)",
        "rgba(86, 204, 242, 0.7)",
        "rgba(0, 200, 83, 0.7)",
        "rgba(255, 193, 7, 0.7)",
        "rgba(255, 82, 82, 0.7)",
      ],
      borderWidth: 0,
    },
  ],
}

// Dummy data for transactions
const dummyTransactions = [
  { id: 1, type: "Rebalance", timestamp: "2025-03-18 14:32:15", pool: "ETH-USDC", amount: "+0.5 ETH", value: "$1,250" },
  {
    id: 2,
    type: "Fee Collection",
    timestamp: "2025-03-18 08:15:22",
    pool: "All Pools",
    amount: "0.08 ETH",
    value: "$200",
  },
  { id: 3, type: "Rebalance", timestamp: "2025-03-17 19:45:33", pool: "WBTC-ETH", amount: "-0.2 ETH", value: "$500" },
  { id: 4, type: "Rebalance", timestamp: "2025-03-17 12:10:05", pool: "ARB-ETH", amount: "+0.3 ETH", value: "$750" },
  {
    id: 5,
    type: "Fee Collection",
    timestamp: "2025-03-16 22:30:18",
    pool: "All Pools",
    amount: "0.06 ETH",
    value: "$150",
  },
]

// Chart options
const lineChartOptions: ChartOptions<"line"> = {
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

const doughnutChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#a0a0b0",
      },
    },
  },
}

const AgentDetails: React.FC = () => {
  const { myAgents } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, error,userProfile } = authSelectors
  const { agentId } = useParams<{ agentId: string }>()
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
      } catch (error) {
        showToast("Failed to load agent details", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchAgentDetails()
  }, [])

  const handleBackToMyAgents = () => {
    navigate("/my-agents")
  }

  const handleDeployAgent = () => {
    showToast("Agent deployment initiated", "info")

    // Simulate a successful deployment after 2 seconds
    setTimeout(() => {
      showToast("Agent deployed successfully!", "success")
    }, 2000)
  }

  const handleStopAgent = () => {
    showToast("Agent stopping initiated", "info")

    // Simulate a successful stop after 2 seconds
    setTimeout(() => {
      showToast("Agent stopped successfully!", "warning")
    }, 2000)
  }

  return (
    <div className="agent-details-page">
      <div className="details-header">
        <button className="back-button" onClick={handleBackToMyAgents}>
          ← Back to My Agents
        </button>
        <h1>Agent Details</h1>
        <div className="agent-actions">
          {agent?.is_deployed === "Deployed" ? (
            <button className="stop-button" onClick={handleStopAgent}>
              Stop Agent
            </button>
          ) : (
            <button className="deploy-button" onClick={handleDeployAgent}>
              Deploy Agent
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agent details...</p>
        </div>
      ) : (
        <>
          <div className="details-content">
            <div className="agent-details-sidebar">
              <AgentCard agent={agent} showActions={false} />

              <div className="agent-status-card">
                <h3>Agent Status</h3>
                <div className={`status-badge ${agent.is_deployed === "Deployed" ? "status-active" : "status-inactive"}`}>
                  {agent.is_deployed?"Deployed":"Drafted"}
                </div>
                <div className="status-details">
                  <div className="status-item">
                    <span className="status-label">Created:</span>
                    <span className="status-value">
                        {/* {agent?.created_date} */}
                        {new Intl.DateTimeFormat("en-CA").format(new Date(agent?.created_date))}
                        </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Last Activity:</span>
                    <span className="status-value">2025-03-18</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Health:</span>
                    <span className="status-value health-good">Good</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="agent-details-main">
              <div className="details-tabs">
                <button
                  className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab-button ${activeTab === "transactions" ? "active" : ""}`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transactions
                </button>
                {/* <button
                  className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button> */}
              </div>

              <div className="details-tab-content">
                {activeTab === "overview" && (
                  <div className="overview-tab">
                    <div className="overview-stats">
                      <div className="stat-card">
                        <h3>Total Return</h3>
                        <div className="stat-value positive">+18.2%</div>
                      </div>
                      <div className="stat-card">
                        <h3>Weekly Reward</h3>
                        <div className="stat-value positive">+4.5%</div>
                      </div>
                      <div className="stat-card">
                        <h3>Total Fees Earned</h3>
                        <div className="stat-value">0.85 ETH</div>
                      </div>
                      <div className="stat-card">
                        <h3>Impermanent Loss</h3>
                        <div className="stat-value">1.2%</div>
                      </div>
                    </div>

                    <div className="overview-charts">
                      <div className="chart-card">
                        <h3>Performance History</h3>
                        <div className="chart-wrapper">
                          <Line data={performanceData} options={lineChartOptions} />
                        </div>
                      </div>
                      <div className="chart-card">
                        <h3>Pool Allocation</h3>
                        <div className="chart-wrapper">
                          <Doughnut data={allocationData} options={doughnutChartOptions} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div className="transactions-tab">
                    <h3>Recent Transactions</h3>
                    <div className="transactions-table-container">
                      <table className="transactions-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Timestamp</th>
                            <th>Pool</th>
                            <th>Amount</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dummyTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td>{tx.type}</td>
                              <td>{tx.timestamp}</td>
                              <td>{tx.pool}</td>
                              <td>{tx.amount}</td>
                              <td>{tx.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="settings-tab">
                    <div className="settings-card">
                      <h3>Agent Configuration</h3>
                      <div className="settings-form">
                        <div className="form-group">
                          <label>Agent Name</label>
                          <input type="text" defaultValue={agent.name} />
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <textarea defaultValue={agent.description}></textarea>
                        </div>

                        <div className="form-group">
                          <label>Rebalance Frequency</label>
                          <select defaultValue="6">
                            <option value="4">4 times per day</option>
                            <option value="6">6 times per day</option>
                            <option value="12">12 times per day</option>
                            <option value="24">24 times per day</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Risk Profile</label>
                          <select defaultValue="medium">
                            <option value="low">Low Risk</option>
                            <option value="medium">Medium Risk</option>
                            <option value="high">High Risk</option>
                          </select>
                        </div>

                        <div className="form-group checkbox-group">
                          <label className="checkbox-label">
                            <input type="checkbox" defaultChecked />
                            <span>Auto-compound rewards</span>
                          </label>
                        </div>

                        <div className="form-actions">
                          <button className="save-button gradient-button">Save Changes</button>
                        </div>
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

export default AgentDetails

