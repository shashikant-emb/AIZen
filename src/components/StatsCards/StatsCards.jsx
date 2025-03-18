import  React from "react"
import "./StatsCards.css"


const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <h2>{stats.activeAgents}</h2>
        <p>Active Agents</p>
      </div>

      <div className="stat-card">
        <h2>{stats.totalAUM}</h2>
        <p>Total AUM</p>
      </div>

      <div className="stat-card">
        <h2>{stats.weeklyReturn}</h2>
        <p>Avg. Weekly Return</p>
      </div>

      <div className="stat-card">
        <h2>{stats.avgIL}</h2>
        <p>Avg. IL</p>
      </div>
    </div>
  )
}

export default StatsCards

