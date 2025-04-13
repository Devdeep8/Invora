import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";



export function StatusDonut({ data }) {
  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value}`, name]}
          />
          <Legend 
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