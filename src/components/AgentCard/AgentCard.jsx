import  React from "react"
import "./AgentCard.css"



const AgentCard = ({ agent }) => {
  const getPerformanceClass = (performance) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "positive"
    if (value < 0) return "negative"
    return ""
  }

  return (
    <div className="agent-card">
      {agent.trending && <div className="trending-badge">Trending</div>}

      <div className="agent-image">
        <img src="/placeholder.svg?height=160&width=400" alt={agent.name} />
      </div>

      <div className="agent-header">
        <h3 className="agent-name">{agent.name}</h3>
        <div className={`agent-performance ${getPerformanceClass(agent.performance)}`}>{agent.performance}</div>
      </div>

      <p className="agent-description">{agent.description}</p>

      <div className="agent-tags">
        {agent.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="agent-metrics">
        <div className="metric-group">
          <div className="metric">
            <h4>{agent.aum}</h4>
            <p>AUM</p>
          </div>
          <div className="metric">
            <h4>{agent.il}</h4>
            <p>IL</p>
          </div>
        </div>

        <div className="metric-group">
          <div className="metric">
            <h4>{agent.dailyRebalance}</h4>
            <p>Daily Rebalance</p>
          </div>
          <div className="metric">
            <h4>{agent.weeklyReward}</h4>
            <p>Weekly Reward</p>
          </div>
        </div>
      </div>

      <button className="commission-button gradient-button">Commission Agent</button>
    </div>
  )
}

export default AgentCard

