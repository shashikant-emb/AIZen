// "use client"
// import  React, { useEffect } from "react"
// import { useState } from "react"
// import "./History.css"
// // import { historyData } from "../../data/historyData"
// import Sidebar from "../../components/SideBar/SideBar"
// import SearchBar from "../../components/SearchBar/SearchBar"
// import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
// import { useToast } from "../../components/Toast/Toast"

// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
// } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { Eye, Pause, Play } from "lucide-react"

// const History: React.FC = () => {

//     const { history } = useReduxActions()
//     const { history: historySelectors } = useReduxSelectors()
//     const { showToast } = useToast()
//     const { myAgents } = useReduxActions()
//     const { auth: authSelectors } = useReduxSelectors()
//     const { isAuthenticated,userProfile } = authSelectors
  
//     const {
//       filteredItems,
//       stats,
//     //   filters: { searchQuery, selectedPeriod, selectedStatus },
//       loading,
//       error,
//     } = historySelectors
  
//     useEffect(() => {
//       // Fetch history data when component mounts
//       history.fetchHistoryItems()
//     }, [])
  
//     // useEffect(() => {
//     //   // Show error toast if there's an error
//     //   if (error) {
//     //     showToast(error, "error")
//     //   }
//     // }, [error, showToast])

//   const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days")
//   const [selectedStatus, setSelectedStatus] = useState("All")
//   const [searchQuery, setSearchQuery] = useState("")

//   const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedPeriod(e.target.value)
//   }

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedStatus(e.target.value)
//   }

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value)
//   }

//   // Filter history items based on selected filters and search query
//   const filteredHistory = filteredItems.filter((item) => {
//     const matchesSearch =
//       item.agentName.toLowerCase().includes(searchQuery.toLowerCase()) 
//       // ||
//       // item.agentType.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesStatus = selectedStatus === "All" || item.status === selectedStatus

//     // For simplicity, we're not implementing actual date filtering
//     // In a real app, you would filter based on actual dates
//     return matchesSearch && matchesStatus
//   })

//   const getStatusClass = (status:string) => {
//     switch (status) {
//       case "Deployed":
//         return "status-completed"
//       case "Failed":
//         return "status-failed"
//       case "In Progress":
//         return "status-in-progress"
//       case "Draft":
//         return "status-in-progress"
//       default:
//         return ""
//     }
//   }

//   const getPerformanceClass = (performance:string) => {
//     const value = Number.parseFloat(performance)
//     if (value > 0) return "performance-positive"
//     if (value < 0) return "performance-negative"
//     return ""
//   }
//   const [expandedRow, setExpandedRow] = useState(null);
//   const toggleExpandRow = (id:any) => {
//     setExpandedRow(expandedRow === id ? null : id);
//   };

// const toggleAgentStatus = (id: any, status: any) => {
//   const agentId = id?.split("-")[1];
//   const currentStatus = status === "Deployed";

//   if (!agentId) {
//     showToast("Invalid agent ID", "error");
//     return;
//   }

//   const payload = {
//     user_id: userProfile?.id,
//     agent_id: agentId,
//     is_deployed: !currentStatus, // toggle the deployment status
//   };


//   myAgents.updateMyAgent(payload).then((res) => {
//     if (res?.payload?.status_code === 200) {
//       showToast("Agent status updated!", "success");
//       history.fetchHistoryItems();
//     } else {
//       showToast("Something went wrong!", "error");
//     }
//   }).catch((error) => {
//     console.error("Update failed", error);
//     showToast("Request failed!", "error");
//   });
// };

//   const [isMediumScreen, setIsMediumScreen] = useState(
//     window.innerWidth < 782
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMediumScreen(window.innerWidth < 782);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return (
//     <>
//       <Sidebar />
//       {/* <div className="main-content"> */}
//       <div className="history-page">
//         <div className="history-header">
//           <h1>Agent History</h1>
//           {/* <p>Is Medium Screen: {isMediumScreen ? "Yes" : "No"}</p> */}
//         </div>

//         <div className="history-summary">
//           <div className="stat-card">
//             <h2>{filteredItems.length}</h2>
//             <p>Total Executions</p>
//           </div>
//           <div className="stat-card">
//             <h2>
//               {
//                 filteredItems.filter((item) => item.status === "Completed")
//                   .length
//               }
//             </h2>
//             <p>Completed</p>
//           </div>
//           <div className="stat-card">
//             <h2>
//               {filteredItems.filter((item) => item.status === "Failed").length}
//             </h2>
//             <p>Failed</p>
//           </div>
//         </div>

//         <div className="history-filters">
//           <div className="search-filter">
//             <input
//               type="text"
//               placeholder="Search by agent name or type..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//           {/* <SearchBar onSearch={handleSearchChange} /> */}

//           <div className="filter-group">
//             <label>Time Period:</label>
//             <select value={selectedPeriod} onChange={handlePeriodChange}>
//               <option value="Last 24 Hours">Last 24 Hours</option>
//               <option value="Last 7 Days">Last 7 Days</option>
//               <option value="Last 30 Days">Last 30 Days</option>
//               <option value="All Time">All Time</option>
//             </select>
//           </div>

//           <div className="filter-group">
//             <label>Status:</label>
//             <select value={selectedStatus} onChange={handleStatusChange}>
//               <option value="All">All</option>
//               <option value="Deployed">Deployed</option>
//               <option value="Draft">Draft</option>
//               <option value="In Progress">In Progress</option>
//             </select>
//           </div>
//         </div>

//         <div className="history-table-container">
//           {!isMediumScreen ? (
//             <table className="history-table">
//               <thead>
//                 <tr>
//                   <th>Agent Name</th>
//                   <th>Type</th>
//                   <th>Timestamp</th>
//                   <th>Duration</th>
//                   <th>Status</th>
//                   <th>Performance</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredHistory.map((item) => (
//                   <React.Fragment key={item.id}>
//                     <tr>
//                       <td className="agent-name">{item.agentName}</td>
//                       <td>{item.agentType||"NA"}</td>
//                       <td>
//                         {item.timestamp
//                           ? new Date(item.timestamp).toLocaleString("en-GB", {
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: false,
//                             })
//                           : "NA"}
//                       </td>
//                       <td>{item.duration}</td>
//                       <td>
//                         <span
//                           className={`status-badge ${getStatusClass(
//                             item.status
//                           )}`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className={getPerformanceClass(item.performance)}>
//                         {item.performance||"NA"}
//                       </td>
//                       <td>
//                         <div className="table-actions">
//                           <button
//                             onClick={() =>
//                               toggleExpandRow(item.id, item.status)
//                             }
//                             className="action-icon view-icon"
//                           >
//                             <Eye size={18} className="icon-eye" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               toggleAgentStatus(item.id, item.status)
//                             }
//                             className="action-icon download-icon"
//                           >
//                             {/* {item.status === "Deployed" ? "⏸️" : "▶️"} */}
//                             {item.status === "Deployed" ? (
//                               <Pause size={18} className="icon-pause" />
//                             ) : (
//                               <Play size={18} className="icon-play" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedRow === item.id && (
//                       <tr className="expanded-row">
//                         <td colSpan="6">
//                           <div className="history-details">
//                             {item.agentHistory &&
//                             item.agentHistory.length > 0 ? (
//                               <table className="w-full text-left border border-gray-200 rounded-md">
//                                 <thead>
//                                   <tr className="bg-gray-200">
//                                     <th className="p-2">Event</th>
//                                     <th className="p-2">Timestamp</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {item.agentHistory.map((history, index) => (
//                                     <tr key={index} className="border-t">
//                                       <td className="p-2">{history.event}</td>
//                                       <td className="p-2">
//                                         {history.timestamp}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             ) : (
//                               <p className="text-gray-500">
//                                 No history available
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <Table className="w-full text-left border border-gray-200 rounded-md bg-gray-800 text-white">
//               <Thead className="bg-gray-700 text-gray-200">
//                 <Tr>
//                   <Th className="p-3 border border-gray-600">Agent</Th>
//                   <Th className="p-3 border border-gray-600">Type</Th>
//                   <Th className="p-3 border border-gray-600">Timestamp</Th>
//                   <Th className="p-3 border border-gray-600">Duration</Th>
//                   <Th className="p-3 border border-gray-600">Status</Th>
//                   <Th className="p-3 border border-gray-600">Performance</Th>
//                   <Th className="p-3 border border-gray-600">Actions</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {filteredHistory.map((item) => (
//                   <React.Fragment key={item.id}>
//                     <Tr className="border-t border-gray-600 even:bg-gray-900 hover:bg-gray-700 transition">
//                       <Td className="p-3 font-semibold">{item.agentName}</Td>
//                       <Td className="p-3">{item.agentType||"NA"}</Td>
//                       <Td className="p-3">{item.timestamp
//                           ? new Date(item.timestamp).toLocaleString("en-GB", {
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: false,
//                             })
//                           : "NA"}</Td>
//                       <Td className="p-3">{item.duration}</Td>
//                       <Td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded text-sm font-medium ${getStatusClass(
//                             item.status
//                           )}`}
//                         >
//                           {item.status}
//                         </span>
//                       </Td>
//                       <Td
//                         className={`p-3 font-semibold ${getPerformanceClass(
//                           item.performance
//                         )}`}
//                       >
//                         {item.performance ||"NA"}
//                       </Td>
//                       <Td className="p-3">
//                       <div className="table-actions">
//                           <button
//                             onClick={() =>
//                               toggleExpandRow(item.id, item.status)
//                             }
//                             className="action-icon view-icon"
//                           >
//                             <Eye size={18} className="icon-eye" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               toggleAgentStatus(item.id, item.status)
//                             }
//                             className="action-icon download-icon"
//                           >
//                             {/* {item.status === "Deployed" ? "⏸️" : "▶️"} */}
//                             {item.status === "Deployed" ? (
//                               <Pause size={18} className="icon-pause" />
//                             ) : (
//                               <Play size={18} className="icon-play" />
//                             )}
//                           </button>
//                         </div>
//                       </Td>
//                     </Tr>
//                     {expandedRow === item.id && (
//                       <Tr className="expanded-row">
//                         <Td colSpan="7" className="p-4">
//                           <div className="history-details bg-gray-900 p-4 rounded-md">
//                             {item.agentHistory &&
//                             item.agentHistory.length > 0 ? (
//                               <Table className="w-full text-left border border-gray-700 rounded-md">
//                                 <Thead>
//                                   <Tr className="bg-gray-700">
//                                     <Th className="p-3 border border-gray-600">
//                                       Event
//                                     </Th>
//                                     <Th className="p-3 border border-gray-600">
//                                       Timestamp
//                                     </Th>
//                                   </Tr>
//                                 </Thead>
//                                 <Tbody>
//                                   {item.agentHistory.map((history, index) => (
//                                     <Tr
//                                       key={index}
//                                       className="border-t border-gray-600 even:bg-gray-800"
//                                     >
//                                       <Td className="p-3">{history.event}</Td>
//                                       <Td className="p-3">
//                                         {history.timestamp}
//                                       </Td>
//                                     </Tr>
//                                   ))}
//                                 </Tbody>
//                               </Table>
//                             ) : (
//                               <p className="text-gray-400 italic">
//                                 No history available
//                               </p>
//                             )}
//                           </div>
//                         </Td>
//                       </Tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </Tbody>
//             </Table>
//           )}
//           {filteredHistory.length === 0 && (
//             <div className="no-results">
//               <p>No history items found matching your criteria.</p>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* </div> */}
//     </>
//   );
// }
// export default History



"use client"
import  React, { useEffect } from "react"
import { useState } from "react"
import "./History.css"
// import { historyData } from "../../data/historyData"
import Sidebar from "../../components/SideBar/SideBar"
import SearchBar from "../../components/SearchBar/SearchBar"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import { useToast } from "../../components/Toast/Toast"

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Eye, Pause, Play } from "lucide-react"

const History: React.FC = () => {

    const { history } = useReduxActions()
    const { history: historySelectors } = useReduxSelectors()
    const { showToast } = useToast()
    const { myAgents } = useReduxActions()
    const { auth: authSelectors } = useReduxSelectors()
    const { isAuthenticated,userProfile } = authSelectors
  
    const {
      filteredItems,
      stats,
    //   filters: { searchQuery, selectedPeriod, selectedStatus },
      loading,
      error,
    } = historySelectors
  
    useEffect(() => {
      // Fetch history data when component mounts
      history.fetchHistoryItems()
    }, [])
  

  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Filter history items based on selected filters and search query
  const filteredHistory = filteredItems.filter((item) => {
    const matchesSearch =
      item?.agentName?.toLowerCase().includes(searchQuery.toLowerCase()) 
      // item?.agentName?.includes(searchQuery.toLowerCase()) 
      // ||
      // item.agentType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus

    // For simplicity, we're not implementing actual date filtering
    // In a real app, you would filter based on actual dates
    return matchesSearch && matchesStatus
  })

  const getStatusClass = (status:string) => {
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

  const getPerformanceClass = (performance:string) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "performance-positive"
    if (value < 0) return "performance-negative"
    return ""
  }
  const [expandedRow, setExpandedRow] = useState(null);
  const toggleExpandRow = (id:any) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

const toggleAgentStatus = (id: any, status: any) => {
  console.log("skfrf");
  
  // const agentId = id?.split("-")[1];
  const agentId = id;
  const currentStatus = status === "Deployed";

  if (!agentId) {
    showToast("Invalid agent ID", "error");
    return;
  }

  const payload = {
    user_id: userProfile?.id,
    agent_id: agentId,
    is_deployed: !currentStatus, // toggle the deployment status
  };


  myAgents.updateMyAgent(payload).then((res) => {
    if (res?.payload?.status_code === 200) {
      showToast("Agent status updated!", "success");
      history.fetchHistoryItems();
    } else {
      showToast("Something went wrong!", "error");
    }
  }).catch((error) => {
    console.error("Update failed", error);
    showToast("Request failed!", "error");
  });
};

  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth < 782
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth < 782);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {/* <Sidebar /> */}
      {/* <div className="main-content"> */}
      <div className="history-page">
        <div className="history-header">
          <h1>Agent History</h1>
          {/* <p>Is Medium Screen: {isMediumScreen ? "Yes" : "No"}</p> */}
        </div>

        <div className="history-summary">
          <div className="stat-card">
            <h2>{filteredItems.length}</h2>
            <p>Total Executions</p>
          </div>
          <div className="stat-card">
            <h2>
              {
                filteredItems.filter((item) => item.status === "Completed")
                  .length
              }
            </h2>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h2>
              {filteredItems.filter((item) => item.status === "Failed").length}
            </h2>
            <p>Failed</p>
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
          {/* <SearchBar onSearch={handleSearchChange} /> */}

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
              <option value="Deployed">Deployed</option>
              <option value="Draft">Draft</option>
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
                    <tr>
                      <td className="agent-name">{item.agentName}</td>
                      <td>{item.agentType ||"NA"}</td>
                      <td>
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                          : "NA"}
                      </td>
                      <td>{item.duration}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className={getPerformanceClass(item.performance)}>
                        {item.performance ||"NA"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() =>
                              toggleExpandRow(item.id, item.status)
                            }
                            className="action-icon view-icon"
                          >
                            <Eye size={18} className="icon-eye" />
                          </button>
                          <button
                            onClick={() =>{
                              toggleAgentStatus(item.id, item.status)
                              console.log("skfrf");
                            }}
                            className="action-icon download-icon"
                          >
                            {/* {item.status === "Deployed" ? "⏸️" : "▶️"} */}
                            {item.status === "Deployed" ? (
                              <Pause size={18} className="icon-pause" />
                            ) : (
                              <Play size={18} className="icon-play" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === item.id && (
                      <tr className="expanded-row">
                        <td colSpan="6">
                          <div className="history-details">
                            {item.agentHistory &&
                            item.agentHistory.length > 0 ? (
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
                                      <td className="p-2">
                                        {history.timestamp}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-500">
                                No history available
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
  
          
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
export default History

