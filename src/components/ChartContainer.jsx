
import React from 'react';

const ChartContainer = ({ title, children }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            <div className="flex-1" style={{ minHeight: '300px' }}>
                {children}
            </div>
        </div>
    );
};

export default ChartContainer;