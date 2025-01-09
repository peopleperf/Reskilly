type StorageKey = "JOB_DATA" | "ANALYSIS_RESULTS" | "JOB_TITLE" | "ANALYSIS_ERROR"

export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    // Silently fail if storage is not available
    return
  }
}

export function getStorageItem<T>(key: StorageKey): T | null {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    // Silently fail if storage is not available
    return null
  }
}

export function removeStorageItem(key: StorageKey): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    // Silently fail if storage is not available
    return
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.clear()
  } catch (error) {
    // Silently fail if storage is not available
    return
  }
}