import { 
  invoiceSchema as InvoiceSchema, 
  OnboardingSchema as onboardingSchema 
} from '../../src/utils/zodSchema'

describe('Zod Schemas Validation', () => {
  describe('InvoiceSchema', () => {
    it('validates correct invoice data', () => {
      const validInvoice = {
        invoiceName: 'Website Design',
        total: 100,
        status: 'PAID',
        date: new Date().toISOString(),         // must be string
        dueDate: 30,                             // must be number
        fromName: 'Company Inc',
        fromEmail: 'company@example.com',
        fromAddress: '456 Business Ave',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientAddress: '123 Main St',
        currency: 'USD',
        invoiceNumber: 1,                        // must be number
        note: 'Thanks for your business',
        invoiceItemDescription: 'Design work',
        invoiceItemQuantity: 1,
        invoiceItemRate: 100
      }

      const result = InvoiceSchema.safeParse(validInvoice)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const invalidInvoice = {
        invoiceName: 'Website Design',
        total: 100,
        status: 'PAID',
        date: new Date().toISOString(),
        dueDate: 30,
        fromName: 'Company Inc',
        fromEmail: 'not-an-email',
        fromAddress: '456 Business Ave',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientAddress: '123 Main St',
        currency: 'USD',
        invoiceNumber: 1,
        invoiceItemDescription: 'Design work',
        invoiceItemQuantity: 1,
        invoiceItemRate: 100
      }

      const result = InvoiceSchema.safeParse(invalidInvoice)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue =>
          issue.path.includes('fromEmail') && issue.code === 'invalid_string'
        )).toBe(true)
      }
    })

    it('requires mandatory fields', () => {
      const emptyInvoice = {}

      const result = InvoiceSchema.safeParse(emptyInvoice)
      expect(result.success).toBe(false)
      if (!result.success) {
        const requiredFields = [
          'invoiceName', 'total', 'date', 'dueDate',
          'fromName', 'fromEmail', 'fromAddress',
          'clientName', 'clientEmail', 'clientAddress',
          'currency', 'invoiceNumber',
          'invoiceItemDescription', 'invoiceItemQuantity', 'invoiceItemRate'
        ]
        requiredFields.forEach(field => {
          expect(result.error.issues.some(issue =>
            issue.path.includes(field)
          )).toBe(true)
        })
      }
    })
  })


  describe('onboardingSchema', () => {
    it('validates correct onboarding data', () => {
      const validOnboarding = {
        fname: 'John',
        lname: 'Doe',
        address: '123 Main St'
      }

      const result = onboardingSchema.safeParse(validOnboarding)
      expect(result.success).toBe(true)
    })

    it('requires minimum length for names', () => {
      const invalidOnboarding = {
        fname: '',
        lname: '',
        address: '123 Main St'
      }

      const result = onboardingSchema.safeParse(invalidOnboarding)
      expect(result.success).toBe(false)
    })
  })
})
