
import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

const FormFieldModal = ({ field,allFields, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        label: '', name: '', type: 'text', group: 'Basic Information', placeholder: '', helpText: '', required: false, active: true, options: '',dependsOnFieldName: null, 
    dependsOnFieldValue: ''
    });

    useEffect(() => {
        if (field) {
            setFormData(field);
        } else {
            
            setFormData({ label: '', name: '', type: 'text', group: 'Basic Information', placeholder: '', helpText: '', required: false, active: true, options: '' });
        }
    }, [field]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // --- YEH POORA FUNCTION ADD KAREIN ---
// --- Is poore function ko naye code se replace karein ---
const handleDependencyChange = (e) => {
    const { name, value, checked } = e.target; // 'checked' ko yahan lein

    if (name === 'enableDependency') {
        if (checked) {
            // Agar user checkbox ko ON karta hai, to hum fieldName ko khali string set karenge
            // Isse aage ka form dikhega aur user ko ek field select karna padega
            setFormData(prev => ({ ...prev, dependsOnFieldName: '' }));
        } else {
            // Agar user checkbox ko OFF karta hai, to dependency poori tarah se clear ho jayegi
            setFormData(prev => ({ ...prev, dependsOnFieldName: null, dependsOnFieldValue: '' }));
        }
    } else {
         // Yeh dropdown aur text input ke changes ko handle karega
         setFormData(prev => ({ ...prev, [name]: value }));
    }
};
    const handleSubmit = (e) => {
        e.preventDefault();
         const dataToSave = { ...formData };
    // Agar dependency set nahin hai, to value bhi khali honi chahiye
    if (!dataToSave.dependsOnFieldName) {
        dataToSave.dependsOnFieldValue = '';
    }
        onSave(dataToSave);
    };
// --- RETURN SE PEHLE YEH LINE ADD KAREIN ---
const potentialControllers = allFields.filter(f => f.type === 'select' && f.id !== formData.id);
const controllerOptions = useMemo(() => {
    if (!formData.dependsOnFieldName) return [];
    
    const controllerField = allFields.find(f => f.name === formData.dependsOnFieldName);
    
    if (controllerField && controllerField.options) {
        return controllerField.options.split(',').map(opt => opt.trim());
    }
    
    return [];
}, [formData.dependsOnFieldName, allFields]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
           <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{field ? 'Edit Field' : 'Add New Field'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-700"><X size={20} className="text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                     <div className="p-6 overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Field Label (Display)</label>
                            <input type="text" name="label" value={formData.label} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Field Name (Internal)</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Field Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                                <option value="text">Text Input</option>
                                <option value="textarea">Text Area</option>
                                <option value="select">Select Dropdown</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Field Group</label>
                            <select name="group" value={formData.group} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                                <option>Basic Information</option>
                                <option>Project Details</option>
                                <option>Logistics</option>
                                <option>System Fields</option>
                            </select>
                        </div>
                        {formData.type === 'select' && (
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-400 block mb-1">Dropdown Options</label>
                                <textarea 
                                    name="options" 
                                    value={formData.options || ''} 
                                    onChange={handleChange} 
                                    rows="2" 
                                    placeholder="Enter options, separated by commas (e.g., Option 1, Option 2)"
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
                                ></textarea>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-400 block mb-1">Placeholder Text</label>
                            <input type="text" name="placeholder" value={formData.placeholder || ''} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-400 block mb-1">Help Text</label>
                            <textarea name="helpText" value={formData.helpText || ''} onChange={handleChange} rows="2" className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"></textarea>
                        </div>
                        <div className="md:col-span-2 flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input type="checkbox" name="required" checked={formData.required} onChange={handleChange} className="form-checkbox bg-gray-600 border-gray-500 rounded text-blue-500" />
                                Required
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="form-checkbox bg-gray-600 border-gray-500 rounded text-blue-500" />
                                Active
                            </label>
                        </div>
                    </div>
                    {/* --- YEH POORA CONDITIONAL LOGIC SECTION ADD KAREIN --- */}
<div className="mt-6 pt-4 border-t border-gray-700">
    <h4 className="text-lg font-semibold mb-3">Conditional Logic</h4>
    <label className="flex items-center gap-2 text-gray-300">
    <input 
        type="checkbox" 
        name="enableDependency" 
        // Checkbox tab checked hoga jab fieldName 'null' na ho
        checked={formData.dependsOnFieldName !== null} 
        onChange={handleDependencyChange} 
        className="form-checkbox bg-gray-600 border-gray-500 rounded text-blue-500"
    />
    Make this field dependent on another field's value
</label>

    {/* Yeh form tabhi dikhega jab checkbox checked ho */}
   {formData.dependsOnFieldName !== null && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-bold text-gray-400 block mb-1">Show this field IF:</label>
                <select 
                    name="dependsOnFieldName" 
                    value={formData.dependsOnFieldName} 
                    onChange={handleDependencyChange} 
                    className="bg-gray-700 p-2 rounded w-full"
                >
                    <option value="">-- Select a Field --</option>
                    {potentialControllers.map(f => <option key={f.id} value={f.name}>{f.label}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-bold text-gray-400 block mb-1">Has the value:</label>
                <select
        name="dependsOnFieldValue"
        value={formData.dependsOnFieldValue || ''}
        onChange={handleDependencyChange}
        className="bg-gray-700 p-2 rounded w-full"
    >
        <option value="">-- Select a value --</option>
        {controllerOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
            </div>
        </div>
    )}
</div>
</div>
                    <div className="flex justify-end items-center p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-lg flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 ml-2">{field ? 'Update Field' : 'Add Field'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormFieldModal;