import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/components/auth/AuthContext"

interface Props {
  children: JSX.Element
}

export const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}