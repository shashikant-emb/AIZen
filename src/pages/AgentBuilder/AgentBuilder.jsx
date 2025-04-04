import React, { useEffect, useState ,useRef} from 'react';
import './AgentBuilder.css';
import { capabilities, tools } from '../../assets/constants/agentBuilderConstants';
import { useAccount, useBalance, useEnsName } from "wagmi";
import { useReduxActions, useReduxSelectors } from '../../hooks/useReduxActions';
import {useNavigate} from "react-router-dom"
import { useToast } from '../../components/Toast/Toast';

const AgentBuilder = () => {
  let trrrr={
    "strategy": {
        "name": "Uniswap V3 Automated Rebalancing Strategy",
        "description": "This strategy dynamically manages liquidity in Uniswap V3 pools based on technical indicators, market conditions, and real-time on-chain data.",
        "liquidity_management": {
            "action": "rebalance",
            "frequency": "hourly",
            "target_profit_percentage": 0.02,
            "max_slippage": 0.01,
            "liquidity_depth_threshold": 10000,
            "fee_earnings_threshold": 0.005
        },
        "technical_indicators": {
            "RSI": {
                "period": 14,
                "oversold_threshold": 30,
                "overbought_threshold": 70,
                "explanation": "RSI measures the speed and change of price movements; generally, an RSI below 30 indicates an oversold condition, while above 70 indicates an overbought condition."
            },
            "MACD": {
                "fast_length": 12,
                "slow_length": 26,
                "signal_length": 9,
                "explanation": "The MACD is the difference between a 12-period and a 26-period Exponential Moving Average (EMA), indicating momentum; it typically provides buy signals when the MACD crosses above the signal line and sell signals when it crosses below."
            },
            "Bollinger_Bands": {
                "length": 20,
                "deviation": 2,
                "explanation": "Bollinger Bands consist of a middle band (20-period MA) and two outer bands (2 standard deviations). Prices at the lower band indicate potential buying opportunities, while prices at the upper band indicate selling."
            },
            "Moving_Averages": {
                "short_length": 5,
                "long_length": 20,
                "explanation": "Short-term moving averages crossing above long-term moving averages may indicate a bullish trend (Golden Cross), while the opposite (Death Cross) may indicate a bearish trend."
            },
            "VWAP": {
                "lookback_period": "1d",
                "explanation": "The Volume Weighted Average Price (VWAP) represents the average price a security has traded at throughout the day, based on both volume and price. It serves as a trading benchmark."
            },
            "Order_Flow": {
                "lookback_period": "1h",
                "explanation": "Order flow analysis assesses the demand and supply dynamics based on the number of buy and sell orders, providing insights into ongoing trends."
            },
            "Uniswap_V3_Liquidity_Depth": {
                "threshold": 10000,
                "explanation": "Measures the liquidity depth in the pool; high liquidity depth generally results in lower slippage."
            }
        },
        "conditions": {
            "rebalance_conditions": {
                "must_meet": [
                    {
                        "indicator": "RSI",
                        "action": "remove_liquidity",
                        "condition": "RSI > 70"
                    },
                    {
                        "indicator": "Uniswap_V3_Liquidity_Depth",
                        "action": "remove_liquidity",
                        "condition": "Liquidity Depth < 10000"
                    }
                ],
                "optional": [
                    {
                        "indicator": "MACD",
                        "action": "add_liquidity",
                        "condition": "MACD Line crosses above Signal Line"
                    },
                    {
                        "indicator": "Bollinger_Bands",
                        "action": "add_liquidity",
                        "condition": "Price hits lower Bollinger Band"
                    },
                    {
                        "indicator": "Order_Flow",
                        "action": "remove_liquidity",
                        "condition": "Bearish order flow detected"
                    }
                ]
            },
            "rebalance_condition": {
                "trigger": "Profit Target Reached",
                "action": "rebalance",
                "threshold": "target_profit_percentage"
            }
        },
        "liquidity_range_adjustments": {
            "new_range_calculation": {
                "formula": "New_Liquidity_Range = Current_Price * (1 +- Adjustment_Percentage)",
                "parameters": {
                    "Current_Price": "Current market price of the asset",
                    "Adjustment_Percentage": "Dynamic percentage based on volatility and expected price movement"
                }
            }
        },
        "execution": {
            "bot_setup": {
                "webhook_url": "https://example.com/webhook",
                "cron_schedule": "0 * * * *"
            }
        }
    }
}
  const navigate= useNavigate()
   const { showToast } = useToast();
  const { agentBuilder } = useReduxActions()
  const { agentBuilder: agentBuilderSelectors } = useReduxSelectors()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, error,userProfile } = authSelectors
  const {
    tools,
    capabilities,
    isLoading:loading,
    isChatLoading,
    isDeployed:deployed,
    savedAgents,
  } = agentBuilderSelectors

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    goals: '',
    instructions: '',
    category:'',
    capabilities: ['Liquidity Provision', 'Asset Rebalancing'],
    tools: ['RSI', 'Momentum', 'Alpha-based Trigger']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading,setIsSaveLoading]=useState(false)
  const [isDeployLoading,setIsDeployLoading]=useState(false)
  const [isDeployed, setIsDeployed] = useState(false);
  const [isSaved,setIsSaved]=useState(false)
  const [savedAgent, setsavedAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your liquidity rebalancer agent. How can I assist you today?", isUser: false }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [jsonData, setJsonData] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapabilityToggle = (capability) => {
    setFormData(prev => {
      if (prev.capabilities.includes(capability)) {
        return { ...prev, capabilities: prev.capabilities.filter(c => c !== capability) };
      } else {
        return { ...prev, capabilities: [...prev.capabilities, capability] };
      }
    });
  };
  
  const handleCategoryChange= async(e)=>{
    handleInputChange(e)
    agentBuilder.categorySelection({category:e.target.value})
  }

  const handleToolToggle = (tool) => {
    setFormData(prev => {
      if (prev.tools.includes(tool)) {
        return { ...prev, tools: prev.tools.filter(t => t !== tool) };
      } else {
        return { ...prev, tools: [...prev.tools, tool] };
      }
    });
  };

  const handleSave = async () => {
    if(formData.name==''||formData.role=='' ||formData.goals=='' || formData.description==''){
      showToast("Please fill all the input fields","warning")
      return
    }else if(formData.category==''){
      showToast("please select category","warning")
      return
    }
    setIsSaveLoading(true);
    try {
      const response = {
        AgentName: formData.name || 'OrionBot',
        AgentRole: formData.role || 'Liquidity Rebalancer',
        AgentGoals: formData.goals || 'Optimize liquidity across pools with minimal IL',
        AgentDescription: formData.description || 'Advanced algorithmic agent for DeFi liquidity optimization',
        AgentInstructions: formData.instructions,
        SelectedTools: formData.tools,
        category: formData.category,
        AgentCapabilities: formData.capabilities,
        rebalanceFrequency: 6,
        riskProfile: 'medium',
        autoExecute: true,
        isDeployed:false,
        UserId:userProfile?.id||"",
        config: jsonData?  JSON.parse(jsonData) :{}
      };

      setsavedAgent(response)
      let res
      if(isSaved){
        
        let savedagent= savedAgents[savedAgents.length-1]
        const id= savedagent?.agent_id
        res = await agentBuilder.deployAgent({...response,config:{}},id)
      }else{
        res = await agentBuilder.saveAgent(response)
      }
   
     if(res.payload.status=="success"){
      setIsSaved(true)
      // alert('Agent saved successfully!');
      if(!isSaved){
        requestAnimationFrame(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });
        showToast("Agent Saved Successfully","success")
      }
      showToast("Agent Updated Successfully","success")
     }
     setIsSaveLoading(false);
    } catch (error) {
      console.error("error",error)
      setIsSaveLoading(false);
    }
    // alert('Agent saved successfully!');
  };

  
  const handleSimulate = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert('Simulation completed successfully!');
  };

  const handleDeploy = async () => {
    setIsDeployLoading(true);
    
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response from API
    let savedagent= savedAgents[savedAgents.length-1]
    try {
      const payload = {
        AgentName: formData.name || 'OrionBot',
        AgentRole: formData.role || 'Liquidity Rebalancer',
        AgentGoals: formData.goals || 'Optimize liquidity across pools with minimal IL',
        AgentDescription: formData.description || 'Advanced algorithmic agent for DeFi liquidity optimization',
        AgentInstructions: formData.instructions,
        SelectedTools: formData.tools,
        category: formData.category,
        AgentCapabilities: formData.capabilities,
        rebalanceFrequency: 6,
        riskProfile: 'medium',
        autoExecute: true,
        isDeployed:true,
        UserId:userProfile?.id||"",
        config:{},
      };
      const id= savedagent?.agent_id
      agentBuilder.deployAgent(payload,id).then(()=>{
        showToast("Agent Deployed Successfully","success")
        navigate("/my-agents")
      })
      // setsavedAgent(response);
      // setIsDeployed(true);
      setIsDeployLoading(false);
      // 
      // alert('Agent Deployed successfully!');
      
    } catch (error) {
      console.error(error)
    }
   
  };

  const handleCopyJSON = () => {
    if (!savedAgent) return;
    const jsonString = JSON.stringify(savedAgent?.config || savedAgent, null, 2);
    navigator.clipboard.writeText(jsonString);
    showToast("JSON copied to clipboard!","success");
  };


  
  const handleSendMessage = async() => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    
    // Simulate agent response
    let savedagent= savedAgents[savedAgents.length-1]
    const payload={
      agent_id:savedagent?.agent_id,
      // agent_id:2,
      user_id:userProfile?.id,
      user_input:userMessage,
    }
    
  const res=  await agentBuilder.sendChatMessage(payload)
  console.log("chatres",res.payload.response.output[0].summary);
  
  const config = res?.payload?.response?.config;
  if (config && Object.keys(config).length > 0) {
    setJsonData(JSON.stringify(res.payload.response.config || trrrr, null, 2));
  }
 
  const responseText =
    config && Object.keys(config).length > 0
      ? "Json Generated"
      : res.payload.response.raw;

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          // text: "I monitor RSI and momentum indicators to identify optimal entry and exit points. When alpha triggers are detected, I'll automatically rebalance liquidity across pools to maximize yield while minimizing impermanent loss. My default rebalance frequency is set to 6 times per day, but this can be adjusted based on market volatility.", 
          // text: res?.payload?.response?.config ? "Json Generated" : res.payload.response.raw,
          text: responseText,
          isUser: false 
        }
      ]);
    }, 1000);
    
    setUserMessage('');
  };

  const handleResetChat = () => {
    setChatMessages([
      { text: "Hello! I'm your liquidity rebalancer agent. How can I assist you today?", isUser: false }
    ]);
  };
// //Add Auto-Scroll Effect
//   const messagesEndRef = useRef(null);
// useEffect(() => {
//   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// }, [chatMessages, isChatLoading]);


  const formatJsonForDisplay = () => {

    if (!savedAgent) return '';
    
    
    // Create a formatted JSON string with syntax highlighting classes
    return `{
  "name": "${savedAgent.AgentName}",
  "role": "${savedAgent.AgentRole}",
  "goals": "${savedAgent.AgentGoals}",
  "description": "${savedAgent.AgentDescription}",
  "tools": [
    ${savedAgent.SelectedTools.map(tool => `"${tool}"`).join(',\n    ')}
  ],
  "rebalanceFrequency": ${savedAgent.rebalanceFrequency},
  "riskProfile": "${savedAgent.riskProfile}",
  "autoExecute": ${savedAgent.autoExecute}
}`;
  };

  return (
    <div className="agent-builder">
      <div className="agent-builder-header">
        {/* <h1>Agent Builder Dashboard</h1> */}
        <h1>{"Build Your Agent"}</h1>
        {/* <div className="user-info">
          <div className="user-avatar">JC</div>
          <span>Jane Creator</span>
        </div> */}
      </div>

      {/* {!isDeployed ? ( */}
      <div className="agent-form-container">
        <div className="agent-form-header">
          {/* <h2>Build Your Agent</h2> */}
          <p>
            Configure your agent's role, goals, and tools. Once saved, you can
            simulate or deploy.
          </p>
        </div>

        <div className="agent-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Agent Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. OrionBot"
                value={formData.name}
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Agent Role</label>
              <input
                type="text"
                id="role"
                name="role"
                placeholder="e.g. Liquidity Rebalancer"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Agent Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Short description for the agent listing..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Instructions for Agent</label>
              <textarea
                id="instructions"
                name="instructions"
                placeholder="Detailed instructions or prompts..."
                value={formData.instructions}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="goals">Agent Goals</label>
            <textarea
              id="goals"
              name="goals"
              placeholder="Describe the main objectives..."
              value={formData.goals}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Category:</label>
              {/* handleCategoryChange */}
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="All Chains">All Chains</option>
                {/* <option value="Ethereum">Ethereum</option>
                <option value="Solana">Solana</option> */}
                <option value="Uniswap V3">Uniswap V3</option>
              </select>
            </div>
          </div>

          {capabilities.length > 0 && (
            <div className="form-group">
              <label>Agent Capabilities</label>
              <div className="checkbox-group">
                {capabilities.map((capability) => (
                  <div key={capability} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`capability-${capability}`}
                      checked={formData.capabilities.includes(capability)}
                      onChange={() => handleCapabilityToggle(capability)}
                    />
                    <label htmlFor={`capability-${capability}`}>
                      {capability}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tools.length > 0 && (
            <div className="form-group">
              <label>Select Tools & Strategies</label>
              <p className="form-hint">
                Choose from available alpha indicators and utilities.
              </p>
              <div className="tools-grid">
                {tools.map((tool) => (
                  <div key={tool} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`tool-${tool}`}
                      checked={formData.tools.includes(tool)}
                      onChange={() => handleToolToggle(tool)}
                    />
                    <label htmlFor={`tool-${tool}`}>{tool}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="form-actions">
            <button
              className="gradient-button save-button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isSaveLoading
                ? "Saving..."
                : isSaved
                ? "Update Agent"
                : "Save Agent"}
            </button>
            <button
              className="simulate-button"
              onClick={handleSimulate}
              // disabled={isLoading}
              disabled={true}
            >
              {isLoading ? "Simulating..." : "Simulate"}
            </button>
            <button
              className={!isSaved ? "simulate-button" : "outline-button"}
              onClick={handleDeploy}
              disabled={!isSaved}
              // disabled={true}
            >
              {isDeployLoading ? "Deploying..." : "Deploy"}
            </button>
          </div>
        </div>
      </div>
      {/* ) : ( */}
      {isSaved && (
        <div className="agent-deployed-container">
          <div className="json-configuration">
            <div className="section-header">
              <h2>Generated JSON Configuration</h2>
              <button className="copy-button" onClick={handleCopyJSON}>
                <span className="copy-icon">□</span> Copy
              </button>
            </div>
            <pre className="json-display">
              <code
                dangerouslySetInnerHTML={{ __html: jsonData || formatJsonForDisplay() }}
              />
            </pre>
          </div>

          <div className="test-agent">
            <h2>Test Your Agent</h2>

            <div className="agent-conversation">
              <div className="conversation-header">
                <h3>Agent Conversation</h3>
                <button className="reset-button" onClick={handleResetChat}>
                  <span className="reset-icon">↺</span> Reset
                </button>
              </div>

              <div className="messages-container">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.isUser ? "user-message" : "agent-message"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="message agent-message typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your question here..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="send-button gradient-button"
                  onClick={handleSendMessage}
                  disabled={isChatLoading}
                >
                  {/* What's your rebalancing strategy? */}
                  {isChatLoading ? "Sending" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
