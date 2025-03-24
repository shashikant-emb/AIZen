"use client"

import  React from "react"
import { useEffect } from "react"
import SearchBar from "../../components/SearchBar/SearchBar"
import StatsCards from "../../components/StatsCards/StatsCards"
import Filters from "../../components/Filters/Filters"
import AgentList from "../../components/AgentList/AgentList"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import "./Marketplace.css"

const Marketplace: React.FC = () => {
  const { marketplace } = useReduxActions()
  const { marketplace: marketplaceSelectors } = useReduxSelectors()
  const {
    agents,
    filteredAgents,
    stats,
    filters: { searchQuery, selectedStrategy, selectedRiskLevel, selectedSort, selectedTimePeriod, selectedTags },
    loading,
  } = marketplaceSelectors
  console.log("agents",agents)
  console.log("filteredAgents",filteredAgents)

  useEffect(() => {
    // Fetch agents and stats when component mounts
    marketplace.fetchAgents()
    // marketplace.fetchStats()
  }, [])
  console.log("loading",loading)

  const handleSearch = (query: string) => {
    marketplace.setSearchQuery(query)
  }

  const handleStrategyChange = (strategy: string) => {
    marketplace.setSelectedStrategy(strategy)
  }

  const handleRiskLevelChange = (riskLevel: string) => {
    marketplace.setSelectedRiskLevel(riskLevel)
  }

  const handleSortChange = (sort: string) => {
    marketplace.setSelectedSort(sort)
  }

  const handleTimePeriodChange = (timePeriod: string) => {
    marketplace.setSelectedTimePeriod(timePeriod)
  }

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      marketplace.setSelectedTags(["All"])
    } else {
      const newSelectedTags = selectedTags.includes("All")
        ? [tag]
        : selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag]

      if (newSelectedTags.length === 0) {
        marketplace.setSelectedTags(["All"])
      } else {
        marketplace.setSelectedTags(newSelectedTags)
      }
    }
  }

  return (
    <div className="marketplace">
      <h1 className="marketplace-title">Agent Marketplace</h1>

      <SearchBar onSearch={handleSearch} />

      <StatsCards stats={stats} />

      <Filters
        selectedStrategy={selectedStrategy}
        selectedRiskLevel={selectedRiskLevel}
        selectedSort={selectedSort}
        selectedTimePeriod={selectedTimePeriod}
        selectedTags={selectedTags}
        onStrategyChange={handleStrategyChange}
        onRiskLevelChange={handleRiskLevelChange}
        onSortChange={handleSortChange}
        onTimePeriodChange={handleTimePeriodChange}
        onTagClick={handleTagClick}
      />

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
        </div>
      ) : (
        // <AgentList agents={filteredAgents} onCommission={(agentId) => marketplace.commissionAgent(agentId)} />
        <AgentList agents={filteredAgents} />
      )}
    </div>
  )
}

export default Marketplace


