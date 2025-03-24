import React, { useEffect, useState } from 'react';
import './AgentBuilder.css';
import { capabilities, tools } from '../../assets/constants/agentBuilderConstants';
import { useAccount, useBalance } from "wagmi";
import { useReduxActions, useReduxSelectors } from '../../hooks/useReduxActions';

const AgentBuilder = () => {
  const { agentBuilder } = useReduxActions()
  const { agentBuilder: agentBuilderSelectors } = useReduxSelectors()
  const {
    tools,
    capabilities
  } = agentBuilderSelectors
  console.log(tools,capabilities)
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  console.log("address",address)
  console.log('balance',`${balance?.formatted} ${balance?.symbol}`)
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

  // saveAgent

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
      alert("Please fill all the input fields")
      return
    }else if(formData.category==''){
      alert("please select category")
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
        autoExecute: true
      };
      console.log("res",response)
      setsavedAgent(response)
      agentBuilder.saveAgent(response)
      setIsSaved(true)
      // alert('Agent saved successfully!');
      setIsSaveLoading(false);
      requestAnimationFrame(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
      
    } catch (error) {
      console.error("error",error)
      setIsSaveLoading(false);
    }
   
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // console.log("res",formData)
    
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response from API
    const response = {
      name: formData.name || 'OrionBot',
      role: formData.role || 'Liquidity Rebalancer',
      goals: formData.goals || 'Optimize liquidity across pools with minimal IL',
      description: formData.description || 'Advanced algorithmic agent for DeFi liquidity optimization',
      tools: formData.tools,
      
      rebalanceFrequency: 6,
      riskProfile: 'medium',
      autoExecute: true
    };
    console.log("res",response)
    
    // setsavedAgent(response);
    // setIsDeployed(true);
    setIsDeployLoading(false);
    alert('Agent Deployed successfully!');
  };

  const handleCopyJSON = () => {
    if (!savedAgent) return;
    
    const jsonString = JSON.stringify(savedAgent, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert('JSON copied to clipboard!');
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    
    // Simulate agent response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          text: "I monitor RSI and momentum indicators to identify optimal entry and exit points. When alpha triggers are detected, I'll automatically rebalance liquidity across pools to maximize yield while minimizing impermanent loss. My default rebalance frequency is set to 6 times per day, but this can be adjusted based on market volatility.", 
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
            <p>Configure your agent's role, goals, and tools. Once saved, you can simulate or deploy.</p>
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
              <select name='category' value={formData.category} onChange={handleCategoryChange}>
                <option value="All Chains">All Chains</option>
                {/* <option value="Ethereum">Ethereum</option>
                <option value="Solana">Solana</option> */}
                 <option value="Uniswap V3">Uniswap V3</option>
                
              </select>
            </div>
          </div>

           {capabilities.length>0 && ( 
            <div className="form-group">
              <label>Agent Capabilities</label>
              <div className="checkbox-group">
                {capabilities.map(capability => (
                  <div key={capability} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`capability-${capability}`}
                      checked={formData.capabilities.includes(capability)}
                      onChange={() => handleCapabilityToggle(capability)}
                    />
                    <label htmlFor={`capability-${capability}`}>{capability}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

           {tools.length>0 && (
             <div className="form-group">
              <label>Select Tools & Strategies</label>
              <p className="form-hint">Choose from available alpha indicators and utilities.</p>
              <div className="tools-grid">
                {tools.map(tool => (
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
                {isSaveLoading ? 'Saving...' : isSaved ? 'Update Agent': 'Save Agent'}
              </button>
              <button 
                className="simulate-button" 
                onClick={handleSimulate}
                // disabled={isLoading}
                disabled={true}
              >
                {isLoading ? 'Simulating...' : 'Simulate'}
              </button>
              <button 
                className="simulate-button" 
                onClick={handleDeploy}
                // disabled={isLoading}
                disabled={true}
              >
                {isDeployLoading ? 'Deploying...' : 'Deploy'}
              </button>
            </div>
          </div>
        </div>
      {/* ) : ( */}
      {isSaved &&
      (
        <div className="agent-deployed-container">
          <div className="json-configuration">
            <div className="section-header">
              <h2>Generated JSON Configuration</h2>
              <button className="copy-button" onClick={handleCopyJSON}>
                <span className="copy-icon">□</span> Copy
              </button>
            </div>
            <pre className="json-display">
              <code dangerouslySetInnerHTML={{ __html: formatJsonForDisplay() }} />
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
                    className={`message ${message.isUser ? 'user-message' : 'agent-message'}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your question here..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="send-button gradient-button"
                  onClick={handleSendMessage}
                >
                  {/* What's your rebalancing strategy? */}
                  Send
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
