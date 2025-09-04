import React, { useState, useEffect, useMemo } from 'react';
import { X, FileText, CheckSquare, MessageSquare, History } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SubtasksTab from './SubtasksTab';
import CommentsTab from './CommentsTab';
import HistoryTab from './HistoryTab';

const RequestDetailsModal = ({ request, onClose, onSave,allUsers }) => {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('Details');
    const [formData, setFormData] = useState({ ...request });

    useEffect(() => { setFormData({ ...request }); }, [request]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        onSave(formData);
        onClose();
    };

    const renderDetailsTab = () => (
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label className="text-xs text-gray-400 block mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"/>
            </div>
            <div>
    <label className="text-xs text-gray-400 block mb-1">Status</label>
    {(user.role === 'Admin' || user.role === 'SuperAdmin') ? (
        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
        </select>
    ) : (
        <p className="text-white font-medium py-2">{formData.status}</p>
    )}
</div>
            <div>
    <label className="text-xs text-gray-400 block mb-1">Priority</label>
    {(user.role === 'Admin' || user.role === 'SuperAdmin') ? (
       
        <select name="priority" value={formData.priority || 'Medium'} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
    ) : (
        
        <p className="text-white font-medium py-2">{formData.priority || 'Medium'}</p>
    )}
</div>
         <div>
    <label className="text-xs text-gray-400 block mb-1">Assignee</label>
    {user.role === 'SuperAdmin' ? (
        <select 
            name="assigneeId" 
            value={formData.assigneeId || ''} 
            onChange={handleInputChange} 
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
        >
            <option value="">Unassigned</option>
            {admins.map(admin => (
                <option key={admin.id} value={admin.id}>{admin.name}</option>
            ))}
        </select>
    ) : (
        <p className="text-white font-medium py-2">{formData.assignee || 'Unassigned'}</p>
    )}
</div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Details':
                return renderDetailsTab();
            case 'Subtasks':
                return <SubtasksTab 
                 request={request}
                   />;
            case 'Comments':
                return <CommentsTab request={request} />;
            case 'History':
                return <HistoryTab requestId={request.id} />;
            default:
                return null;
        }
    };
    
    const tabs = [
        { name: 'Details', icon: FileText },
        { name: 'Subtasks', icon: CheckSquare },
        { name: 'Comments', icon: MessageSquare },
        { name: 'History', icon: History },
    ];
const admins = useMemo(() => 
        allUsers.filter(u => u.role === 'Admin'), 
    [allUsers]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Request Details</h2>
                    <div className="flex items-center gap-4">
                         <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Save Changes</button>
                         <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-700"><X size={20} /></button>
                    </div>
                </div>
                <div className="flex border-b border-gray-700">
                    {tabs.map(tab => (
                        <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.name ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}>
                            <tab.icon size={16} />{tab.name}
                        </button>
                    ))}
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;