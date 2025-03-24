// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <div className="logo-icon">
//           <div className="logo-square"></div>
//         </div>
//         <h1>AIZen</h1>
//       </div>

//       {/* Mobile Menu Button */}
//       <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//         ☰
//       </button>

//       <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/marketplace" className="nav-link">
//           Home
//         </Link>
//         <Link to="/marketplace" className="nav-link active">
//           Marketplace
//         </Link>
//         <Link to="/agent-builder" className="nav-link">
//           Agent Builder
//         </Link>
//         <Link to="/marketplace" className="nav-link">
//           LP Dashboard
//         </Link>
//         <Link to="/marketplace" className="nav-link">
//           About
//         </Link>
//       </div>

//       <div className="navbar-actions">
//         <button className="gradient-button">
//           <span className="wallet-icon">□</span>
//           Connect Wallet
//         </button>
//         {/* <div className="avatar"></div> */}
//         <div className>
//           <div className="user-avatar">JC</div>
//           {/* <span>Jane Creator</span> */}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <div className="logo-icon">
//           <div className="logo-square"></div>
//         </div>
//         <h1>AIZen</h1>
//       </div>

//       {/* Mobile Menu Button */}
//       <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//         ☰
//       </button>

//       <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/home" className="nav-link">
//           Home
//         </Link>
//         <Link to="/marketplace" className="nav-link active">
//           Marketplace
//         </Link>
//         <Link to="/agent-builder" className="nav-link">
//           Agent Builder
//         </Link>
//         <Link to="/lp-dashboard" className="nav-link">
//           LP Dashboard
//         </Link>
//         <Link to="/about" className="nav-link">
//           About
//         </Link>
//       </div>

//       <div className="navbar-actions">
//         <button className="gradient-button">
//           <span className="wallet-icon">□</span>
//           Connect Wallet
//         </button>
//         <div className="user-avatar">JC</div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useLocation, useNavigate} from "react-router-dom"
import  React, { useEffect, useState } from "react"
import "./Navbar.css"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance,useSignMessage } from "wagmi";
import { useReduxActions } from "../../hooks/useReduxActions";


const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }
  // const { auth } = useReduxActions()
  //   const { address, isConnected } = useAccount();
  //   const [signature, setSignature] = useState("");
  // const { data: balance } = useBalance({ address });
  // console.log("address",address)
  // console.log('balance',`${balance?.formatted} ${balance?.symbol}`)

  // const { signMessage } = useSignMessage({
  //   onSuccess(data) {
  //     console.log("✅ Signature Received:", data);
  //     setSignature(data);
  
  //     if (address) {
  //       console.log("🚀 Sending API Request with:", {
  //         wallet_address: address,
  //         signature: data,
  //       });
  
  //       auth.connectWallet({
  //         wallet_address: address,
  //         signature: data,
  //         message: "Sign this message to authenticate. Nonce: 123456",
  //       })
  //         .then((response) => console.log("✅ API Response:", response))
  //         .catch((error) => console.error("❌ API Error:", error));
  //     }
  //   },
  //   onError(error) {
  //     console.error("❌ Signing Failed:", error);
  //   },
  // });
  
 
  

  // useEffect(() => {
  //   if (isConnected && address && !signature) {
  //     signMessage();
  //   }
  // }, [isConnected, address]);

  // useEffect(() => {
  //   if (isConnected && address && !signature) {
  //     const message = `Sign this message to verify your identity: ${address}`;
  //     signMessage({ message }); // Pass the message here explicitly
  //   }
  //   console.log("Wallet Connected:", isConnected);
  // }, [isConnected, address]);
  

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <div className="logo-icon" >
          <div className="logo-square"></div>
        </div>
        <h1>AIZen</h1>
      </div>
       <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
         ☰
       </button>

       <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/")}`}>
          Home
        </Link>
        <Link to="/marketplace" className={`nav-link ${isActive("/marketplace")}`}>
          Marketplace
        </Link>
        <Link to="/agent-builder" className={`nav-link ${isActive("/agent-builder")}`}>
          Agent Builder
        </Link>
        {/* <Link to="/lp-dashboard" className={`nav-link ${isActive("/lp-dashboard")}`}>
          LP Dashboard
        </Link> */}
        <Link to="/about" className={`nav-link ${isActive("/about")}`}>
          About
        </Link>
      </div>

      <div className="navbar-actions">
        <ConnectButton accountStatus="avatar" />
        <div className="user-info">
          <div className="user-avatar">JC</div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar