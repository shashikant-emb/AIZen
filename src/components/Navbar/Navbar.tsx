import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import useWalletTransactions from "../../hooks/useWalletTransactions";
import { withdraw } from "viem/zksync";
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions";
import { formatUserName } from "../../utils/formatUserName";
import { useBalance } from "wagmi";
import { useToast } from "../Toast/Toast";

const Navbar: React.FC = () => {
    const { showToast } = useToast()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { isConnected, address, handleDisconnect,disconnect } = useWalletAuth();
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


  const fetchBalance = async (wallet: string | null): Promise<number> => {
    if (!wallet) return 0;
    const res = await auth.walletBalance(wallet);
    return res?.payload?.wallet_balance || 0;
  };
  

  // const handleDeposit = () => {
  //   setProcessing(true);
  //   depositETH(amount.toString()).then(()=>{
  //     setProcessing(false);
  //     setShowDepositInput(false);
  //     setAmount("");
  //   })
  // };
  const handleDeposit = async () => {
    if (!isConnected) {
      showToast("Please connect the wallet first", "error");
      return;
    } else if (!amount || Number(amount) <= 0) {
      showToast("Please enter a valid amount", "warning");
      return;
    }
  
    showToast("Deposit initiated. Please confirm the transaction in your wallet.", "info");
    setProcessing(true);
  
    try {
      const initialSavedBalance = await fetchBalance(backendWallet);
  
      const tx = await depositETH(amount.toString());
  
      await tx.wait?.();
  
      setAmount("");
  
      const pollInterval = 2000;
      const maxRetries = 10;
      let retries = 0;
  
      const pollForBalanceUpdate = async () => {
        const newBalance = await fetchBalance(backendWallet);
        if (newBalance !== initialSavedBalance) {
          setSavedWalletbalance(newBalance);
          showToast("Deposit successful!", "success");
          return;
        }
  
        if (retries < maxRetries) {
          retries++;
          setTimeout(pollForBalanceUpdate, pollInterval);
        } else {
          showToast("Deposit complete, but balance update delayed.", "info");
          // getBalances(); // Fallback
        }
      };
  
      pollForBalanceUpdate();
  
    } catch (error) {
      console.error("Deposit failed:", error);
      showToast("Deposit failed. Try again.", "error");
    } finally {
      setProcessing(false);
      setShowDepositInput(false);
    }
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
        setShowDepositInput(false);
        setShowWithdrawInput(false);
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

  const { openConnectModal } = useConnectModal();
  const handleAgentBuilderClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    if (!isConnected) {
      showToast("Please connect your wallet to use Agent Builder", "warning");
      if (openConnectModal) openConnectModal();
      return;
    }
  
    // ✅ Only open the new tab if wallet is connected
    window.open("/agent-builder", "_blank", "noopener,noreferrer");
  };

  const handleLogout = () => {
    auth.logout()
    disconnect()
    // navigate("/login")
  }

  const handleSettingsClick = () => {
    navigate("/wallets")
    setIsProfileOpen(false)
  }
  useEffect(() => {
    if (!isConnected) {
      handleLogout();
    }
  }, [isConnected]);

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
        {/* <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link> */}
        <Link
          to="/marketplace"
          className={`nav-link ${isActive("/marketplace")}`}
        >
          Marketplace
        </Link>
      {isAuthenticated  &&  <Link to="/commissioned-agents" className={`nav-link ${isActive("/commissioned-agents")}`}>
          My Commissions
        </Link>}
        {/* <Link to="/agent-builder" className={`nav-link ${isActive("/agent-builder")}`}>
          Agent Builder
        </Link> */}
        {/* <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link> */}
        {/* <Link to="/agent-builder" className={`nav-link agent-builder-link ${isActive("/agent-builder")}`}>
             Agent Builder <span className="badge">NEW</span>
        </Link> */}
        {/* <a
          href="/agent-builder"
          target="_blank"
          rel="noopener noreferrer"
          className={`nav-link agent-builder-link ${isActive(
            "/agent-builder"
          )}`}
        >
          Agent Builder <span className="badge">NEW</span>
        </a> */}
        <a
  href="/agent-builder"
  onClick={handleAgentBuilderClick}
  className={`nav-link agent-builder-link ${isActive("/agent-builder")}`}
>
  Agent Builder <span className="badge">NEW</span>
</a>
      </div>

      <div className="navbar-actions">
        {/* <Link to="/agent-builder" className={`nav-link agent-builder-link ${isActive("/agent-builder")}`}>
             Agent Builder <span className="badge">NEW</span>
        </Link> */}
        <ConnectButton accountStatus="avatar" showBalance={false} />
        {typeof savedWalletBalance !== "undefined" && isConnected && (
          <div className="backend-wallet-balance">
            <span>{Number(savedWalletBalance).toFixed(8)} ETH</span>
          </div>
        )}
        {/* <div className="user-info" onClick={() => setShowUserModal(true)}>
          <div className="user-avatar">
            {formatUserName(userProfile?.name )|| ""}
            </div>
        </div> */}

        <div className="user-profile-container" ref={profileRef}>
          {isAuthenticated && (
            <div
              className="user-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {/* {getUserInitials()} */}
              👤
            </div>
          )}

          {isProfileOpen && isAuthenticated && (
            <div className="profile-dropdown">
              {/* <div className="profile-header">
                <h3>{userProfile?.name || "User"}</h3>
                <p className="profile-email">{userProfile?.email || "user@example.com"}</p>
              </div> */}

              {/* <div className="profile-wallet">
                <span className="wallet-label">Wallet Balance:</span>
                <span className="wallet-balance">{savedWalletBalance ? `${Number(savedWalletBalance).toFixed(6)} ETH` : "0.0000 ETH"}</span>
              </div> */}

              <div className="profile-actions">
                <button
                  className="profile-action-button"
                  onClick={handleSettingsClick}
                >
                  <span className="action-icon">⚙️</span>
                  Wallets
                </button>
                <button
                  className="profile-action-button"
                  onClick={() => setShowDepositInput(!showDepositInput)}
                >
                  <span className="action-icon">💰</span>
                  Deposit
                </button>

                {showDepositInput &&  (
                  <div className="transaction-input">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={processing || progress}
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={processing || progress}
                    >
                      {processing || progress ? "Processing..." : "Submit"}
                    </button>
                  </div>
                )}
                <button
                  className="profile-action-button logout-button"
                  onClick={handleLogout}
                >
                  <span className="action-icon">🚪</span>
                  Disconnect
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
            <button
              className="close-button"
              onClick={() => setShowUserModal(false)}
            >
              ×
            </button>
            <div className="user-avatar-large">
              {" "}
              {formatUserName(userProfile?.name) || ""}
            </div>
            <p className="user-email">{userProfile?.email || ""}</p>

            {progress ? (
              <p>Processing transaction...</p>
            ) : (
              <>
                <button
                  className="user-action-button deposit"
                  onClick={() => setShowDepositInput(!showDepositInput)}
                >
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

                <button
                  className="user-action-button withdraw"
                  onClick={() => setShowWithdrawInput(!showWithdrawInput)}
                >
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
