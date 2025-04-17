// import React from "react"
// import { Navigate, useLocation } from "react-router-dom"
// import { useReduxSelectors } from "../hooks/useReduxActions"
// import { useToast } from "./Toast/Toast"

// interface ProtectedRouteProps {
//   children: React.ReactNode
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//     const { showToast } = useToast()
//   const { auth } = useReduxSelectors()
//   const location = useLocation()

//   if (!auth.isAuthenticated) {
//     // Redirect to login page but save the location they were trying to access
//     showToast("Please connect the wallet first to access this page", "warning")
//     // return <Navigate to="/login" state={{ from: location }} replace />
//   }

//   return <>{children}</>
// }

// export default ProtectedRoute

// import React, { useEffect } from "react"
// import { Navigate, useLocation } from "react-router-dom"
// import { useReduxSelectors } from "../hooks/useReduxActions"
// import { useToast } from "./Toast/Toast"

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   redirectTo?: string // optional custom redirect path
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/" }) => {
//   const { showToast } = useToast()
//   const { auth } = useReduxSelectors()
//   const location = useLocation()

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       showToast("Please connect your wallet to access this page", "warning")
//     }
//   }, [auth.isAuthenticated, showToast])

//   if (!auth.isAuthenticated) {
//     return <Navigate to={redirectTo} state={{ from: location }} replace />
//   }

//   return <>{children}</>
// }

// export default ProtectedRoute

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useReduxSelectors } from "../hooks/useReduxActions";
import { useToast } from "./Toast/Toast";
import { useConnectModal } from "@rainbow-me/rainbowkit"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/" }) => {
  const { showToast } = useToast();
  const { auth } = useReduxSelectors();
  const location = useLocation();
  const { openConnectModal } = useConnectModal(); 

  useEffect(() => {
    if (!auth.isAuthenticated) {
      showToast("Please connect your wallet to access this page", "warning");

      // ✅ Trigger the wallet connect modal
      if (openConnectModal) {
        openConnectModal();
      }
    }
  }, [auth.isAuthenticated, showToast, openConnectModal]);

  if (!auth.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


// "use client"

// import React from "react"

// import { useState, type ReactNode } from "react"
// import { useLocation } from "react-router-dom"
// import { useReduxSelectors } from "../hooks/useReduxActions"
// import ConnectWalletModal from "./Auth/ConnectWalletModal"

// interface ProtectedRouteProps {
//   children: ReactNode
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { auth } = useReduxSelectors()
//   const location = useLocation()
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   if (!auth.isAuthenticated) {
//     // Show the connect wallet modal instead of redirecting
//     return (
//       <>
//         {/* Show the children component in the background */}
//         <div style={{ filter: "blur(4px)" }}>{children}</div>

//         {/* Show the connect wallet modal */}
//         <ConnectWalletModal isOpen={true} onClose={() => setIsModalOpen(false)} />
//       </>
//     )
//   }

//   return <>{children}</>
// }

// export default ProtectedRoute