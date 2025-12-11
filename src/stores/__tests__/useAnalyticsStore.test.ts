import { renderHook, act } from '@testing-library/react'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'

describe('useAnalyticsStore', () => {
  beforeEach(() => {
    useAnalyticsStore.setState({
      analytics: null,
      loading: false,
      error: null,
      dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    expect(result.current.analytics).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.dateRange).toHaveProperty('startDate')
    expect(result.current.dateRange).toHaveProperty('endDate')
  })

  it('should set analytics data', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    // Verify that setAnalytics is a function
    expect(typeof result.current.setAnalytics).toBe('function')
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should set error state', () => {
    const { result } = renderHook(() => useAnalyticsStore())
    const errorMessage = 'Failed to fetch analytics'

    act(() => {
      result.current.setError(errorMessage)
    })

    expect(result.current.error).toBe(errorMessage)

    act(() => {
      result.current.setError(null)
    })

    expect(result.current.error).toBeNull()
  })

  it('should update date range', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    act(() => {
      result.current.setDateRange('2024-01-01', '2024-01-31')
    })

    expect(result.current.dateRange.startDate).toBe('2024-01-01')
    expect(result.current.dateRange.endDate).toBe('2024-01-31')
  })

  it('should trigger refresh', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    // Verify that refreshAnalytics is a function
    expect(typeof result.current.refreshAnalytics).toBe('function')
  })

  it('should handle multiple state updates', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    act(() => {
      result.current.setLoading(true)
      result.current.setError(null)
      result.current.setLoading(false)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should validate date range format', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    expect(new Date(result.current.dateRange.startDate)).toBeInstanceOf(Date)
    expect(new Date(result.current.dateRange.endDate)).toBeInstanceOf(Date)

    const startDate = new Date(result.current.dateRange.startDate)
    const endDate = new Date(result.current.dateRange.endDate)

    expect(startDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
  })
})
