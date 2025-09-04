import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Search, Bell, X } from 'lucide-react';

const Header = ({ title }) => {
    const { user, getNotifications, markNotificationAsRead } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fetchNotifications = async () => {
        if (user.role === 'SuperAdmin') {
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
        }
    };

    const handleBellClick = () => {
        if (!isPanelOpen) {
            fetchNotifications();
        }
        setIsPanelOpen(!isPanelOpen);
    };

    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20 py-4 px-6 flex items-center justify-between border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white">
                    <Search size={20} />
                </button>
                {user.role === 'SuperAdmin' && (
                    <div className="relative">
                        <button onClick={handleBellClick} className="text-gray-400 hover:text-white relative">
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {isPanelOpen && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                                <div className="p-3 border-b border-gray-700">
                                    <h4 className="font-semibold text-white">Notifications</h4>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div key={notif.id} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 flex items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-300">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                                                </div>
                                                <button onClick={() => handleMarkAsRead(notif.id)} title="Mark as read" className="p-1 text-gray-500 hover:text-white">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center p-4">No new notifications.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;