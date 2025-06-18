import { formatCurrency } from '../../src/utils/formatCurrency'

describe('formatCurrency (INR)', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1000)).toBe('₹1,000.00')
    expect(formatCurrency(1234.56)).toBe('₹1,234.56')
    expect(formatCurrency(0)).toBe('₹0.00')
  })

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-1000)).toBe('-₹1,000.00')
    expect(formatCurrency(-1234.56)).toBe('-₹1,234.56')
  })

  it('handles edge cases', () => {
    expect(formatCurrency(null)).toBe('₹0.00')
    expect(formatCurrency(undefined)).toBe('₹0.00')
    expect(formatCurrency('')).toBe('₹0.00')
  })

  it('handles decimal places correctly', () => {
    expect(formatCurrency(1.1)).toBe('₹1.10')
    expect(formatCurrency(1.999)).toBe('₹2.00')
    expect(formatCurrency(1000.5)).toBe('₹1,000.50')
  })

  it('handles large numbers', () => {
    expect(formatCurrency(1000000)).toBe('₹10,00,000.00')
    expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89')
  })
})
