
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full md:w-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex-shrink-0 w-full flex items-center justify-between bg-gray-700/50 text-white rounded-lg px-4 py-2 text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span>{selectedValue === 'All' ? label : selectedValue}</span>
                <ChevronDown size={16} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full md:w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    {options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;