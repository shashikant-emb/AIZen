// import React from 'react'
// import Sidebar from '../../components/SideBar/SideBar'

// const MyAgents = () => {
//   return (
//     <>
//     <Sidebar />
//     <div className="main-content">
//       <h1 className="placeholder-content">My agents</h1>
//     </div>
//     </>
//   )
// }

// export default MyAgents

import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import React, { useEffect, useState } from 'react';
// import SearchBar from '../SearchBar/SearchBar';
// import AgentCard from '../AgentCard/AgentCard';
// import { myAgentsData } from '../../data/myAgentsData';
import './MyAgents.css';
import { myAgentsData } from '../../data/myAgentsData';
import SearchBar from '../../components/SearchBar/SearchBar';
import AgentCard from '../../components/AgentCard/AgentCard';
import Sidebar from '../../components/SideBar/SideBar';
import { Link, useLocation, useNavigate} from "react-router-dom"
import { Agent } from "../../types";
import { useToast } from "../../components/Toast/Toast";

const MyAgents:React.FC = () => {
  const {showToast}= useToast()
const { myAgents } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, error,userProfile } = authSelectors
  const { myAgents: myAgentsSelectors } = useReduxSelectors()
  useEffect(() => {
    if(userProfile?.id){
      myAgents.fetchMyAgents(userProfile?.id);
    }
  }, []);
  
    const {
        agents:myAgentsData,
        // filteredAgents,
        stats,
        // filters: { searchQuery, selectedStrategy, selectedRiskLevel, selectedSort, selectedTimePeriod, selectedTags },
        loading,
      } = myAgentsSelectors 
    
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Agents');
  const [selectedSort, setSelectedSort] = useState('Date Created (Newest)');
  const navigate = useNavigate();
  const handleSearch = (query:string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
  };
  const handleViewDetails = (agent:any) => {
    navigate(`/agent-details/${agent.id}`)
  }

  // Filter agents based on search query and selected filter
  const filteredAgents = myAgentsData.filter((agent:Agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.tags.some((tag:string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'All Agents') {
      return matchesSearch;
    } else if (selectedFilter === 'Deployed') {
      return matchesSearch && agent.status === 'Deployed';
    } else if (selectedFilter === 'Draft') {
      return matchesSearch && agent.status === 'Inactive';
    }
    return matchesSearch;
  });
  const handleEdit=(id:number,name:string)=>{
    // showToast(`Edit agent${id}`, "info");
navigate("/agent-builder", { state: { agentId: id,name: name} });
  }

  return (
    <>
    {/* <Sidebar /> */}
    {/* <div className="main-content"> */}
    <div className="my-agents">
      <div className="my-agents-header">
        <h1>My Agents</h1>
        <button  onClick={() => navigate("/agent-builder")} className="gradient-button create-agent-button">
          <span>+</span> Create New Agent
        </button>
      </div>

      <div className="my-agents-stats">
        <div className="stat-card">
          <h2>{stats.totalAgents}</h2>
          <p>Total Agents</p>
        </div>
        <div className="stat-card">
          <h2>{stats.deployedAgents}</h2>
          <p>Deployed</p>
        </div>
        <div className="stat-card">
          <h2>{stats.totalAUM}</h2>
          <p>Total AUM</p>
        </div>
        <div className="stat-card">
          <h2>{stats.avgPerformance}</h2>
          <p>Avg. Performance</p>
        </div>
      </div>

      <div className="my-agents-controls">
        <SearchBar onSearch={handleSearch} />
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={selectedFilter} onChange={handleFilterChange}>
              <option value="All Agents">All Agents</option>
              <option value="Deployed">Deployed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select value={selectedSort} onChange={handleSortChange}>
              <option value="Date Created (Newest)">Date Created (Newest)</option>
              <option value="Date Created (Oldest)">Date Created (Oldest)</option>
              <option value="Performance (High to Low)">Performance (High to Low)</option>
              <option value="AUM (High to Low)">AUM (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
         <div className="loading-container">
         <div className="loading-spinner"></div>
         <p>Loading agents...</p>
       </div>
     ) : 
      filteredAgents.length > 0 ? (
        <div className="my-agents-list">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="my-agent-card-container">
              <AgentCard agent={agent} showActions={false} handleViewDetails={handleViewDetails}/>
              <div className="agent-actions">
                <button onClick={()=>handleEdit(agent?.id,agent?.name)}  className="action-button edit-button">Edit</button>
                <button disabled={true} className="action-button">Delete</button>
                {agent.status === 'Deployed' ? (
                  <button disabled={true} className="action-button deploy-button">Deploy</button>
                ) : (
                  <button disabled={true} className="action-button stop-button">Stop</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-agents">
          <p>No agents found matching your criteria.</p>
        </div>
      )}
    </div>
    {/* </div> */}
    </>
  );
};

export default MyAgents;

