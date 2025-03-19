"use client"

import  React from "react"
import { useState } from "react"
import "./SearchBar.css"

const SearchBar= ({ onSearch }) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }
  const clearSearch = () => {
    setQuery("");
    onSearch(""); // Reset search results
  };

  return (
    <div className={`search-bar ${isFocused ? "focused" : ""}`}>
      <div className="search-icon">□</div>
      <input
        type="text"
        placeholder="Search for trading agents by name, strategy, or tags..."
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
       {query && <button className="clear-button" onClick={clearSearch}>✖</button>}
    </div>
  )
}

export default SearchBar

