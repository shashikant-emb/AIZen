import  React, { useState } from "react"
import "./AgentCard.css"
import { useNavigate } from "react-router-dom"
import { useToast } from "../Toast/Toast"
import CommissionModal from "../Modals/CommissionModal"
import { useBalance } from "wagmi"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import { fallbackImages } from "../../assets/constants/agentBuilderConstants"


const AgentCard = ({ agent,showActions,handleViewDetails }) => {
    const { auth: authSelectors } = useReduxSelectors()
    const { isAuthenticated, loading, error,walletBalance } = authSelectors 
    
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { marketplace } = useReduxActions()
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  
  const getPerformanceClass = (performance) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "positive"
    if (value < 0) return "negative"
    return ""
  }

     const backendWallet = localStorage.getItem("wallet_address") as `0x${string}`;
     const [savedWalletBalance,setSavedWalletBalance]=useState(walletBalance)
    //  const { data: savedBalance, refetch: refetchSavedBalance } = useBalance({ address: backendWallet });
    // const savedWalletBalance = savedBalance?.formatted

  // const handleCommission = async () => {
  //   try {
  //     showToast("Commissioning agent...", "info")

  //     // In a real app, this would be a call to your API
  //     // For now, we'll simulate a successful response after a delay
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     // Navigate to the agent commission page
  //     navigate(`/agent-commission/${agent.id}`)
  //   } catch (error) {
  //     showToast("Failed to commission agent. Please try again.", "error")
  //   }
  // }
  const getRandomImage = () => {
    const index = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[index];
  };

  const handleCommissionClick = () => {
    if(isAuthenticated){
      setIsCommissionModalOpen(true)
    }else{
      showToast("Kindly Login","warning")
      navigate("/login")
    }
   
  }

  const handleCommissionConfirm = async (amount: Number) => {
    try {
      showToast("Commissioning agent...", "info");
      const payload = {
        user_id: 6,
        is_deployed: true,
        agent_id: 1,
        tokens: 10,
      };

      const res = await marketplace.commissionAgent(payload);
      if (res.payload.status === "success") {
        // Close the modal
        setIsCommissionModalOpen(false);

        // Show success toast
        showToast(
          `Successfully commissioned ${agent.name} with ${amount} ETH`,
          "success"
        );

        // Navigate to the agent commission page
        navigate(`/agent-commission/${agent.id}`);
      } else {
        showToast("error commisioning agent", "error");
      }
    } catch (error) {
      showToast("Failed to commission agent. Please try again.", "error");
    }
  };

  return (
    <div className="agent-card" onClick={()=>{handleViewDetails(agent)}} >
      {agent.trending && <div className="trending-badge">Trending</div>}

      <div className="agent-image">
       <img src={agent.image === "https://via.placeholder.com/150" ? getRandomImage() : agent.image} alt={agent.name} />
      </div>

      <div className="agent-header">
        <h3 className="agent-name">{agent.name}</h3>
        <div className={`agent-performance ${getPerformanceClass(agent.performance)}`}>{agent.performance}</div>
      </div>

      {/* <p className="agent-description">{agent.description}</p> */}
      <p className={`agent-description ${expanded ? "expanded" : ""}`}>
        {agent.description}
      </p>
      {agent.description.length > 150 && (
        <button className="read-more" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}

      <div className="agent-tags">
        {agent.tags.map((tag:any, index:any) => (
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
      {showActions && (
        // <button className="commission-button gradient-button" onClick={handleCommission}>Commission Agent</button>
        <button className="commission-button gradient-button" onClick={handleCommissionClick}>Commission Agent</button>
      )}

    <CommissionModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        onConfirm={handleCommissionConfirm}
        agentName={agent.name}
        walletBalance={savedWalletBalance as string}
      />
    </div>
  )
}

export default AgentCard

