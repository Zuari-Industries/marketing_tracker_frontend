import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MoreHorizontal, User as UserIcon,Trash2, ChevronDown } from 'lucide-react';

const AllRequestsTable = ({ tasks, onActionClick, expandedRowId, onToggleRow }) => { 
    const { user,deleteTask } = useAuth();

    const getStatusChipClass = (status) => {
        switch (status) {
            case 'On Hold': return 'bg-yellow-500/20 text-yellow-400';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400';
            case 'Completed': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-600 text-gray-300'; 
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-400';
            case 'Medium': return 'text-yellow-400';
            default: return 'text-green-400'; 
        }
    };
    const handleDelete = (taskId) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            deleteTask(taskId);
        }
    };
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Request</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Priority</th>
                            <th scope="col" className="px-6 py-3">Requester</th>
                            <th scope="col" className="px-6 py-3">Business Unit</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Assignee</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                   <tbody>
                            {tasks.map(task => (
                                <React.Fragment key={task.id}>
                                    {/* Main Task Row */}
                                    <tr 
                                        className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                                        onClick={() => onToggleRow(task.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                            <ChevronDown 
                                                size={16} 
                                                className={`transition-transform duration-200 ${expandedRowId === task.id ? 'rotate-180' : ''}`} 
                                            />
                                            {task.title}
                                        </td>
                                        <td className="px-6 py-4">{task.type || 'Other'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-medium ${getPriorityClass(task.priority)}`}>{task.priority || 'Medium'}</td>
                                        <td className="px-6 py-4">{task.requester || user.name}</td>
                                        <td className="px-6 py-4">{task.businessUnit || 'Infra'}</td>
                                        <td className="px-6 py-4">{task.dueDate || 'No deadline'}</td>
                                        <td className="px-6 py-4 text-blue-400">{task.assignee}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); onActionClick(task); }} className="p-1.5 rounded-md hover:bg-gray-600">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                                {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className="p-1.5 rounded-md hover:bg-gray-600 text-gray-400 hover:text-red-400">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Subtask Row */}
                                    {expandedRowId === task.id && (
                                        <tr className="bg-gray-900/50">
                                            <td colSpan="9" className="p-4">
                                                <div className="p-4 bg-gray-800 rounded-lg">
                                                    <h4 className="font-bold text-white mb-3">Subtasks</h4>
                                                    {task.subtasks && task.subtasks.length > 0 ? (
                                                        <table className="w-full text-xs text-left text-gray-400">
                                                            <thead className="text-gray-500">
                                                                <tr>
                                                                    <th className="py-2 px-3">Subtask Title</th>
                                                                    <th className="py-2 px-3">Status</th>
                                                                    <th className="py-2 px-3">Start Date</th>
                                                                    <th className="py-2 px-3">End Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {task.subtasks.map(sub => (
                                                                    <tr key={sub.id} className="border-t border-gray-700">
                                                                        <td className="py-2 px-3 text-white">{sub.title}</td>
                                                                        <td className="py-2 px-3">{sub.status}</td>
                                                                        <td className="py-2 px-3">{sub.startDate || '--'}</td>
                                                                        <td className="py-2 px-3">{sub.endDate || '--'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No subtasks for this request.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllRequestsTable;