import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useReduxSelectors } from "../hooks/useReduxActions"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth } = useReduxSelectors()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

