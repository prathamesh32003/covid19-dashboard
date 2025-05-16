import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tickFormatter={(date) => new Date(date).toLocaleDateString()}
        minTickGap={50}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="cases"
        stroke="#8884d8"
        dot={false}
        name="New Cases"
      />
      <Line
        type="monotone"
        dataKey="deaths"
        stroke="#ff0000"
        dot={false}
        name="Deaths"
      />
      <Line
        type="monotone"
        dataKey="recovered"
        stroke="#00cc00"
        dot={false}
        name="Recovered"
      />
    </LineChart>
  </ResponsiveContainer>
);

export default CustomLineChart;