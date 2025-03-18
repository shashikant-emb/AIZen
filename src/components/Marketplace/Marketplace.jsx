"use client"

import  React from "react"
import { useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import StatsCards from "../StatsCards/StatsCards"
import Filters from "../Filters/Filters"
import AgentList from "../AgentList/AgentList"
import { dummyData } from "../../data/dummyData"
import "./Marketplace.css"

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All Strategies")
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("All Levels")
  const [selectedSort, setSelectedSort] = useState("AUM (High to Low)")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("7 Days")
  const [selectedTags, setSelectedTags] = useState(["All"])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleStrategyChange = (strategy) => {
    setSelectedStrategy(strategy)
  }

  const handleRiskLevelChange = (riskLevel) => {
    setSelectedRiskLevel(riskLevel)
  }

  const handleSortChange = (sort) => {
    setSelectedSort(sort)
  }

  const handleTimePeriodChange = (timePeriod) => {
    setSelectedTimePeriod(timePeriod)
  }

  const handleTagClick = (tag) => {
    if (tag === "All") {
      setSelectedTags(["All"])
    } else {
      const newSelectedTags = selectedTags.includes("All")
        ? [tag]
        : selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag]

      if (newSelectedTags.length === 0) {
        setSelectedTags(["All"])
      } else {
        setSelectedTags(newSelectedTags)
      }
    }
  }

  // Filter agents based on selected filters
  // In a real app, this would be handled by the API
  const filteredAgents = dummyData.agents

  return (
    <div className="marketplace">
      <h1 className="marketplace-title">Agent Marketplace</h1>

      <SearchBar onSearch={handleSearch} />

      <StatsCards stats={dummyData.stats} />

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

      <AgentList agents={filteredAgents} />
    </div>
  )
}

export default Marketplace

