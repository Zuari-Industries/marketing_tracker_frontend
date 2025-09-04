import React, { useState,  useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import UserModal from '../components/UserModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const UserManagementPage = () => {
    const { allUsers, user: currentUser, addUser, updateUser, deleteUser,fetchUsers} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
       
        fetchUsers();
    }, [fetchUsers]);
    if (!allUsers || !currentUser) {
        return <div className="p-6 text-white">Loading...</div>;
    }

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userData) => {
        if (userData.id) {
            updateUser(userData);
        } else {
            addUser(userData);
        }
        handleCloseModal();
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    const getRoleChipClass = (role) => {
        switch (role) {
            case 'SuperAdmin': return 'bg-red-500/50 text-red-300';
            case 'Admin': return 'bg-blue-500/50 text-blue-300';
            case 'User': return 'bg-green-500/50 text-green-300';
            default: return 'bg-gray-600 text-gray-300';
        }
    };

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">User Management</h2>
                        <p className="text-gray-400">Manage user roles and permissions.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                        <Plus size={16} /> Add New User
                    </button>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Business Unit</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{user.name}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleChipClass(user.role)}`}>{user.role}</span></td>
                                    <td className="px-6 py-4">{user.businessUnit || 'Not specified'}</td>
                                    <td className="px-6 py-4">{user.joined}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-400 hover:text-blue-400"><Edit size={16} /></button>
                                            {currentUser.id !== user.id && (
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <UserModal user={editingUser} onClose={handleCloseModal} onSave={handleSaveUser} />}
        </>
    );
};

export default UserManagementPage;