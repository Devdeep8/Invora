'use client';

import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTheme } from 'next-themes';

export function StatusDonut({ data }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const COLORS = [
    'var(--primary)',      // Primary color for Paid
    'var(--accent)',       // Accent color for Pending
    'var(--destructive)',  // Destructive color for Due
    'var(--muted)',        // Muted color for Draft
  ];

  // Status icons for the legend
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-col gap-2 text-xs">
        {payload.map((entry, index) => {
          const { value, color } = entry;
          const isZero = data[index].value === 0;
          
          return (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: color, opacity: isZero ? 0.5 : 1 }}
              />
              <span className={`${isZero ? 'text-muted-foreground/50' : 'text-foreground'} font-medium`}>
                {value}
              </span>
              <span className={`ml-1 ${isZero ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                ({data[index].value})
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{ 
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)'
          }}
          className="p-3 shadow-lg rounded-lg"
        >
          <p className="font-medium" style={{ color: payload[0].color }}>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[250px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={6}
            dataKey="value"
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                opacity={entry.value === 0 ? 0.5 : 1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={renderCustomizedLegend}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}