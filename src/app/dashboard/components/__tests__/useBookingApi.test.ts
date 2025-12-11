import { renderHook } from '@testing-library/react'
import { useBookingApi } from '@/app/dashboard/components/_hooks/useBookingApi'
import { useBookingStore } from '@/stores/useBookingStore'

describe('useBookingApi', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    global.fetch = jest.fn()
    
    useBookingStore.setState({
      bookings: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalBookings: 0,
    })
  })

  it('should initialize without errors', () => {
    const { result } = renderHook(() => useBookingApi())
    
    expect(result.current).toHaveProperty('fetchBookings')
    expect(result.current).toHaveProperty('updateBooking')
    expect(result.current).toHaveProperty('approveBooking')
    expect(result.current).toHaveProperty('deleteBooking')
  })

  it('should have all required methods', () => {
    const { result } = renderHook(() => useBookingApi())
    
    expect(typeof result.current.fetchBookings).toBe('function')
    expect(typeof result.current.updateBooking).toBe('function')
    expect(typeof result.current.approveBooking).toBe('function')
    expect(typeof result.current.deleteBooking).toBe('function')
  })
})
