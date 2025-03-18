"use client"

import  React from "react"
import "./Filters.css"

// interface FiltersProps {
//   selectedStrategy: string
//   selectedRiskLevel: string
//   selectedSort: string
//   selectedTimePeriod: string
//   selectedTags: string[]
//   onStrategyChange: (strategy: string) => void
//   onRiskLevelChange: (riskLevel: string) => void
//   onSortChange: (sort: string) => void
//   onTimePeriodChange: (timePeriod: string) => void
//   onTagClick: (tag: string) => void
// }

const Filters = ({
  selectedStrategy,
  selectedRiskLevel,
  selectedSort,
  selectedTimePeriod,
  selectedTags,
  onStrategyChange,
  onRiskLevelChange,
  onSortChange,
  onTimePeriodChange,
  onTagClick,
}) => {
  const tags = [
    "All",
    "DeFi",
    "Uniswap",
    "PancakeSwap",
    "Ethereum",
    "Arbitrum",
    "Base",
    "Solana",
    "AMM",
    "Delta Neutral",
    "High Yield",
    "Low IL",
  ]

  return (
    <div className="filters">
      <div className="filter-dropdowns">
        <div className="filter-group">
          <label>Strategy Type:</label>
          <select value={selectedStrategy} onChange={(e) => onStrategyChange(e.target.value)}>
            <option value="All Strategies">All Strategies</option>
            <option value="Momentum">Momentum</option>
            <option value="Grid">Grid</option>
            <option value="Delta Neutral">Delta Neutral</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Risk Level:</label>
          <select value={selectedRiskLevel} onChange={(e) => onRiskLevelChange(e.target.value)}>
            <option value="All Levels">All Levels</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Medium Risk">Medium Risk</option>
            <option value="High Risk">High Risk</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={selectedSort} onChange={(e) => onSortChange(e.target.value)}>
            <option value="AUM (High to Low)">AUM (High to Low)</option>
            <option value="AUM (Low to High)">AUM (Low to High)</option>
            <option value="Weekly Return">Weekly Return</option>
            <option value="IL">IL</option>
          </select>
        </div>
        <div className="filter-group">
        <label>Time Period:</label>
        <select value={selectedTimePeriod} onChange={(e) => onTimePeriodChange(e.target.value)}>
          <option value="7 Days">7 Days</option>
          <option value="30 Days">30 Days</option>
          <option value="90 Days">90 Days</option>
          <option value="All Time">All Time</option>
        </select>
      </div>
      </div>

      
      

      <div className="filter-tags">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Filters

