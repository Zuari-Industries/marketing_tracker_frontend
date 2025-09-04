import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, Edit } from 'lucide-react'; // Edit icon add karein

const SubtasksTab = ({ request }) => {
    const { getSubtasksForRequest, updateSubtask, deleteSubtask, user } = useAuth();
    const [subtasks, setSubtasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Naye state dates set karne ke liye
    const [selectedSubtaskId, setSelectedSubtaskId] = useState('');
    const [newStartDate, setNewStartDate] = useState('');
    const [newEndDate, setNewEndDate] = useState('');
    
    const { id: requestId, createdAt: mainTaskStartDate, dueDate: mainTaskEndDate } = request;

    const loadSubtasks = useCallback(async () => {
        setIsLoading(true);
        const fetchedSubtasks = await getSubtasksForRequest(requestId);
        setSubtasks(fetchedSubtasks);
        setIsLoading(false);
    }, [requestId, getSubtasksForRequest]);

    useEffect(() => {
        loadSubtasks();
    }, [loadSubtasks]);

    // Sirf woh subtasks jinki date set nahin hai
    const datelessSubtasks = useMemo(() => {
        return subtasks.filter(s => !s.startDate);
    }, [subtasks]);

    const handleSetDates = async () => {
        if (!selectedSubtaskId || !newStartDate || !newEndDate) {
            alert('Please select a subtask and fill both start and end dates.');
            return;
        }
        
        // Validation logic yahan bhi zaroori hai
        const subtaskStart = new Date(newStartDate);
        const subtaskEnd = new Date(newEndDate);
        if (subtaskStart > subtaskEnd) {
            alert('Error: Start date cannot be after end date.');
            return;
        }

        const originalSubtask = subtasks.find(s => s.id === parseInt(selectedSubtaskId));
        
        await updateSubtask({
            ...originalSubtask,
            startDate: newStartDate,
            endDate: newEndDate,
        });

        // Form reset karein
        setSelectedSubtaskId('');
        setNewStartDate('');
        setNewEndDate('');
        await loadSubtasks(); // List refresh karein
    };
    
    const handleStatusChange = async (subtask, newStatus) => {
        await updateSubtask({ ...subtask, status: newStatus });
        loadSubtasks();
    };

    const handleDelete = async (subtaskId) => {
        if (window.confirm('Are you sure you want to delete this subtask?')) {
            await deleteSubtask(subtaskId); // ab requestId ki zaroorat nahin
            loadSubtasks();
        }
    };

    if (isLoading) {
        return <div className="text-center text-gray-400 py-12">Loading subtasks...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {subtasks.length > 0 ? (
                    subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <div className="flex-1">
                                <p className="text-white font-medium">{subtask.title}</p>
                                <p className="text-xs text-gray-400">
                                    {subtask.startDate && subtask.endDate
                                        ? `${subtask.startDate} → ${subtask.endDate}`
                                        : <span className="text-yellow-400 italic">Dates not set</span>
                                    }
                                </p>
                            </div>
                            {user.role === 'Admin' || user.role === 'SuperAdmin' ? (
                                <select value={subtask.status} onChange={(e) => handleStatusChange(subtask, e.target.value)} className="bg-gray-700 text-white text-xs rounded-md px-2 py-1 border border-gray-600">
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            ) : (<span className="text-xs text-gray-300 px-2 py-1">{subtask.status}</span>)}
                            {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
                                <button onClick={() => handleDelete(subtask.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No subtasks have been created for this request yet.</p>
                )}
            </div>
            
            {/* Form ab dates set karne ke liye hai, aur tabhi dikhega jab dateless subtasks honge */}
            {(user.role === 'Admin' || user.role === 'SuperAdmin') && datelessSubtasks.length > 0 && (
                <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Set Dates for Subtask</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label className="text-xs text-gray-400 block mb-1">Select Subtask</label>
                            <select value={selectedSubtaskId} onChange={(e) => setSelectedSubtaskId(e.target.value)} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 h-10">
                                <option value="">-- Select a subtask to update --</option>
                                {datelessSubtasks.map(task => (
                                    <option key={task.id} value={task.id}>{task.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Start Date</label>
                            <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} min={mainTaskStartDate} max={mainTaskEndDate} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" />
                        </div>
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">End Date</label>
                            <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} min={mainTaskStartDate} max={mainTaskEndDate} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" />
                        </div>
                        <button onClick={handleSetDates} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold h-10">
                            <Edit size={16} /> Set Dates
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubtasksTab;