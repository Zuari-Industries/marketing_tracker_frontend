import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        status: 'Pending'
    });

    useEffect(() => {
        if (task) {
            
            const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
            setFormData({ ...task, dueDate: formattedDate });
        } else {
           
             setFormData({
                title: '',
                description: '',
                assignee: '',
                dueDate: '',
                status: 'Pending'
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-8 w-full max-w-lg m-4">
                <h2 className="text-2xl font-bold text-white mb-6">{task ? 'Edit Task' : 'Create New Task'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="title" className="block text-gray-300 font-semibold mb-2">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-300 font-semibold mb-2">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="assignee" className="block text-gray-300 font-semibold mb-2">Assignee</label>
                            <input type="text" name="assignee" id="assignee" value={formData.assignee} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-gray-300 font-semibold mb-2">Due Date</label>
                            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-gray-300 font-semibold mb-2">Status</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default TaskModal;