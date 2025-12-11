import { apiFetch, setAuthToken } from '@/lib/api'

describe('apiFetch utility', () => {
  beforeEach(() => {
    // Clear localStorage and reset auth token
    localStorage.clear()
    setAuthToken(null)
    jest.clearAllMocks()
  })

  it('should fetch data successfully', async () => {
    const mockResponse = { success: true, data: { id: '1', name: 'Test' } }
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock

    const result = await apiFetch('/test')

    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalled()
  })

  it('should include auth token in headers when available', async () => {
    setAuthToken('test-token-123')
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock

    await apiFetch('/test')

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[1].headers.Authorization).toBe('Bearer test-token-123')
  })

  it('should set correct Content-Type header', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock

    await apiFetch('/test')

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[1].headers['Content-Type']).toBe('application/json')
  })

  it('should throw error for failed requests', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    ) as jest.Mock

    await expect(apiFetch('/nonexistent')).rejects.toThrow()
  })

  it('should handle POST requests with body', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', name: 'Created' }),
      })
    ) as jest.Mock

    const payload = { name: 'New Item' }
    await apiFetch('/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[1].method).toBe('POST')
    expect(callArgs[1].body).toBe(JSON.stringify(payload))
  })

  it('should handle 401 unauthorized errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })
    ) as jest.Mock

    await expect(apiFetch('/protected')).rejects.toThrow()
  })

  it('should handle 500 server errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    ) as jest.Mock

    await expect(apiFetch('/error')).rejects.toThrow()
  })

  it('should handle network errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as jest.Mock

    await expect(apiFetch('/test')).rejects.toThrow('Network error')
  })

  it('should use environment variable for base URL', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock

    await apiFetch('/test')

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const url = callArgs[0]
    expect(url).toContain('https://www.example.railway')
  })

  it('should append endpoint to base URL', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock

    await apiFetch('/api/users')

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const url = callArgs[0]
    expect(url).toContain('/api/users')
  })
})
