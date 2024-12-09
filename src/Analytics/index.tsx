import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import '../index.css'
export default function Analytics() {
// Define the type for our data
type ChartData = {
  name: string;
  Frequency: number;
};

// Sample data for the chart
const data: ChartData[] = [
  { name: 'January', Frequency: 20 },
  { name: 'February', Frequency: 27 },
  { name: 'March', Frequency: 17 },
  { name: 'April', Frequency: 24 },
  { name: 'May', Frequency: 30 },
];

  return (
    <ResponsiveContainer width={1000} height={600} >
      <BarChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Frequency" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};