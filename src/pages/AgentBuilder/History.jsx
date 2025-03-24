// import React from 'react'
// import Sidebar from '../../components/SideBar/SideBar'

// const History = () => {
//   return (
//     <>
//     <Sidebar />
//     <div className="main-content">
//       <h1 className="placeholder-content">History</h1>
//     </div>
//     </>
//   )
// }

// export default History

"use client"
import  React from "react"
import { useState } from "react"
import "./History.css"
import { historyData } from "../../data/historyData"
import Sidebar from "../../components/SideBar/SideBar"

const History= () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value)
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Filter history items based on selected filters and search query
  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agentType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus

    // For simplicity, we're not implementing actual date filtering
    // In a real app, you would filter based on actual dates
    return matchesSearch && matchesStatus
  })

  const getStatusClass = (status) => {
    switch (status) {
      case "Deployed":
        return "status-completed"
      case "Failed":
        return "status-failed"
      case "In Progress":
        return "status-in-progress"
      case "Draft":
        return "status-in-progress"
      default:
        return ""
    }
  }

  const getPerformanceClass = (performance) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "performance-positive"
    if (value < 0) return "performance-negative"
    return ""
  }
  const [expandedRow, setExpandedRow] = useState(null);
  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleAgentStatus = (id) => {
    console.log(`Toggling status for agent ID: ${id}`);
    alert("agent Status Updated")
  };
  return (
    <>
    <Sidebar />
    {/* <div className="main-content"> */}
    <div className="history-page">
      <div className="history-header">
        <h1>Agent History</h1>
        <div className="history-summary">
          <div className="summary-item">
            <span className="summary-value">{historyData.length}</span>
            <span className="summary-label">Total Executions</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{historyData.filter((item) => item.status === "Completed").length}</span>
            <span className="summary-label">Completed</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{historyData.filter((item) => item.status === "Failed").length}</span>
            <span className="summary-label">Failed</span>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by agent name or type..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-group">
          <label>Time Period:</label>
          <select value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="All Time">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            
            <tr>
              <th>Agent Name</th>
              <th>Type</th>
              <th>Timestamp</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
                <React.Fragment key={item.id}>
              <tr >
                <td className="agent-name">{item.agentName}</td>
                <td>{item.agentType}</td>
                <td>{item.timestamp}</td>
                <td>{item.duration}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                </td>
                <td className={getPerformanceClass(item.performance)}>{item.performance}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => toggleExpandRow(item.id)} className="action-icon view-icon">👁️</button>
                    <button onClick={() => toggleAgentStatus(item.id)} className="action-icon download-icon">{item.status === "Deployed" ? "⏸️" : "▶️"}</button>
                  </div>
                </td>
              </tr>
              {expandedRow === item.id &&  (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="history-details">
                        { item.agentHistory && item.agentHistory.length > 0  ? (
                        <table className="w-full text-left border border-gray-200 rounded-md">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="p-2">Event</th>
                              <th className="p-2">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.agentHistory.map((history, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">{history.event}</td>
                                <td className="p-2">{history.timestamp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500">No history available</p>
                      )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="no-results">
            <p>No history items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
    {/* </div> */}
    </>
  )
}
export default History
