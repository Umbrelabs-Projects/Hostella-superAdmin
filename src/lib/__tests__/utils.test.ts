import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle multiple classes', () => {
    const result = cn('flex', 'items-center', 'justify-between')
    expect(result).toContain('flex')
    expect(result).toContain('items-center')
    expect(result).toContain('justify-between')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('btn', isActive && 'btn-active')
    expect(result).toContain('btn')
    expect(result).toContain('btn-active')
  })

  it('should handle false conditions', () => {
    const isActive = false
    const result = cn('btn', isActive && 'btn-active')
    expect(result).toContain('btn')
    expect(result).not.toContain('btn-active')
  })

  it('should handle undefined and null values', () => {
    const result = cn('btn', undefined, null, 'btn-primary')
    expect(result).toContain('btn')
    expect(result).toContain('btn-primary')
  })

  it('should resolve tailwind conflicts correctly', () => {
    const result = cn('w-full', 'w-96')
    expect(result).toContain('w-96')
    expect(result).not.toContain('w-full w-96')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle object syntax', () => {
    const result = cn({
      'flex': true,
      'items-center': true,
      'justify-between': false,
    })
    expect(result).toContain('flex')
    expect(result).toContain('items-center')
    expect(result).not.toContain('justify-between')
  })

  it('should handle array syntax', () => {
    const result = cn(['flex', 'items-center', ['justify-between']])
    expect(result).toContain('flex')
    expect(result).toContain('items-center')
    expect(result).toContain('justify-between')
  })
})
