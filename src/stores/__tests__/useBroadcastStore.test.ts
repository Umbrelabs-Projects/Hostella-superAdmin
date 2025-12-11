import { renderHook, act } from '@testing-library/react'
import { useBroadcastStore } from '@/stores/useBroadcastStore'
import { BroadcastMessage } from '@/types/broadcast'

describe('useBroadcastStore', () => {
  const mockMessage = {
    id: '1',
    title: 'Test Message',
    content: 'This is a test message',
    recipientType: 'all-residents' as const,
    recipientCount: 100,
    status: 'sent' as const,
    priority: 'medium' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    useBroadcastStore.setState({
      messages: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalMessages: 0,
      statusFilter: 'all',
      priorityFilter: 'all',
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useBroadcastStore())

    expect(result.current.messages).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.currentPage).toBe(1)
    expect(result.current.pageSize).toBe(10)
  })

  it('should set messages', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.setMessages([mockMessage])
    })

    expect(result.current.messages).toEqual([mockMessage])
  })

  it('should add message', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.addMessage(mockMessage)
    })

    expect(result.current.messages).toContainEqual(mockMessage)
  })

  it('should update message', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.addMessage(mockMessage)
    })

    const updatedMessage = {
      ...mockMessage,
      title: 'Updated Message',
    }

    act(() => {
      result.current.updateMessage(updatedMessage)
    })

    const stored = result.current.messages.find((m: BroadcastMessage) => m.id === '1')
    expect(stored?.title).toBe('Updated Message')
  })

  it('should remove message', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.addMessage(mockMessage)
    })

    expect(result.current.messages).toHaveLength(1)

    act(() => {
      result.current.removeMessage('1')
    })

    expect(result.current.messages).toHaveLength(0)
  })

  it('should manage pagination', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.setCurrentPage(2)
      result.current.setPageSize(20)
      result.current.setTotalMessages(50)
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.pageSize).toBe(20)
    expect(result.current.totalMessages).toBe(50)
  })

  it('should set status filter', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.setStatusFilter('sent')
    })

    expect(result.current.statusFilter).toBe('sent')

    act(() => {
      result.current.setStatusFilter('all')
    })

    expect(result.current.statusFilter).toBe('all')
  })

  it('should set priority filter', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.setPriorityFilter('high')
    })

    expect(result.current.priorityFilter).toBe('high')

    act(() => {
      result.current.setPriorityFilter('all')
    })

    expect(result.current.priorityFilter).toBe('all')
  })

  it('should set loading and error states', () => {
    const { result } = renderHook(() => useBroadcastStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')

    act(() => {
      result.current.setLoading(false)
      result.current.setError(null)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
