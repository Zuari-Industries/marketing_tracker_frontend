import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import FormFieldCard from '../components/FormFieldCard';
import FormFieldModal from '../components/FormFieldModal';
import FormPreviewModal from '../components/FormPreviewModal'; 
import { Plus, Eye } from 'lucide-react';

const FormConfigurationPage = () => {
    const { formFields, addFormField, updateFormField, fetchFormFields,deleteFormField } = useAuth();
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); 
    const [editingField, setEditingField] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFields = async () => {
            setIsLoading(true);
            await fetchFormFields();
            setIsLoading(false);
        };
        loadFields();
    }, [fetchFormFields]);
    const groupedFields = formFields.reduce((acc, field) => {
        (acc[field.group] = acc[field.group] || []).push(field);
        return acc;
    }, {});

    const handleOpenFieldModal = (field = null) => {
        setEditingField(field);
        setIsFieldModalOpen(true);
    };

    const handleCloseFieldModal = () => {
        setIsFieldModalOpen(false);
        setEditingField(null);
    };

    const handleSaveField = (fieldData) => {
        if (fieldData.id) {
            updateFormField(fieldData);
        } else {
            addFormField(fieldData);
        }
        handleCloseFieldModal();
    };
    const handleDeleteField = (fieldId) => {
        if (window.confirm('Are you sure you want to delete this field? This cannot be undone.')) {
            deleteFormField(fieldId);
        }
    };
    if (isLoading) {
        return <div className="p-6 text-center text-gray-400">Loading form configuration...</div>;
    }
    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Form Fields Configuration</h2>
                        <p className="text-gray-400">Configure the fields users see when submitting requests.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsPreviewModalOpen(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold"
                        >
                            <Eye size={16} /> Preview Form
                        </button>
                        <button 
                            onClick={() => handleOpenFieldModal()} 
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                        >
                            <Plus size={16} /> Add Field
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.entries(groupedFields).map(([groupName, fields]) => (
                        <div key={groupName}>
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">{groupName}</h3>
                            <div className="space-y-3">
                                {fields.map(field => (
                                    <FormFieldCard key={field.id} field={field} onEdit={handleOpenFieldModal} onDelete={handleDeleteField} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
           {isFieldModalOpen && <FormFieldModal field={editingField} allFields={formFields} onClose={handleCloseFieldModal} onSave={handleSaveField} />}
            
            {isPreviewModalOpen && <FormPreviewModal onClose={() => setIsPreviewModalOpen(false)} />}
        </>
    );
};

export default FormConfigurationPage;