// FILE: src/components/MultiSelectDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const MultiSelectDropdown = ({ options, selectedOptions, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleOption = (optionName) => {
        const newSelection = selectedOptions.includes(optionName)
            ? selectedOptions.filter(item => item !== optionName)
            : [...selectedOptions, optionName];
        onChange(newSelection);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full md:w-48" ref={dropdownRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
            >
                <span className="truncate">
                    {selectedOptions.length > 0 ? `${selectedOptions.length} Admin(s) Selected` : placeholder}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <ul className="max-h-60 overflow-y-auto p-2">
                        {options.map(option => (
                            <li key={option.id}>
                                <label className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.name)}
                                        onChange={() => handleToggleOption(option.name)}
                                        className="form-checkbox bg-gray-600 border-gray-500 rounded text-blue-500"
                                    />
                                    <span className="text-white">{option.name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
