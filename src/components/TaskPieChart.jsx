import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartContainer from './ChartContainer';

const COLORS = {
    High: '#ef4444',
    Medium: '#f97316',
    Low: '#22c55e',
};

const TaskPieChart = ({ data }) => {
    const chartData = Object.keys(data).map(key => ({ name: key, value: data[key] }));

    return (
        <ChartContainer title="Tasks by Priority">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#8884d8'} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ color: '#fff', fontSize: '14px' }}/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default TaskPieChart;