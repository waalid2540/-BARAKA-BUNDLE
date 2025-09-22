import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  hasPaid: boolean
  stripeCustomerId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  checkPaymentStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('barakah_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simple authentication - in production, this should call a real API
    const mockUser: User = {
      id: Math.random().toString(36),
      email,
      name: email.split('@')[0],
      hasPaid: false
    }

    setUser(mockUser)
    localStorage.setItem('barakah_user', JSON.stringify(mockUser))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Simple registration - in production, this should call a real API
    const mockUser: User = {
      id: Math.random().toString(36),
      email,
      name,
      hasPaid: false
    }

    setUser(mockUser)
    localStorage.setItem('barakah_user', JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('barakah_user')
    localStorage.removeItem('barakah_payment_session')
  }

  const checkPaymentStatus = async (): Promise<boolean> => {
    // Check if user has paid - this should call a real API in production
    const paymentSession = localStorage.getItem('barakah_payment_session')
    if (paymentSession && user) {
      const updatedUser = { ...user, hasPaid: true }
      setUser(updatedUser)
      localStorage.setItem('barakah_user', JSON.stringify(updatedUser))
      return true
    }
    return user?.hasPaid || false
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, checkPaymentStatus }}>
      {children}
    </AuthContext.Provider>
  )
}