// src/components/GanttChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react'; 

// Helper function to calculate the difference in days between two dates
const dayDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1) || isNaN(d2)) return 0;
    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Helper function to get the start/end dates for the current view
const getViewDetails = (date, viewMode) => {
    if (viewMode === 'Week') {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Saturday
        return { start, end, days: 7, label: 'Days of the Week' };
    }
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end, days: end.getDate(), label: `Days in ${date.toLocaleString('default', { month: 'long' })}` };
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        //  Use the original item directly from the payload
        return (
            <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700 text-white text-sm shadow-lg">
                <p className="font-bold mb-1">{data.title.trim().replace('↳', '')}</p>
                <p className="text-gray-300"><span className="font-semibold text-blue-400">Starts:</span> {data.startDate}</p>
                <p className="text-gray-300"><span className="font-semibold text-purple-400">Ends:</span> {data.endDate}</p>
            </div>
        );
    }
    return null;
};

// Custom Y-Axis Tick component to handle expand/collapse UI and clicks
const CustomYAxisTick = ({ x, y, payload, data, onTaskClick }) => {
    const chartItem = data[payload.index];
    if (!chartItem) return null;

    const handleTickClick = () => {
        if (chartItem.hasSubtasks && onTaskClick) {
            onTaskClick(chartItem.id);
        }
    };

    return (
        <g transform={`translate(${x},${y})`}>
            <foreignObject x={-150} y={-10} width={145} height={20}>
                <div
                    style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: chartItem.hasSubtasks ? 'pointer' : 'default', color: '#d1d5db', fontSize: 12 }}
                    onClick={handleTickClick}
                    title={chartItem.title.trim().replace('↳', '')}
                >
                    <div style={{ width: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {chartItem.hasSubtasks && (
                            chartItem.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        )}
                    </div>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: chartItem.isSubtask ? '20px' : '0' }}>
                        {chartItem.title.trim().replace('↳', '')}
                    </span>
                </div>
            </foreignObject>
        </g>
    );
};

const GanttChart = ({ data, currentDate, viewMode, onTaskClick }) => { 
    const { start: startOfView, days: daysInView, label: xAxisLabel } = getViewDetails(currentDate, viewMode);

    //  Spread the original item properties into the chart data object
    const chartData = data
        .map(item => {
            const itemStart = new Date(item.startDate);
            const itemEnd = new Date(item.endDate);
            if (isNaN(itemStart) || isNaN(itemEnd)) return null;

            const visibleStart = new Date(Math.max(startOfView, itemStart));
            const visibleEnd = new Date(Math.min(new Date(startOfView).setDate(startOfView.getDate() + daysInView - 1), itemEnd));
            if (visibleStart > visibleEnd) return null;

            const spacer = dayDifference(startOfView, visibleStart) - 1;
            const duration = dayDifference(visibleStart, visibleEnd);

            return { ...item, name: item.title, spacer: spacer < 0 ? 0 : spacer, duration };
        })
        .filter(Boolean);

    const formatWeekTick = (tick) => {
        const date = new Date(startOfView);
        date.setDate(date.getDate() + tick - 1);
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    };

    return (
        <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 35 + 60) /* Dynamic height */}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#4a5568" />
                <XAxis type="number" domain={[1, daysInView]} tickCount={daysInView} tick={{ fill: '#a0aec0', fontSize: 12 }} label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#a0aec0' }} tickFormatter={viewMode === 'Week' ? formatWeekTick : (tick) => tick} />
               
                <YAxis type="category" dataKey="name" width={150} interval={0} axisLine={false} tickLine={false} tick={<CustomYAxisTick data={chartData} onTaskClick={onTaskClick} />} />
                <Tooltip cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} payload={[{ value: 'Request', type: 'square', color: '#38bdf8' }, { value: 'Subtask', type: 'square', color: '#818cf8' }]} />
                <Bar dataKey="spacer" stackId="a" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="duration" stackId="a" radius={[4, 4, 4, 4]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isSubtask ? '#818cf8' : '#38bdf8'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GanttChart;