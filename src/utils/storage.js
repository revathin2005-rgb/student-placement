export const STORAGE_KEYS = {
  user: 'studentPlacementUser',
  profile: 'studentPlacementProfile',
  applications: 'studentPlacementApplications',
  notifications: 'studentPlacementNotifications',
  theme: 'studentPlacementTheme',
  jobs: 'studentPlacementJobs',
}

export function safeRead(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
