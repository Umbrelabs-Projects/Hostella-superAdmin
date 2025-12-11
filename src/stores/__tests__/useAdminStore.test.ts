import { renderHook, act } from '@testing-library/react'
import { useAdminStore } from '@/stores/useAdminStore'
import { Admin, Hostel } from '@/types/admin'

describe('useAdminStore', () => {
  const mockAdmin: Admin = {
    id: '1',
    firstName: 'Admin',
    lastName: 'One',
    email: 'admin1@example.com',
    phone: '+1234567890',
    role: 'super-admin',
    status: 'active',
    assignedHostelId: 'hostel1',
    assignedHostelName: 'Hostel 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockHostel: Hostel = {
    id: 'hostel1',
    name: 'Hostel 1',
    location: 'Campus',
    capacity: 50,
    hasAdmin: false,
  }

  beforeEach(() => {
    useAdminStore.setState({
      admins: [],
      hostels: [],
      selectedAdmin: null,
      loading: false,
      error: null,
      success: null,
      currentPage: 1,
      pageSize: 10,
      totalAdmins: 0,
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'all',
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAdminStore())

    expect(result.current.admins).toEqual([])
    expect(result.current.hostels).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.currentPage).toBe(1)
  })

  it('should set admins list', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setAdmins([mockAdmin])
    })

    expect(result.current.admins).toEqual([mockAdmin])
  })

  it('should add admin to list', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.addAdmin(mockAdmin)
    })

    expect(result.current.admins).toContainEqual(mockAdmin)
  })

  it('should update admin in list', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.addAdmin(mockAdmin)
    })

    const updatedAdmin: Admin = { ...mockAdmin, firstName: 'Updated' }
    act(() => {
      result.current.updateAdmin(updatedAdmin)
    })

    const stored = result.current.admins.find((a: Admin) => a.id === '1')
    expect(stored?.firstName).toBe('Updated')
  })

  it('should remove admin from list', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.addAdmin(mockAdmin)
    })

    expect(result.current.admins).toHaveLength(1)

    act(() => {
      result.current.removeAdmin('1')
    })

    expect(result.current.admins).toHaveLength(0)
  })

  it('should update pagination state', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setCurrentPage(2)
      result.current.setPageSize(20)
      result.current.setTotalAdmins(100)
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.pageSize).toBe(20)
    expect(result.current.totalAdmins).toBe(100)
  })

  it('should set search query', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setSearchQuery('john')
    })

    expect(result.current.searchQuery).toBe('john')
  })

  it('should set role filter', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setRoleFilter('hostel-admin')
    })

    expect(result.current.roleFilter).toBe('hostel-admin')

    act(() => {
      result.current.setRoleFilter('all')
    })

    expect(result.current.roleFilter).toBe('all')
  })

  it('should set status filter', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setStatusFilter('inactive')
    })

    expect(result.current.statusFilter).toBe('inactive')

    act(() => {
      result.current.setStatusFilter('all')
    })

    expect(result.current.statusFilter).toBe('all')
  })

  it('should toggle dialog states', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.openAddDialog()
    })
    expect(result.current.isAddDialogOpen).toBe(true)

    act(() => {
      result.current.closeAddDialog()
    })
    expect(result.current.isAddDialogOpen).toBe(false)

    act(() => {
      result.current.openEditDialog(mockAdmin)
    })
    expect(result.current.isEditDialogOpen).toBe(true)
    expect(result.current.selectedAdmin).toEqual(mockAdmin)

    act(() => {
      result.current.closeEditDialog()
    })
    expect(result.current.isEditDialogOpen).toBe(false)
  })

  it('should set hostels', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      result.current.setHostels([mockHostel])
    })

    expect(result.current.hostels).toEqual([mockHostel])
  })

  it('should handle loading and error states', () => {
    const { result } = renderHook(() => useAdminStore())

    act(() => {
      useAdminStore.setState({ loading: true, error: 'Test error' })
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe('Test error')

    act(() => {
      useAdminStore.setState({ loading: false, error: null })
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
