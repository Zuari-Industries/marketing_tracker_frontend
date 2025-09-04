import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';

const TaskBarChart = ({ data }) => {
    return (
        <ChartContainer title="Tasks by Status">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} />
                    <YAxis stroke="#a0aec0" fontSize={12} allowDecimals={false} />
                    <Tooltip 
                        cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568', color: '#fff' }} 
                    />
                    <Bar dataKey="count" fill="#3b82f6" barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default TaskBarChart;