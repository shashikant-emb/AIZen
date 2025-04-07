// import { Link, useLocation, useNavigate} from "react-router-dom"
// import  React, { useEffect, useState } from "react"
// import "./Navbar.css"
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAccount, useBalance,useSignMessage } from "wagmi";
// import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions";
// import { useWalletAuth } from "../../hooks/useWalletAuth";
// import useWalletTransactions from "../../hooks/useWalletTransactions";

// const Navbar: React.FC = () => {
//   const { isConnected, address, handleDisconnect } = useWalletAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isActive = (path: any) => (location.pathname === path ? "active" : "");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const { depositETH, withdrawETH } = useWalletTransactions();
//   return (
//     <nav className="navbar">
//       <div className="navbar-logo" onClick={() => navigate("/")}>
//         <div className="logo-icon" >
//           <div className="logo-square"></div>
//         </div>
//         <h1>AIZen</h1>
//       </div>
//        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//          ☰
//        </button>

//        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/" className={`nav-link ${isActive("/")}`}>
//           Home
//         </Link>
//         <Link to="/marketplace" className={`nav-link ${isActive("/marketplace")}`}>
//           Marketplace
//         </Link>
//         <Link to="/agent-builder" className={`nav-link ${isActive("/agent-builder")}`}>
//           Agent Builder
//         </Link>
//         {/* <Link to="/lp-dashboard" className={`nav-link ${isActive("/lp-dashboard")}`}>
//           LP Dashboard
//         </Link> */}
//         <Link to="/about" className={`nav-link ${isActive("/about")}`}>
//           About
//         </Link>
//       </div>

//       <div className="navbar-actions">
//         <ConnectButton accountStatus="avatar" />
//         <div className="user-info" onClick={() => setShowUserModal(true)}>
//           <div className="user-avatar">JC</div>
//         </div>
//       </div>
//       {showUserModal && (
//         <div className="user-modal">
//           <div className="user-modal-content">
//             <button className="close-button" onClick={() => setShowUserModal(false)}>
//               ×
//             </button>
//             <div className="user-avatar-large">JC</div>
//             <p className="user-email">user@example.com</p>
//             <button className="user-action-button"  onClick={() => depositETH("0.01")} >Deposit</button>
//             <button className="user-action-button"  onClick={() => withdrawETH("0.01")}>Withdraw</button> 
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }
// export default Navbar
 {/* <button className="gradient-button" onClick={() => depositETH("0.01")}>Deposit</button>
            <button className="gradient-button" onClick={() => withdrawETH("0.01")}>Withdraw</button> */}



import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import useWalletTransactions from "../../hooks/useWalletTransactions";
import { withdraw } from "viem/zksync";
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions";
import { formatUserName } from "../../utils/formatUserName";
import { useBalance } from "wagmi";

const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { isConnected, address, handleDisconnect } = useWalletAuth();
  const { auth } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, loading, error,userProfile } = authSelectors
  const backendWallet = localStorage.getItem("wallet_address");
  // const { data: savedBalance, refetch: refetchSavedBalance } = useBalance({ address: backendWallet});

  const [savedWalletBalance,setSavedWalletbalance] =useState(0) 
  useEffect(()=>{
    if(backendWallet){
      auth.walletBalance(backendWallet).then((res)=>{
        setSavedWalletbalance(res?.payload?.wallet_balance)
      })
    }
  },[isAuthenticated])
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: any) => (location.pathname === path ? "active" : "");

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);


  const { depositETH, withdrawETH ,progress} = useWalletTransactions();
  const [showDepositInput, setShowDepositInput] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleDeposit = () => {
    setProcessing(true);
    depositETH(amount.toString()).then(()=>{
      setProcessing(false);
      setShowDepositInput(false);
      setAmount("");
    })
  };

  const handleWithdraw = () => {
    setProcessing(true);
    withdrawETH(amount.toString()).then(()=>{
      setProcessing(false);
      setShowWithdrawInput(false);
      setAmount("");
    })
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile || !userProfile.name) return "U"

    const nameParts = userProfile.name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0].substring(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    auth.logout()
    navigate("/login")
  }

  const handleSettingsClick = () => {
    navigate("/settings")
    setIsProfileOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}> 
        <div className="logo-icon">
          <div className="logo-square"></div>
        </div>
        <h1>AIZen</h1>
      </div>
      {/* <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button> */}

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
        <Link to="/marketplace" className={`nav-link ${isActive("/marketplace")}`}>
          Marketplace
        </Link>
        <Link to="/agent-builder" className={`nav-link ${isActive("/agent-builder")}`}>
          Agent Builder
        </Link>
        <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link>
      </div>

      <div className="navbar-actions">
        <ConnectButton accountStatus="avatar" />
        {/* <div className="user-info" onClick={() => setShowUserModal(true)}>
          <div className="user-avatar">
            {formatUserName(userProfile?.name )|| ""}
            </div>
        </div> */}

       <div className="user-profile-container" ref={profileRef}>
          {isAuthenticated && <div className="user-avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            {getUserInitials()}
          </div>}

          {isProfileOpen && isAuthenticated && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <h3>{userProfile?.name || "User"}</h3>
                <p className="profile-email">{userProfile?.email || "user@example.com"}</p>
              </div>

              <div className="profile-wallet">
                <span className="wallet-label">Wallet Balance:</span>
                <span className="wallet-balance">{savedWalletBalance ? `${Number(savedWalletBalance).toFixed(4)} ETH` : "0.0000 ETH"}</span>
              </div>

              <div className="profile-actions">
                <button className="profile-action-button" onClick={handleSettingsClick}>
                  <span className="action-icon">⚙️</span>
                  Settings
                </button>
                <button className="profile-action-button logout-button" onClick={handleLogout}>
                  <span className="action-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="user-modal">
          <div className="user-modal-content">
            <button className="close-button" onClick={() => setShowUserModal(false)}>
              ×
            </button>
            <div className="user-avatar-large"> {formatUserName(userProfile?.name )|| ""}</div>
            <p className="user-email">{userProfile?.email||""}</p>
            
            {progress ? (
              <p>Processing transaction...</p>
            ) : (
              <>
                <button className="user-action-button deposit" onClick={() => setShowDepositInput(!showDepositInput)}>
                  Deposit
                </button>
                {showDepositInput && (
                  <div className="transaction-input">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={handleDeposit}>Submit</button>
                  </div>
                )}

                <button className="user-action-button withdraw" onClick={() => setShowWithdrawInput(!showWithdrawInput)}>
                  Withdraw
                </button>
                {showWithdrawInput && (
                  <div className="transaction-input">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={handleWithdraw}>Submit</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
       <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;




// "use client"

// import { Link, useLocation, useNavigate } from "react-router-dom"
// import { useState, useRef, useEffect } from "react"
// import React from "react"
// import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
// import "./Nav.css"
// import { useBalance } from "wagmi"

// const Navbar: React.FC = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const [isProfileOpen, setIsProfileOpen] = useState(false)
//   const profileRef = useRef<HTMLDivElement>(null)

//   const { auth } = useReduxActions()
//   const { auth: authSelectors } = useReduxSelectors()
//   const { userProfile, walletBalance } = authSelectors
//   const backendWallet = localStorage.getItem("wallet_address") as `0x${string}`;
//   const { data: savedBalance, refetch: refetchSavedBalance } = useBalance({ address: backendWallet });
//   const savedWalletBalance = savedBalance?.formatted

//   const isActive = (path: string) => {
//     return location.pathname === path ? "active" : ""
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
//         setIsProfileOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (!userProfile || !userProfile.name) return "U"

//     const nameParts = userProfile.name.split(" ")
//     if (nameParts.length >= 2) {
//       return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
//     }
//     return nameParts[0].substring(0, 2).toUpperCase()
//   }

//   const handleLogout = () => {
//     auth.logout()
//     navigate("/login")
//   }

//   const handleSettingsClick = () => {
//     navigate("/settings")
//     setIsProfileOpen(false)
//   }

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <div className="logo-icon">
//           <div className="logo-square"></div>
//         </div>
//         <h1>AIGen</h1>
//       </div>

//       <div className="navbar-links">
//         <Link to="/home" className={`nav-link ${isActive("/home")}`}>
//           Home
//         </Link>
//         <Link to="/marketplace" className={`nav-link ${isActive("/marketplace")}`}>
//           Marketplace
//         </Link>
//         <Link to="/agent-builder" className={`nav-link ${isActive("/agent-builder")}`}>
//           Agent Builder
//         </Link>
//         {/* <Link to="/lp-dashboard" className={`nav-link ${isActive("/lp-dashboard")}`}>
//           LP Dashboard
//         </Link> */}
//         <Link to="/about" className={`nav-link ${isActive("/about")}`}>
//           About
//         </Link>
//       </div>

//       <div className="navbar-actions">
//         <button className="gradient-button">
//           <span className="wallet-icon">□</span>
//           Connect Wallet
//         </button>

//         <div className="user-profile-container" ref={profileRef}>
//           <div className="user-avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
//             {getUserInitials()}
//           </div>

//           {isProfileOpen && (
//             <div className="profile-dropdown">
//               <div className="profile-header">
//                 <h3>{userProfile?.name || "User"}</h3>
//                 <p className="profile-email">{userProfile?.email || "user@example.com"}</p>
//               </div>

//               <div className="profile-wallet">
//                 <span className="wallet-label">Wallet Balance:</span>
//                 <span className="wallet-balance">{savedWalletBalance ? `${Number(savedWalletBalance).toFixed(4)} ETH` : "0.0000 ETH"}</span>
//               </div>

//               <div className="profile-actions">
//                 <button className="profile-action-button" onClick={handleSettingsClick}>
//                   <span className="action-icon">⚙️</span>
//                   Settings
//                 </button>
//                 <button className="profile-action-button logout-button" onClick={handleLogout}>
//                   <span className="action-icon">🚪</span>
//                   Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar

