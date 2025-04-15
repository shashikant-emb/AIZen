"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
// import { useToast } from "../Toast/Toast"
import "./NewAgentBuilder.css"
import { useToast } from "../../components/Toast/Toast"

const NewAgentBuilder: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("liquidity-rebalancer")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"generate" | "ask">("generate")
  const [agentName, setAgentName] = useState("New Agent")
  const [isDraft, setIsDraft] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { agentBuilder } = useReduxActions()
  const { agentBuilder: agentBuilderSelectors } = useReduxSelectors()
  const { chatMessages, deployedAgent } = agentBuilderSelectors
  const [config, setConfig] = useState()

   const [isSaveLoading,setIsSaveLoading]=useState(false)
   const [isDeployLoading,setIsDeployLoading]=useState(false)
   const [isSaved,setIsSaved]=useState(false)
   const [savedAgent, setsavedAgent] = useState(null);
   const [isEditingName, setIsEditingName] = useState(false)


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

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    // Add user message to chat
    agentBuilder.addChatMessage({ text: message, isUser: true });
    setIsGenerating(true);
  
    const payload = {
      user_id: 5,
      state: activeTab === "generate" ? "config" : "ask",
      user_input: message,
    };
  
    try {
      const res = await agentBuilder.sendChatMessage(payload);
      console.log("Response from API:", res);
  
      const config = res?.payload?.response?.config;
      const raw = res?.payload?.response?.raw;
  
      const hasConfig = config && Object.keys(config).length > 0;
  
      if (hasConfig) {
        setConfig(config);
      }
  
      let responseText = "";
  
      if (activeTab === "generate") {
        if (hasConfig) {
          responseText = "Here's a configuration based on your requirements:";
          agentBuilder.addChatMessage({ text: responseText, isUser: false });
          agentBuilder.addChatMessage({ text: JSON.stringify(config, null, 2), isUser: false, isConfig: true });
        } else {
          responseText = raw || "Could not generate configuration. Try refining your prompt.";
          agentBuilder.addChatMessage({ text: responseText, isUser: false });
        }
      } else {
        responseText = raw || "I can help answer questions about trading strategies or configuring your agent.";
        agentBuilder.addChatMessage({ text: responseText, isUser: false });
      }
  
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
    console.log("config",config)
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
        config: config || {},
      };
    let res
    if(isSaved){
      
      let savedagent= savedAgents[savedAgents.length-1]
      const id= savedagent?.agent_id
      res = await agentBuilder.deployAgent({...payload,config:{}},id)
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
        config:config||{}
      };
      const id= savedagent?.agent_id
     await agentBuilder.deployAgent(payload,id).then((res)=>{
        console.log("res",res);
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
          <div className="agent-category-selector">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="liquidity-rebalancer">Uniswap v3</option>
              {/* <option value="yield-optimizer">Yield Optimizer</option>
              <option value="delta-neutral">Delta Neutral</option>
              <option value="grid-trader">Grid Trader</option> */}
              <option value="momentum-strategy">Momentum Strategy</option>
            </select>
          </div>
          <button className="create-button" onClick={handleCreateAgent}>
            {isSaveLoading ? "Creating..." : isSaved ? "Update" : "Create"}
          </button>
          <button
            /*className={!isSaved ? "deploy-button" : "outline-button"}*/ className={
              !isSaved ? "simulate-button" : "deploy-button"
            }
            disabled={!isSaved}
            onClick={handleDeployAgent}
          >
            {isDeployLoading ? "Deploying..." : "Deploy"}
          </button>
        </div>
      </div>

      <div className="new-agent-content">
        <div className="content-tabs">
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
        </div>

        <div className="split-view">
          <div className="chat-panel">
            <div className="chat-messages">
              <div className="system-message">
                <p>
                  {/* Hi! I'll help you build a new agent. You can say something
                  like, "make a liquidity rebalancer that optimizes for minimal
                  impermanent loss" or "create a yield farming agent for
                  stablecoin pairs." */}
                  Hi! I'm here to help you create and deploy your trading agent. You can say something like,
                   "build a liquidity rebalancer that minimizes impermanent loss" or "create an agent that manages stablecoin positions."
                </p>
                <p>What would you like to make?</p>
              </div>

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
