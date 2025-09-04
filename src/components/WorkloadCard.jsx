
import React from 'react';

const WorkloadCard = ({ member }) => {
    const getRoleChipClass = (role) => {
        switch (role) {
            case 'SuperAdmin': return 'bg-red-500/50 text-red-300';
            case 'Admin': return 'bg-blue-500/50 text-blue-300';
            default: return 'bg-gray-600 text-gray-300';
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white text-xl flex-shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-white text-lg">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleChipClass(member.role)}`}>
                    {member.role}
                </span>
            </div>
       
            {member.role === 'Admin' ? (
                
                <div className="bg-gray-900/50 p-4 rounded-md">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Current Workload</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-white">{member.workload.active}</p>
                            <p className="text-xs text-gray-500 uppercase">Active</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{member.workload.completed}</p>
                            <p className="text-xs text-gray-500 uppercase">Completed</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{member.workload.total}</p>
                            <p className="text-xs text-gray-500 uppercase">Total</p>
                        </div>
                    </div>
                </div>
            ) : (
               
                <div className="bg-gray-900/50 p-4 rounded-md text-center h-full flex items-center justify-center min-h-[108px]">
                    <p className="text-sm text-gray-400 italic">
                        Workload is not tracked for this role.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WorkloadCard;