// FILE: src/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; 

const UserModal = ({ user, onClose, onSave }) => {
    const { businessUnits } = useAuth();
    const [formData, setFormData] = useState({
        name: '', email: '', role: 'User', businessUnit: businessUnits[0] || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
           
            setFormData({ name: '', email: '', role: 'User', businessUnit: businessUnits[0] || '' });
        }
    }, [user, businessUnits]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{user ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-700"><X size={20} className="text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" required />
                        </div>
                        {user && (
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Reset Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password || ''} 
                                    onChange={handleChange}
                                    placeholder="Enter new password to reset"
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" 
                                />
                            </div>
                        )}
                        {!user && (
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Set Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password || ''} 
                                    onChange={handleChange} 
                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600" 
                                    required 
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                                    <option>User</option>
                                    <option>Viewer</option>
                                    <option>Admin</option>
                                    <option>SuperAdmin</option>
                                </select>
                            </div>
                           
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Business Unit</label>
                                <select name="businessUnit" value={formData.businessUnit} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600">
                                    {businessUnits.map(bu => (
                                        <option key={bu} value={bu}>{bu}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 ml-2">{user ? 'Update User' : 'Add User'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;