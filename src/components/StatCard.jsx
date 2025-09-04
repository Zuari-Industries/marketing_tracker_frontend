import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-600/20 text-blue-400',
        purple: 'bg-purple-600/20 text-purple-400',
        red: 'bg-red-600/20 text-red-400',
        orange: 'bg-orange-600/20 text-orange-400',
        green: 'bg-green-600/20 text-green-400',
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-4 shadow-lg">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;