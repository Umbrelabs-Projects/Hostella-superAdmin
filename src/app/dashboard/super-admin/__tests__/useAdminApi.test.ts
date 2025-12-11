import { renderHook } from '@testing-library/react'
import { useAdminApi } from '@/app/dashboard/super-admin/_hooks/useAdminApi'
import { useAdminStore } from '@/stores/useAdminStore'

describe('useAdminApi', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    global.fetch = jest.fn()
    
    useAdminStore.setState({
      admins: [],
      hostels: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalAdmins: 0,
      searchQuery: '',
      roleFilter: undefined,
      statusFilter: undefined,
    })
  })

  it('should initialize without errors', () => {
    const { result } = renderHook(() => useAdminApi())
    
    expect(result.current).toHaveProperty('fetchAdmins')
    expect(result.current).toHaveProperty('createAdmin')
    expect(result.current).toHaveProperty('updateAdmin')
    expect(result.current).toHaveProperty('deleteAdmin')
    expect(result.current).toHaveProperty('fetchHostels')
  })

  it('should have all required methods', () => {
    const { result } = renderHook(() => useAdminApi())
    
    expect(typeof result.current.fetchAdmins).toBe('function')
    expect(typeof result.current.createAdmin).toBe('function')
    expect(typeof result.current.updateAdmin).toBe('function')
    expect(typeof result.current.deleteAdmin).toBe('function')
    expect(typeof result.current.fetchHostels).toBe('function')
  })

  it('should pass search and filter parameters to API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          admins: [],
          total: 0,
        }),
      })
    ) as jest.Mock

    const { result } = renderHook(() => useAdminApi())
    
    await result.current.fetchAdmins(1, 10, 'search', 'super-admin', 'active')

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const url = callArgs[0]
    expect(url).toContain('search')
    expect(url).toContain('admin')
    expect(url).toContain('active')
  })
})
