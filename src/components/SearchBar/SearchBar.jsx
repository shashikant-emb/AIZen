"use client"

import  React from "react"
import { useState } from "react"
import "./SearchBar.css"

const SearchBar= ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div className="search-bar">
      <div className="search-icon">□</div>
      <input
        type="text"
        placeholder="Search for trading agents by name, strategy, or tags..."
        value={query}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchBar

