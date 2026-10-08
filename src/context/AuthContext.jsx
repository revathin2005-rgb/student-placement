/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { demoStudent } from '../data/sampleData'
import { safeRead, safeWrite, STORAGE_KEYS } from '../utils/storage'

const AuthContext = createContext(null)

const getInitialUser = () => safeRead(STORAGE_KEYS.user, null) || null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((email, password) => {
    if (email === demoStudent.email && password === demoStudent.password) {
      setUser({ ...demoStudent, password: undefined })
      safeWrite(STORAGE_KEYS.user, { ...demoStudent, password: undefined })
      return { success: true }
    }

    return { success: false, message: 'Invalid email or password.' }
  }, [])

  const register = useCallback((studentData) => {
    const existingUser = safeRead(STORAGE_KEYS.user, null)
    if (existingUser?.email === studentData.email) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    const profile = {
      ...studentData,
      id: crypto.randomUUID(),
      avatar: studentData.fullName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      resume: studentData.resume || 'No resume uploaded',
    }

    setUser(profile)
    safeWrite(STORAGE_KEYS.user, profile)
    safeWrite(STORAGE_KEYS.profile, profile)
    return { success: true }
  }, [])

  const updateProfile = useCallback((profileData) => {
    const nextProfile = { ...user, ...profileData }
    setUser(nextProfile)
    safeWrite(STORAGE_KEYS.user, nextProfile)
    safeWrite(STORAGE_KEYS.profile, nextProfile)
    return { success: true }
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    safeWrite(STORAGE_KEYS.user, null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, setIsLoading, login, register, updateProfile, logout }),
    [user, isLoading, login, register, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
