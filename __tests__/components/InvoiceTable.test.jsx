import { render, screen, fireEvent } from '@testing-library/react'
import * as nextNavigation from 'next/navigation'
import {InvoiceTable} from '../../src/app/dashboard/invoice/components/InvoiceTable'

// Mock the delete action
jest.mock('../../src/app/action', () => ({
  DeleteInvoice: jest.fn(),
}))

// Mock useRouter from next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
}))

const mockRouter = {
  push: jest.fn(),
}

const sampleInvoices = [
  {
    id: '1a2b3c4d5e6f7g8h9i0j',
    clientName: 'John Doe',
    total: 1000,
    status: 'PAID',
    date: '2024-01-15T00:00:00Z', // ISO format
  },
  {
    id: '0j9i8h7g6f5e4d3c2b1a',
    clientName: 'Jane Smith',
    total: 1500,
    status: 'PENDING',
    date: '2024-01-20T00:00:00Z',
  },
];


describe('InvoiceTable', () => {
  beforeEach(() => {
    nextNavigation.useRouter.mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it('renders invoice table with data', () => {
    render(<InvoiceTable invoices={sampleInvoices} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('₹1,000.00')).toBeInTheDocument()
    expect(screen.getByText('PAID')).toBeInTheDocument()
  })

  it('shows empty state when no invoices', () => {
    render(<InvoiceTable invoices={[]} />)

    expect(screen.getByText('No invoices found.')).toBeInTheDocument()
  })



 it('displays correct status styling', () => {
  render(<InvoiceTable invoices={sampleInvoices} />)

  const paidStatus = screen.getByTestId('status-paid')
  const pendingStatus = screen.getByTestId('status-pending')

  expect(paidStatus).toBeInTheDocument()
  expect(pendingStatus).toBeInTheDocument()

  // Optional: if your Badge component applies styles you control,
  // test classNames or snapshot styles here.
})

  it('formats currency correctly', () => {
    render(<InvoiceTable invoices={sampleInvoices} />)

    expect(screen.getByText('₹1,000.00')).toBeInTheDocument()
    expect(screen.getByText('₹1,500.00')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<InvoiceTable invoices={sampleInvoices} />)

    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument()
  })
})
