import { renderHook } from '@testing-library/react'
import { useAuthStore } from '@/stores/useAuthStore'

// Mock the API module
jest.mock('@/lib/api', () => ({
  apiFetch: jest.fn(),
  setAuthToken: jest.fn(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    useAuthStore.setState({
      user: null,
      token: null,
      loading: false,
      error: null,
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should have required auth methods', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(typeof result.current.signIn).toBe('function')
    expect(typeof result.current.signOut).toBe('function')
    expect(typeof result.current.restoreSession).toBe('function')
    expect(typeof result.current.updateProfile).toBe('function')
    expect(typeof result.current.updatePassword).toBe('function')
  })
})
