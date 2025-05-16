import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomPieChart = ({ totals }) => {
  const active = totals.cases - totals.recovered - totals.deaths;
  const data = [
    { name: 'Active', value: active },
    { name: 'Recovered', value: totals.recovered },
    { name: 'Deaths', value: totals.deaths },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          innerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;