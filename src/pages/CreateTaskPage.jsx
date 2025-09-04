import React, { useState, useMemo,useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
    const { formFields, addTask, user,fetchFormFields } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadForm = async () => {
            setIsLoading(true);
            await fetchFormFields();
            setIsLoading(false);
        };
        loadForm();
    }, [fetchFormFields]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // --- YEH POORA LOGIC BLOCK ADD KAREIN ---

// Logic to filter which fields should be visible
const visibleFields = useMemo(() => {
    if (!formFields) return [];
    return formFields.filter(field => {
        if (!field.active) return false; // Inactive fields ko hamesha chupao

        if (!field.dependsOnFieldName) {
            return true; // Agar field dependent nahin hai, to hamesha dikhao
        }
        
        // Controller field ki current value check karo
        const controllerValue = formData[field.dependsOnFieldName];
        // Agar value match karti hai, tabhi dikhao
        return controllerValue === field.dependsOnFieldValue;
    });
}, [formFields, formData]); // Yeh logic tabhi chalega jab formFields ya formData badlega

const groupedFields = useMemo(() => {
    return visibleFields.reduce((acc, field) => {
        (acc[field.group] = acc[field.group] || []).push(field);
        return acc;
    }, {});
}, [visibleFields]); // Yeh logic tabhi chalega jab visibleFields badlenge
   const handleSubmit = async (e) => { 
        e.preventDefault();
        await addTask(formData); 
        alert('Task created successfully!');
        navigate('/requests'); 
    };
    
    if (isLoading) {
        return <div className="p-6 text-center text-gray-400">Loading form...</div>;
    }
   
    const renderField = (field) => {
        const label = (
            <label htmlFor={field.name} className="text-sm font-semibold text-gray-300 block mb-2">
                {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
        );

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.id}>
                        {label}
                        <textarea name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} placeholder={field.placeholder} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" rows="4" />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.id}>
                        {label}
                        <select name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                            <option value="">{field.placeholder || `Select a ${field.label}`}</option>
                            {field.options && field.options.split(',').map(opt => (
                                <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                        </select>
                    </div>
                );
            default: 
                return (
                    <div key={field.id}>
                        {label}
                        <input type={field.type} name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} placeholder={field.placeholder} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" />
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                    <p className="text-gray-400">Fill out the details below to create a new marketing request.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="space-y-6">
                        {Object.entries(groupedFields).map(([groupName, fields]) => (
                            <div key={groupName} className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">{groupName}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fields.map(field => (
                                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                            Create New Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskPage;