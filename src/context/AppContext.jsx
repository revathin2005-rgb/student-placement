/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  applicationStatuses,
  companies,
  jobs,
  notifications,
  sampleApplications,
  interviews,
} from '../data/sampleData'
import { safeRead, safeWrite, STORAGE_KEYS } from '../utils/storage'

const AppContext = createContext(null)

const getInitialTheme = () => safeRead(STORAGE_KEYS.theme, 'light')
const getInitialStoredApplications = () => safeRead(STORAGE_KEYS.applications, sampleApplications)
const getInitialStoredNotifications = () => safeRead(STORAGE_KEYS.notifications, notifications)
const getInitialStoredJobs = () => safeRead(STORAGE_KEYS.jobs, jobs)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [jobsList, setJobsList] = useState(getInitialStoredJobs)
  const [applications, setApplications] = useState(getInitialStoredApplications)
  const [notificationsList, setNotificationsList] = useState(getInitialStoredNotifications)
  const [companyList] = useState(companies)
  const [interviewList] = useState(interviews)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeWrite(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    safeWrite(STORAGE_KEYS.applications, applications)
  }, [applications])

  useEffect(() => {
    safeWrite(STORAGE_KEYS.notifications, notificationsList)
  }, [notificationsList])

  useEffect(() => {
    safeWrite(STORAGE_KEYS.jobs, jobsList)
  }, [jobsList])

  const addApplication = useCallback((applicationData) => {
    const exists = applications.some(
      (application) => application.jobId === applicationData.jobId,
    )

    if (exists) {
      return { success: false, message: 'You have already applied for this opportunity.' }
    }

    const newApplication = {
      id: crypto.randomUUID(),
      jobId: applicationData.jobId,
      company: applicationData.company,
      jobRole: applicationData.jobTitle,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Applied',
      interviewDate: '',
      interviewMode: '',
      interviewer: '',
    }

    setApplications((current) => [newApplication, ...current])
    setNotificationsList((current) => [
      {
        id: crypto.randomUUID(),
        title: `Your application for ${applicationData.company} ${applicationData.jobTitle} has been received.`,
        category: 'Company Update',
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...current,
    ])

    return { success: true }
  }, [applications])

  const markNotificationRead = useCallback((notificationId) => {
    setNotificationsList((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotificationsList((current) => current.map((notification) => ({ ...notification, read: true })))
  }, [])

  const deleteNotification = useCallback((notificationId) => {
    setNotificationsList((current) => current.filter((notification) => notification.id !== notificationId))
  }, [])

  const toggleTheme = useCallback(() => setTheme((current) => (current === 'light' ? 'dark' : 'light')), [])

  const value = useMemo(
    () => ({
      theme,
      jobsList,
      applications,
      notificationsList,
      companyList,
      interviewList,
      applicationStatuses,
      setApplications,
      setJobsList,
      addApplication,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      toggleTheme,
    }),
    [addApplication, applications, companyList, interviewList, jobsList, markAllNotificationsRead, markNotificationRead, notificationsList, theme, toggleTheme, deleteNotification],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
