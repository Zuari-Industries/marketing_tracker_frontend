import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2 } from 'lucide-react';

const SubtaskTemplatesPage = () => {
    const { subtaskTemplates, fetchSubtaskTemplates, addSubtaskTemplate, deleteSubtaskTemplate, formFields ,fetchFormFields} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newTemplateTitle, setNewTemplateTitle] = useState('');
    const [selectedRequestType, setSelectedRequestType] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
             await fetchFormFields(); 
            await fetchSubtaskTemplates();
            setIsLoading(false);
        };
        loadData();
    }, [fetchFormFields,fetchSubtaskTemplates]);

    const requestTypeOptions = useMemo(() => {
        const typeField = formFields.find(f => f.name === 'type');
        return typeField ? typeField.options.split(',') : [];
    }, [formFields]);

    useEffect(() => {
        if (requestTypeOptions.length > 0 && !selectedRequestType) {
            setSelectedRequestType(requestTypeOptions[0]);
        }
    }, [requestTypeOptions, selectedRequestType]);

    const groupedTemplates = subtaskTemplates.reduce((acc, template) => {
        (acc[template.requestType] = acc[template.requestType] || []).push(template);
        return acc;
    }, {});

    const handleAddTemplate = async (e) => {
        e.preventDefault();
        if (!newTemplateTitle.trim() || !selectedRequestType) {
            alert('Please provide a title and select a request type.');
            return;
        }
        await addSubtaskTemplate({ title: newTemplateTitle, requestType: selectedRequestType });
        setNewTemplateTitle('');
    };
    
    const handleDelete = async (templateId) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            await deleteSubtaskTemplate(templateId);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center text-gray-400">Loading templates...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white">Subtask Templates</h2>
            <p className="text-gray-400 mb-6">Pre-configure subtasks for each request type.</p>

            {/* Add New Template Form */}
            <form onSubmit={handleAddTemplate} className="mb-8 p-4 bg-gray-900/50 rounded-lg flex items-end gap-4">
                <div className="flex-grow">
                    <label className="text-xs text-gray-400 block mb-1">New Template Title</label>
                    <input
                        type="text"
                        value={newTemplateTitle}
                        onChange={(e) => setNewTemplateTitle(e.target.value)}
                        placeholder="e.g., Draft initial copy"
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">For Request Type</label>
                    <select
                        value={selectedRequestType}
                        onChange={(e) => setSelectedRequestType(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 h-10"
                    >
                        {requestTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg h-10">
                    <Plus size={16} /> Add Template
                </button>
            </form>

            {/* Display Existing Templates */}
            <div className="space-y-6">
                {Object.entries(groupedTemplates).map(([requestType, templates]) => (
                    <div key={requestType}>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">{requestType}</h3>
                        <div className="space-y-2">
                            {templates.map(template => (
                                <div key={template.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                                    <p className="text-gray-200">{template.title}</p>
                                    <button onClick={() => handleDelete(template.id)} className="p-1 text-gray-500 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubtaskTemplatesPage;