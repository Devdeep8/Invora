import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, CreditCard, Clock, Calendar } from 'lucide-react'

export function StatCard({
  title,
  value,
  isCurrency = false,
  type = 'default',
}) {
  const formattedValue = isCurrency
    ? `₹${value.toLocaleString()}`
    : value.toLocaleString()

  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case 'invoiced':
        return <TrendingUp className='h-8 w-8 text-primary' />
      case 'paid':
        return <CreditCard className='h-8 w-8 text-success' />
      case 'pending':
        return <Clock className='h-8 w-8 text-accent' />
      case 'month':
        return <Calendar className='h-8 w-8 text-secondary' />
      default:
        return <TrendingUp className='h-8 w-8 text-primary' />
    }
  }

  return (
    <Card className='border border-border shadow-sm'>
      <CardContent className='p-6'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground mb-1'>
              {title}
            </h3>
            <p className='text-2xl font-bold text-foreground'>
              {formattedValue}
            </p>
          </div>
          <div className='bg-card p-2 rounded-full shadow-sm border border-border'>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
