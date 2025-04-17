"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
// import { useToast } from "../Toast/Toast"
import "./NewAgentBuilder.css"
import { useToast } from "../../components/Toast/Toast"
import { tags } from "../../assets/constants/agentBuilderConstants"
import { useLocation } from "react-router-dom";

const NewAgentBuilder: React.FC = () => {
  const location = useLocation();
//   const agentId = location.state?.agentId;  
const { agentId, name } = location.state || {};
  const isEdit= agentId ? true :false
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("liquidity-rebalancer")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"generate" | "ask">("generate")
  const [agentName, setAgentName] = useState("New Agent")
  const [isDraft, setIsDraft] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { auth } = useReduxActions()
  const { agentBuilder } = useReduxActions()
  const { agentBuilder: agentBuilderSelectors } = useReduxSelectors()
  const { chatMessages, deployedAgent } = agentBuilderSelectors
  const [config, setConfig] = useState()

   const [isSaveLoading,setIsSaveLoading]=useState(false)
   const [isDeployLoading,setIsDeployLoading]=useState(false)
   const [isSaved,setIsSaved]=useState(false)
   const [savedAgent, setsavedAgent] = useState(null);
   const [isEditingName, setIsEditingName] = useState(false)

   const [tempagentID,setTempAgentID]=useState(0)


    const { auth: authSelectors } = useReduxSelectors()
   const { isAuthenticated, error,userProfile,tempChatAgentID } = authSelectors
   const {
    tools,
    capabilities,
    isLoading:loading,
    isChatLoading,
    isDeployed:deployed,
    savedAgents,
  } = agentBuilderSelectors

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  useEffect(()=>{
   if(isEdit && agentId){
    fetchChatHistory(agentId)
    setAgentName(name)
    setIsDraft(false)
    setIsSaved(true)
    setTempAgentID(agentId)
   }else{
    agentBuilder.setChatHistory([]);
   }
  },[])
  const fetchChatHistory= async(tempChatAgentID:any)=>{
    const payload={
        user_id:userProfile?.id||"",
        // agent_id:42073||tempagentID,
        // user_id:27,
        // agent_id:24635,
        agent_id:tempChatAgentID,
    }
 const userChatHistory=  await agentBuilder.userChatHistory(payload)
//  console.log("userChatHistory",userChatHistory.payload)
 const data=userChatHistory.payload
//  console.log("Data",data)
 const formattedChat = transformChatHistory(data);
 agentBuilder.setChatHistory(formattedChat);
//  console.log("formated chat ",formattedChat)
 const latestConfigEntry = data.find((entry:any) => entry.response.config !== null);
  if (latestConfigEntry) {
    setConfig(latestConfigEntry.response.config);
  }
}
  const transformChatHistory = (apiData: any[]) => {
    const chatMessages: any[] = [];
  
    apiData?.reverse().forEach((entry) => {
      const userMessage = {
        text: entry?.user_query,
        isUser: true,
      };
  
      const botMessage = {
        text: entry?.response.raw,
        isUser: false,
      };
  
      chatMessages.push(userMessage, botMessage);
  
      if (entry?.response?.config) {
        const configMessage = {
          text: JSON.stringify(entry.response.config, null, 2),
          isUser: false,
          isConfig: true,
        };
        chatMessages.push(configMessage);
      }
    });
  
    return chatMessages;
  };
  

const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    // Add user message to chat
    agentBuilder.addChatMessage({ text: message, isUser: true });
    setIsGenerating(true);
  
    const payload = {
    //   user_id: 5,
        user_id:userProfile?.id||"",
    //   state: activeTab === "generate" ? "config" : "ask",
      user_input: message,
      agent_id: tempagentID,
    };
  
    try {
      const res = await agentBuilder.sendChatMessage(payload);
  
      const config = res?.payload?.response?.config;
      const raw = res?.payload?.response?.raw;
      const tempid= res?.payload?.response?.agent_id
      if(tempid){
        setTempAgentID(tempid)
        auth.setTempChatID(tempid)
      } 

      const hasConfig = config && Object.keys(config).length > 0;
  
      if (hasConfig) {
        setConfig(config);
      }
  
      let responseText = "";
  
    //   if (activeTab === "generate") {
        if (hasConfig) {
          responseText = raw || "Here's a configuration based on your requirements:";
          agentBuilder.addChatMessage({ text: responseText, isUser: false });
          agentBuilder.addChatMessage({ text: JSON.stringify(config, null, 2), isUser: false, isConfig: true });
        } else {
          responseText = raw || "Could not generate configuration. Try refining your prompt.";
          agentBuilder.addChatMessage({ text: responseText, isUser: false });
        }
    //   } else {
    //     responseText = raw || "I can help answer questions about trading strategies or configuring your agent.";
    //     agentBuilder.addChatMessage({ text: responseText, isUser: false });
    //   }
  
    } catch (err) {
      console.error("Error while sending message:", err);
      agentBuilder.addChatMessage({ text: "Oops! Something went wrong.", isUser: false });
    }
  
    setIsGenerating(false);
    setMessage("");
  };

  
  const handleGoBack = () => {
    navigate("/my-agents")
  }

  const handleCreateAgent = async() => {
    // showToast("Agent created successfully!", "success")
    // navigate("/my-agents")
    try {
    setIsSaveLoading(true);
   
    const payload = {
        name: agentName,
        category: category,
        rebalanceFrequency: 6,
        riskProfile: 'medium',
        autoExecute: true,
        isDeployed:false,
        UserId:userProfile?.id||"",
        // config: config?  JSON.parse(config) :{}
        id:tempagentID,
        config: config || {},
      };
    let res
    if(isSaved){
      
      let savedagent= savedAgents[savedAgents.length-1]
      const id= isEdit?agentId: savedagent?.agent_id
     
      res = await agentBuilder.deployAgent({...payload,id},id)
    }else{
      res = await agentBuilder.saveAgent(payload)
    }
    if(res.payload.status=="success"){
        setIsSaved(true)
        setIsDraft(false)
        // alert('Agent saved successfully!');
        if(!isSaved){
          requestAnimationFrame(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          });
          showToast("Agent Created Successfully","success")
        }else{
          showToast("Agent Updated Successfully","success")
        }
       }
       setIsSaveLoading(false);
    } catch (error) {
        console.error("error",error)
        setIsSaveLoading(false);
    }
  }

  const handleDeployAgent = async() => {
    // showToast("Agent deployed successfully!", "success")
    // navigate("/my-agents")
    setIsDeployLoading(true);
    let savedagent= savedAgents[savedAgents.length-1]
    try {
        
  
    const payload = {
        name: agentName,
        category: category,
        rebalanceFrequency: 6,
        riskProfile: 'medium',
        autoExecute: true,
        isDeployed:true,
        UserId:userProfile?.id||"",
        // config: config?  JSON.parse(config) :{},
        config:config||{},
        id:savedagent?.agent_id
      };
    //   const id= savedagent?.agent_id
    const id= isEdit?agentId: savedagent?.agent_id
     await agentBuilder.deployAgent({...payload,id},id).then((res)=>{
       if( res.payload.status=="success"){
        showToast("Agent Deployed Successfully","success")
        navigate("/my-agents")
        agentBuilder.resetChat();
       } else{
        showToast("Something went Wrong","error")
       }
      })
      setIsDeployLoading(false);
      
    } catch (error) {
        console.error(error)
    }
  }


  return (
    <div className="new-agent-builder">
      <div className="new-agent-header">
        <div className="header-left">
          {/* <button className="back-button" onClick={handleGoBack}>
            ←
          </button> */}
          <div className="agent-title">
            {isEditingName ? (
              <input
                className="agent-name-input"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setIsEditingName(false);
                  }
                }}
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setIsEditingName(true)}
                className="editable-agent-name"
              >
                {agentName} ✏️
              </h1>
            )}
            <span className="draft-label">• {isDraft ? "Draft" : "Saved"}</span>
          </div>
        </div>
        <div className="header-right">
          {/* <div className="agent-category-selector">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="liquidity-rebalancer">Uniswap v3</option>
              <option value="yield-optimizer">Yield Optimizer</option>
              <option value="delta-neutral">Delta Neutral</option>
              <option value="grid-trader">Grid Trader</option>
              <option value="momentum-strategy">Momentum Strategy</option>
            </select>
          </div> */}
          <button className="gradient-button" onClick={handleCreateAgent}>
            {isSaveLoading ? "Creating..." : isSaved ? "Update" : "Create"}
          </button>
          <button
            /*className={!isSaved ? "deploy-button" : "outline-button"}*/ className={
              !isSaved ? "blur-button" : "deploy-button"
            }
            disabled={!isSaved}
            onClick={handleDeployAgent}
          >
            {isDeployLoading ? "Deploying..." : "Deploy"}
          </button>
        </div>
      </div>

      <div className="new-agent-content">
        {/* <div className="content-tabs">
          <div className="tabs-container">
            <button
              className={`tab-button ${
                activeTab === "generate" ? "active" : ""
              }`}
              onClick={() => setActiveTab("generate")}
            >
              Generate
            </button>
            <button
              className={`tab-button ${activeTab === "ask" ? "active" : ""}`}
              onClick={() => setActiveTab("ask")}
            >
              Ask
            </button>
          </div>
        </div> */}
         {/* <div className="filter-tags">
        {tags.map((tag:any) => (
          <button
            key={tag}
            className={`tag active`}
            style={{ cursor: "auto", opacity: 0.8 }}
            disabled
          >
            {tag}
          </button>
        ))}
      </div> */}

        <div className="split-view">
          <div className="chat-panel">
            <div className="chat-messages">
              {/* <div className="system-message">
                <p>
                  Hi! I'm here to help you create and deploy your trading agent. You can say something like,
                   "build a liquidity rebalancer that minimizes impermanent loss" or "create an agent that manages stablecoin positions."
                </p>
                <p>What would you like to make?</p>
              </div> */}
              <div className="system-message">
      {/* <h3 className="text-lg font-semibold mb-2 text-gray-800">Create Your LP Rebalancing Agent</h3> */}
      <p className="text-sm text-gray-600 mb-3">
        Describe your strategy below. The AI will generate a custom agent based on your stretegy. Your strategy could be something like,
      </p>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>“Rebalance ETH/USDC when position goes out of range”</li>
        <li>“Aperture-style agent with dynamic range based on volatility”</li>
        <li>“Low-frequency rebalancing once every 5 days”</li>
        <li>“Move liquidity back in range if active liquidity falls below 70%”</li>
        {/* <li>“Auto-manage stablecoin LP and optimize for fee yield”</li> */}
      </ul>
    </div>

              {/* “Create an agent that rebalances my Uniswap V3 LP position whenever it goes out of range.”

“I want an AI agent to manage my ETH/USDC liquidity and adjust the range dynamically.”

“Set up an LP agent that tracks price and rebalances every time the price deviates more than 10%.”

“Make an agent that watches my Uniswap pool and moves liquidity back into active range automatically.”

“Generate an agent to rebalance my LP position once daily based on volatility.” */}


              {/* <div className="system-message">
  <p>Hi there! 👋 I'm here to help you create and launch your own AI-powered agent.</p>
  <p>Your agent can do things like:</p>
  <ul className="list-disc list-inside ml-4">
    <li>Automate research or market analysis</li>
    <li>Rebalance your portfolio or manage liquidity</li>
    <li>Move liquidity back into range if it drops below 80% active</li>
    
  </ul>
  <p className="mt-2">
    Try saying: <em>"Make an agent that watches my Uniswap pool and moves liquidity back into active range automatically."</em> or <em>"create one that rebalances my portfolio daily"</em>.
  </p>
  <p>What kind of agent would you like to create? 🚀</p>
</div> */}

              

              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.isUser
                      ? "user-message"
                      : msg.isConfig
                      ? "config-message"
                      : "ai-message"
                  }`}
                >
                  {/* <p>{msg.text}</p> */}
                  <p>
                    {typeof msg.text === "string"
                      ? msg.text
                      : JSON.stringify(msg.text)}
                  </p>
                  {msg.isConfig && (
                    <pre className="inline-config">
                      {JSON.stringify(config, null, 2)}
                    </pre>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="ai-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything"
                disabled={isGenerating}
              />
              {/* <button type="button" className="input-button">
                +
              </button>
              <button type="button" className="input-button">
                <span className="microphone-icon">🎤</span>
              </button> */}
              <button
                type="submit"
                className="input-button submit-button"
                disabled={isGenerating || !message.trim()}
              >
                <span className="arrow-icon">↑</span>
              </button>
            </form>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h2>Preview Config</h2>
             <div className="preview-buttons">
             <button
                className="reset-config-button"
                onClick={() => {
                  agentBuilder.resetChat();
                  setConfig(undefined);
                  setMessage("");
                  setIsGenerating(false);
                  setAgentName("New Agent"); // optional
                }}
              >
                Reset chat
              </button>
             {tempChatAgentID && chatMessages.length===0 && <button
                className="reload-chat-button"
                onClick={() => {
                    fetchChatHistory(tempChatAgentID)
                //   setAgentName("New Agent"); 
                }}
              >
                Reload Previous Chat
              </button>}
             </div>
            </div>
            <div className="preview-content">
              <div className="config-preview">
                <pre className="json-display">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewAgentBuilder
