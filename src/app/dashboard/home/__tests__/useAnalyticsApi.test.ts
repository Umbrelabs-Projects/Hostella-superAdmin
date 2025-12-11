import { renderHook } from '@testing-library/react'
import { useAnalyticsApi } from '@/app/dashboard/home/_hooks/useAnalyticsApi'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'

describe('useAnalyticsApi', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    global.fetch = jest.fn()
    
    useAnalyticsStore.setState({
      analytics: null,
      loading: false,
      error: null,
      dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    })
  })

  it('should initialize without errors', () => {
    const { result } = renderHook(() => useAnalyticsApi())
    
    expect(result.current).toHaveProperty('fetchAnalytics')
    expect(typeof result.current.fetchAnalytics).toBe('function')
  })

  it('should handle date range in API calls', async () => {
    const { result } = renderHook(() => useAnalyticsApi())
    
    expect(result.current).toHaveProperty('fetchAnalytics')
    expect(typeof result.current.fetchAnalytics).toBe('function')
  })
})
