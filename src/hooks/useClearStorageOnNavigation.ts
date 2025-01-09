import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { removeStorageItem } from '@/lib/storage'

export function useClearStorageOnNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/results') return

    // Function to handle cleanup when navigating away from results
    const handleCleanup = () => {
      removeStorageItem("JOB_DATA")
      removeStorageItem("ANALYSIS_RESULTS")
    }

    // Create a custom event for navigation
    const handleBeforeNavigate = (url: string) => {
      if (!url.includes('/results')) {
        handleCleanup()
      }
    }

    // Add event listener for beforeunload (closing tab/window)
    window.addEventListener('beforeunload', handleCleanup)

    // Subscribe to router events
    const unsubscribe = (router as any).events?.on('routeChangeStart', handleBeforeNavigate)

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleCleanup)
      if (unsubscribe) unsubscribe()
    }
  }, [pathname, router])
}
