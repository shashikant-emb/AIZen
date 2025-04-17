"use client"

import  React from "react"

import { useState } from "react"
import ResponsiveTable, { type TableColumn } from "./ResponsiveTable"
import type { HistoryItem } from "../../store/slices/historySlice"
import "./HistoryTable.css"

interface HistoryTableProps {
  data: HistoryItem[]
  onViewDetails: (id: string) => void
  onToggleStatus: (id: string) => void
  loading?: boolean
  emptyMessage?: string
}

interface AgentHistoryEvent {
  event: string
  timestamp: string
}

const mockAgentHistory: Record<string, AgentHistoryEvent[]> = {
  "h-1": [
    { event: "Agent deployed", timestamp: "2025-03-17 10:20:15" },
    { event: "Rebalancing started", timestamp: "2025-03-17 12:30:22" },
    { event: "Position adjusted", timestamp: "2025-03-17 13:45:10" },
    { event: "Execution completed", timestamp: "2025-03-17 14:32:15" },
  ],
  "h-3": [
    { event: "Agent deployed", timestamp: "2025-03-17 05:30:11" },
    { event: "Rebalancing started", timestamp: "2025-03-17 06:15:22" },
    { event: "Error detected: Insufficient liquidity", timestamp: "2025-03-17 07:40:18" },
    { event: "Execution failed", timestamp: "2025-03-17 08:05:11" },
  ],
  "h-5": [
    { event: "Agent deployed", timestamp: "2025-03-16 10:20:45" },
    { event: "Rebalancing started", timestamp: "2025-03-16 12:30:22" },
    { event: "Position adjusted", timestamp: "2025-03-16 15:45:10" },
    { event: "Execution completed", timestamp: "2025-03-16 18:20:45" },
  ],
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  data,
  onViewDetails,
  onToggleStatus,
  loading = false,
  emptyMessage = "No history items found matching your criteria.",
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
    onViewDetails(id)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "status-completed"
      case "Failed":
        return "status-failed"
      case "In Progress":
        return "status-in-progress"
      default:
        return ""
    }
  }

  const getPerformanceClass = (performance: string) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "performance-positive"
    if (value < 0) return "performance-negative"
    return ""
  }

  const columns: TableColumn<HistoryItem>[] = [
    {
      header: "Agent Name",
      accessor: "agentName",
      className: "agent-name",
      minWidth: "150px",
    },
    {
      header: "Type",
      accessor: "agentType",
      minWidth: "120px",
    },
    {
      header: "Timestamp",
      accessor: "timestamp",
      minWidth: "180px",
    },
    {
      header: "Duration",
      accessor: "duration",
      minWidth: "100px",
    },
    {
      header: "Status",
      accessor: (item:any) => <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>,
      minWidth: "120px",
    },
    {
      header: "Performance",
      accessor: (item:any) => <span className={getPerformanceClass(item.performance)}>{item.performance}</span>,
      minWidth: "120px",
    },
  ]

  const renderActions = (item: HistoryItem) => (
    <div className="table-actions">
      <button
        className={`action-button view-button ${expandedRow === item.id ? "active" : ""}`}
        onClick={() => toggleExpandRow(item.id)}
        title="View Details"
      >
        <span className="action-icon">👁️</span>
      </button>
      <button
        className="action-button toggle-button"
        onClick={() => onToggleStatus(item.id)}
        title={item.status === "Deployed" ? "Stop Agent" : "Deploy Agent"}
      >
        <span className="action-icon">{item.status === "Deployed" || item.status === "In Progress" ? "⏸️" : "▶️"}</span>
      </button>
    </div>
  )

  const renderExpandedContent = (item: HistoryItem) => {
    const agentHistory = mockAgentHistory[item.id] || []

    return (
      <div className="history-details">
        <h3>Agent Activity History</h3>
        {agentHistory.length > 0 ? (
          <table className="history-details-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {agentHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.event}</td>
                  <td>{history.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-history-message">No detailed history available for this agent.</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading history data...</p>
      </div>
    )
  }

  return (
    <ResponsiveTable
      data={data}
      columns={columns}
      keyField="id"
      actions={renderActions}
      expandableContent={renderExpandedContent}
      emptyMessage={emptyMessage}
      className="history-responsive-table"
    />
  )
}

export default HistoryTable

