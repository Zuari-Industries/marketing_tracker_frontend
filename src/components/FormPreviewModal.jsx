
import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X } from 'lucide-react';

const FormPreviewModal = ({ onClose }) => {
    const { formFields } = useAuth();

    const groupedFields = useMemo(() => {
        return formFields.reduce((acc, field) => {
            if (field.active) {
                (acc[field.group] = acc[field.group] || []).push(field);
            }
            return acc;
        }, {});
    }, [formFields]);

    const renderField = (field) => {
        const label = (
            <label className="text-sm font-semibold text-gray-300 block mb-2">
                {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
        );

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.id}>
                        {label}
                        <textarea placeholder={field.placeholder} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" rows="3" readOnly />
                        {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                    </div>
                );
            case 'select':
                return (
                    <div key={field.id}>
                        {label}
                        <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                            <option value="">{field.placeholder || `Select a ${field.label}`}</option>
                            {field.options && field.options.split(',').map(opt => (
                                <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                        </select>
                         {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                    </div>
                );
            case 'date':
                 return (
                    <div key={field.id}>
                        {label}
                        <input
                            type="date"
                            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
                        />
                         {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                    </div>
                );
            default: 
                return (
                    <div key={field.id}>
                        {label}
                        <input type="text" placeholder={field.placeholder} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" readOnly />
                         {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Form Preview</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-700"><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {Object.entries(groupedFields).map(([groupName, fields]) => (
                        <div key={groupName} className="space-y-4">
                             <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">{groupName}</h3>
                             {fields.map(renderField)}
                        </div>
                    ))}
                </div>
                 <div className="flex justify-end items-center p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Close Preview</button>
                </div>
            </div>
        </div>
    );
};

export default FormPreviewModal;