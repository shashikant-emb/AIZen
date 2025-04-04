import  React from "react"
import "./StatsCards.css"


const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <h2>{stats.totalAgents}</h2>
        <p>Total Agents</p>
      </div>
      <div className="stat-card">
        <h2>{stats.deployedAgents}</h2>
        <p>DeployedAgents</p>
      </div>

      <div className="stat-card">
        <h2>{stats.totalAUM}</h2>
        <p>Total AUM</p>
      </div>

      {/* <div className="stat-card">
        <h2>{stats.weeklyReturn}</h2>
        <p>Avg. Weekly Return</p>
      </div> */}

      <div className="stat-card">
        <h2>{stats.avgPerformance}</h2>
        <p>Avg. IL</p>
      </div>
    </div>
  )
}

export default StatsCards

