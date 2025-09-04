
import React from 'react';
import { Edit, Copy, Trash2, GripVertical } from 'lucide-react';

const FormFieldCard = ({ field, onEdit,onDelete }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <button className="text-gray-500 cursor-grab"><GripVertical size={20} /></button>
            <div className="flex-1">
                <p className="font-semibold text-white">{field.label}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>Type: <span className="font-mono text-gray-300">{field.type}</span></span>
                    <span className="text-gray-600">|</span>
                    <span className="truncate">Placeholder: <span className="font-mono text-gray-300">{field.placeholder}</span></span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"><Copy size={16} /></button>
                <button onClick={() => onEdit(field)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"><Edit size={16} /></button>
                <button 
                 onClick={() => onDelete(field.id)} 
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

export default FormFieldCard;