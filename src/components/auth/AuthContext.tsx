import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("omnisent-auth")
    if (stored === "true") setIsAuthenticated(true)
  }, [])

  const login = () => {
    setIsAuthenticated(true)
    localStorage.setItem("omnisent-auth", "true")
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("omnisent-auth")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)