'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function RevenueChart({ data }) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [chartColors, setChartColors] = useState({
    area: 'var(--primary)',
    grid: 'var(--border)',
    text: 'var(--muted-foreground)',
    tooltip: {
      bg: 'var(--card)',
      border: 'var(--border)',
      text: 'var(--foreground)',
      highlight: 'var(--primary)',
    },
  })

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const sanitizedData = data.map(item => ({
    ...item,
    amount: item.amount ?? 0,
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          }}
          className='p-4 shadow-lg rounded-lg'
        >
          <p className='font-medium'>{`Month: ${label}`}</p>
          <p className='font-bold' style={{ color: 'var(--primary)' }}>
            {`Revenue: ₹${Number(payload[0].value).toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  if (!mounted) {
    return (
      <div className='w-full h-[300px] flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading chart...</p>
      </div>
    )
  }

  return (
    <div className='w-full h-[300px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={sanitizedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='var(--primary)' stopOpacity={0.8} />
              <stop offset='95%' stopColor='var(--primary)' stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            vertical={false}
            stroke='var(--border)'
          />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            tickFormatter={value => `₹${value / 1000}k`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='amount'
            stroke='var(--primary)'
            strokeWidth={3}
            fillOpacity={1}
            fill='url(#colorRevenue)'
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: 'var(--background)',
              fill: 'var(--primary)',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
