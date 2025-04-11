"use client"

import React, { useEffect } from "react"
import { useState } from "react"
// import { useToast } from "../Toast/Toast"
import "./Settings.css"
import { useToast } from "../../components/Toast/Toast"
import Sidebar from "../../components/SideBar/SideBar"
import useWalletTransactions from "../../hooks/useWalletTransactions"
import { useAccount, useBalance } from "wagmi"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"

const Settings: React.FC = () => {

 const { address: connectedWallet, isConnected } = useAccount();
   const { address } = useAccount();
   const { auth } = useReduxActions()
   const { auth: authSelectors } = useReduxSelectors()
   const { isAuthenticated, walletAddress,walletBalance } = authSelectors

   
   
   const backendWallet = localStorage.getItem("wallet_address") as `0x${string}`;
  //  const { data: balance, refetch: refetchConnectedBalance } = useBalance({ address: connectedWallet });
  //  const { data: savedBalance, refetch: refetchSavedBalance } = useBalance({ address: backendWallet });
    
    // const connectedWalletBalance = balance
    //   ? `${balance.formatted} ${balance.symbol}`
    //   : "Loading...";
    
    // const savedWalletBalance = savedBalance
    //   ? `${savedBalance.formatted} ${savedBalance.symbol}`
    //   : "Loading...";
  const [savedWalletBalance,setSavedWalletbalance] = useState(0)
  const [connectedWalletBalance,setConnectedWalletBalance]=useState(0)
  // `${walletBalance} ETH`

  const [activeTab, setActiveTab] = useState("profile")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const[depositAmount, setDepositAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const { showToast } = useToast()
  const { depositETH, withdrawETH, progress } = useWalletTransactions()

  const [formData, setFormData] = useState({
    name: "Jane Creator",
    email: "jane@example.com",
    walletAddress: address,
    bio: "DeFi enthusiast and algorithmic trading specialist with 5+ years of experience.",
    darkMode: true,
    notifications: {
      email: true,
      performance: true,
      security: true,
      marketing: false,
    },
    apiKey: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
    twoFactorEnabled: false,
    wallets: {
      saved: {
        address: backendWallet||"NA",
        balance: savedWalletBalance ||"NA",
      },
      connected: {
        address: connectedWallet|| "",
        balance: connectedWalletBalance || "NA",
      },
    },
  })

  
  const fetchBalance = async (walletAddress: string) => {
    if (walletAddress) {
      try {
        const res = await auth.walletBalance(walletAddress);
        return res?.payload?.wallet_balance || 0;
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        return 0;
      }
    }
    return 0;
  };
  const getBalances = async () => {
    const connectedBalance = await fetchBalance(connectedWallet  as `0x${string}`);
    const backendBalance = await fetchBalance(backendWallet);
    
    setSavedWalletbalance(backendBalance);
    setConnectedWalletBalance(connectedBalance);
  };


  useEffect(() => {
    getBalances();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   
    const { name, value } = e.target
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: checked,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call to save profile
    setTimeout(() => {
      showToast("Profile saved successfully!", "success")
    }, 500)
  }

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call to save preferences
    setTimeout(() => {
      showToast("Preferences saved successfully!", "success")
    }, 500)
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call to save security settings
    setTimeout(() => {
      showToast("Security settings saved successfully!", "success")
    }, 500)
  }

  const handleGenerateNewApiKey = () => {
    // Simulate generating a new API key
    const newApiKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    setFormData((prev) => ({ ...prev, apiKey: newApiKey }))
    showToast("New API key generated!", "info")
  }



   // Add the maskAddress helper function
   const maskAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

// Add the handleCopyAddress function
const handleCopyAddress = (address: string) => {
  navigator.clipboard.writeText(address)
  showToast("Wallet address copied to clipboard!", "success")
}
  
  const handleDeposit = () => {
    if(!isConnected){
      showToast("Plese Connect the wallet first","error")
      return
    }else if(!depositAmount || Number(depositAmount)<0){
      showToast("please enter a valid amount","warning")
      return
    }
  
    showToast("Deposit initiated. Please confirm the transaction in your wallet.", "info")
    setProcessing(true)
     depositETH(depositAmount.toString()).then(() => {
      setProcessing(false)
      setDepositAmount("")
      getBalances()
      // showToast("Deposit successful!", "success")
    })
  
  }

  const handleWithdraw = () => {
    if(!isConnected ){
      showToast("Plese Connect the wallet first","warning")
      return
    }else if(!withdrawAmount || Number(withdrawAmount)<0){
      showToast("please enter a valid amount","warning")
      return
    }

    showToast("Withdrawal initiated.", "info")
    setProcessing(true)
      withdrawETH(withdrawAmount.toString()).then(() => {
      setProcessing(false)
      setWithdrawAmount("")
      getBalances()
      // showToast("Withdrawal successful!", "success")
    })
  }


  const renderProfileTab = () => (
    <form className="settings-form" onSubmit={handleSaveProfile}>
      <div className="form-group">
        <label htmlFor="name">Display Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="walletAddress">Wallet Address</label>
        <input
          type="text"
          id="walletAddress"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Profile
        </button>
      </div>
    </form>
  )

  const renderPreferencesTab = () => (
    <form className="settings-form" onSubmit={handleSavePreferences}>
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" name="darkMode" checked={formData.darkMode} onChange={handleCheckboxChange} />
          <span>Dark Mode</span>
        </label>
        <p className="form-help">Enable dark mode for a better viewing experience in low-light environments.</p>
      </div>

      <div className="form-section">
        <h3>Notification Preferences</h3>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleCheckboxChange}
            />
            <span>Email Notifications</span>
          </label>
          <p className="form-help">Receive important updates and alerts via email.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.performance"
              checked={formData.notifications.performance}
              onChange={handleCheckboxChange}
            />
            <span>Performance Alerts</span>
          </label>
          <p className="form-help">Get notified about significant changes in your agents' performance.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.security"
              checked={formData.notifications.security}
              onChange={handleCheckboxChange}
            />
            <span>Security Alerts</span>
          </label>
          <p className="form-help">Receive notifications about security-related events.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.marketing"
              checked={formData.notifications.marketing}
              onChange={handleCheckboxChange}
            />
            <span>Marketing & Updates</span>
          </label>
          <p className="form-help">Stay informed about new features, products, and promotional offers.</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Preferences
        </button>
      </div>
    </form>
  )

  const renderSecurityTab = () => (
    <form className="settings-form" onSubmit={handleSaveSecurity}>
      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <div className="api-key-container">
          <input type="text" id="apiKey" name="apiKey" value={formData.apiKey} readOnly />
          <button type="button" className="action-button" onClick={handleGenerateNewApiKey}>
            Generate New
          </button>
        </div>
        <p className="form-help">Your API key provides access to the StratGPT API. Keep it secure.</p>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onChange={handleCheckboxChange}
          />
          <span>Enable Two-Factor Authentication</span>
        </label>
        <p className="form-help">Add an extra layer of security to your account with 2FA.</p>
      </div>

      <div className="form-section">
        <h3>Change Password</h3>

        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Security Settings
        </button>
      </div>
    </form>
  )
  
  const renderWalletsTab = () => (
    <div className="settings-form">
      <h3 className="section-title">Your Wallets</h3>
      <p className="section-description">Manage your wallets and transfer funds between them.</p>

      <div className="wallets-container">
        <div className="wallet-card">
          <div className="wallet-header">
            <h4>Saved Wallet</h4>
            <span className="wallet-badge">Platform</span>
          </div>
          <div className="wallet-address">
            {maskAddress(formData.wallets.saved.address)}
            <button
              className="copy-button"
              onClick={() => handleCopyAddress(formData.wallets.saved.address)}
              title="Copy address"
            >
              📋
            </button>
          </div>
          <div className="wallet-balance">
            <span className="balance-label">Balance:</span>
            <span className="balance-value">{savedWalletBalance}</span>
          </div>
          <div className="wallet-description">
            This is your platform wallet used for agent operations and fee collection.
          </div>
        </div>

        <div className="wallet-card">
          <div className="wallet-header">
            <h4>Connected Wallet</h4>
            <span className="wallet-badge active">Active</span>
          </div>
          <div className="wallet-address">
            {maskAddress(formData.wallets.connected.address)||"No Address Found"}
            <button
              className="copy-button"
              onClick={() => handleCopyAddress(formData.wallets.connected.address)}
              title="Copy address"
            >
              📋
            </button>
          </div>
          <div className="wallet-balance">
            <span className="balance-label">Balance:</span>
            <span className="balance-value">{formData?.wallets?.connected?.address?connectedWalletBalance:"NA"}</span>
          </div>
          <div className="wallet-description">
            This is your currently connected wallet used for authentication and transactions.
          </div>
        </div>
      </div>

      <div className="wallet-actions">
        <div className="action-group">
          <h4>Transfer Funds</h4>
          <div className="transfer-actions">
            <div className="transfer-action">
              <label htmlFor="depositAmount">Deposit to Saved Wallet</label>
              <div className="transfer-input-group">
                <input type="number" id="depositAmount" placeholder="0.00" min="0.01" step="0.01" onChange={(e)=>setDepositAmount(e.target.value)} />
                {/* <span className="currency-label">ETH</span> */}
                <button className="transfer-button" disabled={processing}onClick={handleDeposit}>
                  Deposit
                </button>
              </div>
              <p className="transfer-description">Transfer ETH from your connected wallet to your platform wallet.</p>
            </div>

            <div className="transfer-action">
              <label htmlFor="withdrawAmount">Withdraw to Connected Wallet</label>
              <div className="transfer-input-group">
                <input type="number" id="withdrawAmount" placeholder="0.00" min="0.01" step="0.01"  onChange={(e)=>setWithdrawAmount(e.target.value)}/>
                {/* <span className="currency-label">ETH</span> */}
                <button className="transfer-button" disabled={processing} onClick={handleWithdraw}>
                  Withdraw
                </button>
              </div>
              <p className="transfer-description">Transfer ETH from your platform wallet to your connected wallet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
   
  return (
    <>
    {/* <Sidebar /> */}
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          {/* <button
            className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button> */}
          <button
            className={`tab-button ${activeTab === "wallets" ? "active" : ""}`}
            onClick={() => setActiveTab("wallets")}
          >
            Wallets
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "preferences" && renderPreferencesTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "wallets" && renderWalletsTab()}
          
        </div>
      </div>
    </div>
    </>
  )
}

export default Settings


// "use client"

// import  React from "react"
// import { useState } from "react"
// // import { useToast } from "../Toast/Toast"
// import "./Settings.css"
// import { useToast } from "../../components/Toast/Toast"

// const Settings: React.FC = () => {
//   // Update the activeTab state to include the new "wallets" option
//   const [activeTab, setActiveTab] = useState("profile")

//   // Add the wallets data to the formData state
//   const [formData, setFormData] = useState({
//     name: "Jane Creator",
//     email: "jane@example.com",
//     walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
//     bio: "DeFi enthusiast and algorithmic trading specialist with 5+ years of experience.",
//     darkMode: true,
//     notifications: {
//       email: true,
//       performance: true,
//       security: true,
//       marketing: false,
//     },
//     apiKey: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
//     twoFactorEnabled: false,
//     wallets: {
//       saved: {
//         address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
//         balance: "12.45 ETH",
//       },
//       connected: {
//         address: "0x3a54Cf3B6e7a3D6A0392d5d8ea15b7b5B358aDd9",
//         balance: "3.78 ETH",
//       },
//     },
//   })

//   // Get toast functionality
//   const { showToast } = useToast()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".")
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent as keyof typeof prev],
//           [child]: checked,
//         },
//       }))
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: checked }))
//     }
//   }

//   const handleSaveProfile = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Simulate API call to save profile
//     setTimeout(() => {
//       showToast("Profile saved successfully!", "success")
//     }, 500)
//   }

//   const handleSavePreferences = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Simulate API call to save preferences
//     setTimeout(() => {
//       showToast("Preferences saved successfully!", "success")
//     }, 500)
//   }

//   const handleSaveSecurity = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Simulate API call to save security settings
//     setTimeout(() => {
//       showToast("Security settings saved successfully!", "success")
//     }, 500)
//   }

//   const handleGenerateNewApiKey = () => {
//     // Simulate generating a new API key
//     const newApiKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

//     setFormData((prev) => ({ ...prev, apiKey: newApiKey }))
//     showToast("New API key generated!", "info")
//   }

//   // Add the handleCopyAddress function
//   const handleCopyAddress = (address: string) => {
//     navigator.clipboard.writeText(address)
//     showToast("Wallet address copied to clipboard!", "success")
//   }

//   // Add the handleDeposit and handleWithdraw functions
//   const handleDeposit = () => {
//     // In a real app, this would trigger a wallet transaction
//     showToast("Deposit initiated. Please confirm the transaction in your wallet.", "info")

//     // Simulate a successful deposit after 2 seconds
//     setTimeout(() => {
//       showToast("Successfully deposited ETH to your saved wallet!", "success")
//     }, 2000)
//   }

//   const handleWithdraw = () => {
//     // In a real app, this would trigger a wallet transaction
//     showToast("Withdrawal initiated. Please confirm the transaction in your wallet.", "info")

//     // Simulate a successful withdrawal after 2 seconds
//     setTimeout(() => {
//       showToast("Successfully withdrew ETH to your connected wallet!", "success")
//     }, 2000)
//   }

//   // Add the renderWalletsTab function
//   const renderWalletsTab = () => (
//     <div className="settings-form">
//       <h3 className="section-title">Your Wallets</h3>
//       <p className="section-description">Manage your wallets and transfer funds between them.</p>

//       <div className="wallets-container">
//         <div className="wallet-card">
//           <div className="wallet-header">
//             <h4>Saved Wallet</h4>
//             <span className="wallet-badge">Platform</span>
//           </div>
//           <div className="wallet-address">
//             {maskAddress(formData.wallets.saved.address)}
//             <button
//               className="copy-button"
//               onClick={() => handleCopyAddress(formData.wallets.saved.address)}
//               title="Copy address"
//             >
//               📋
//             </button>
//           </div>
//           <div className="wallet-balance">
//             <span className="balance-label">Balance:</span>
//             <span className="balance-value">{formData.wallets.saved.balance}</span>
//           </div>
//           <div className="wallet-description">
//             This is your platform wallet used for agent operations and fee collection.
//           </div>
//         </div>

//         <div className="wallet-card">
//           <div className="wallet-header">
//             <h4>Connected Wallet</h4>
//             <span className="wallet-badge active">Active</span>
//           </div>
//           <div className="wallet-address">
//             {maskAddress(formData.wallets.connected.address)}
//             <button
//               className="copy-button"
//               onClick={() => handleCopyAddress(formData.wallets.connected.address)}
//               title="Copy address"
//             >
//               📋
//             </button>
//           </div>
//           <div className="wallet-balance">
//             <span className="balance-label">Balance:</span>
//             <span className="balance-value">{formData.wallets.connected.balance}</span>
//           </div>
//           <div className="wallet-description">
//             This is your currently connected wallet used for authentication and transactions.
//           </div>
//         </div>
//       </div>

//       <div className="wallet-actions">
//         <div className="action-group">
//           <h4>Transfer Funds</h4>
//           <div className="transfer-actions">
//             <div className="transfer-action">
//               <label htmlFor="depositAmount">Deposit to Saved Wallet</label>
//               <div className="transfer-input-group">
//                 <input type="number" id="depositAmount" placeholder="0.00" min="0.01" step="0.01" />
//                 <span className="currency-label">ETH</span>
//                 <button className="transfer-button" onClick={handleDeposit}>
//                   Deposit
//                 </button>
//               </div>
//               <p className="transfer-description">Transfer ETH from your connected wallet to your platform wallet.</p>
//             </div>

//             <div className="transfer-action">
//               <label htmlFor="withdrawAmount">Withdraw to Connected Wallet</label>
//               <div className="transfer-input-group">
//                 <input type="number" id="withdrawAmount" placeholder="0.00" min="0.01" step="0.01" />
//                 <span className="currency-label">ETH</span>
//                 <button className="transfer-button" onClick={handleWithdraw}>
//                   Withdraw
//                 </button>
//               </div>
//               <p className="transfer-description">Transfer ETH from your platform wallet to your connected wallet.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   // Add the maskAddress helper function
//   const maskAddress = (address: string) => {
//     if (!address || address.length < 10) return address
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
//   }

//   const renderProfileTab = () => {
//     return (
//       <div className="settings-form">
//         <h3>Profile Settings</h3>
//         <p>This is where you can manage your profile information.</p>
//       </div>
//     )
//   }

//   const renderPreferencesTab = () => {
//     return (
//       <div className="settings-form">
//         <h3>Preferences</h3>
//         <p>This is where you can manage your preferences.</p>
//       </div>
//     )
//   }

//   const renderSecurityTab = () => {
//     return (
//       <div className="settings-form">
//         <h3>Security</h3>
//         <p>This is where you can manage your security settings.</p>
//       </div>
//     )
//   }

//   // Update the settings-tabs section to include the new Wallets tab
//   return (
//     <div className="settings-page">
//       <div className="settings-header">
//         <h1>Settings</h1>
//       </div>

//       <div className="settings-container">
//         <div className="settings-tabs">
//           <button
//             className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
//             onClick={() => setActiveTab("profile")}
//           >
//             Profile
//           </button>
//           <button
//             className={`tab-button ${activeTab === "wallets" ? "active" : ""}`}
//             onClick={() => setActiveTab("wallets")}
//           >
//             Wallets
//           </button>
//           <button
//             className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
//             onClick={() => setActiveTab("preferences")}
//           >
//             Preferences
//           </button>
//           <button
//             className={`tab-button ${activeTab === "security" ? "active" : ""}`}
//             onClick={() => setActiveTab("security")}
//           >
//             Security
//           </button>
//         </div>

//         <div className="settings-content">
//           {activeTab === "profile" && renderProfileTab()}
//           {activeTab === "wallets" && renderWalletsTab()}
//           {activeTab === "preferences" && renderPreferencesTab()}
//           {activeTab === "security" && renderSecurityTab()}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Settings

