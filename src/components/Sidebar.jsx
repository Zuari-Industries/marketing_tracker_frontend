import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, PlusSquare, Users, GanttChartSquare,
    UserCog, FileUp, Settings, ChevronsLeft, ArrowRight, LogOut, Bell,X,ListChecks 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
    const { user, logout, getNotifications, markNotificationAsRead } = useAuth();
    const navigate = useNavigate();
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
 
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/'); 
        
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['User', 'Viewer', 'Admin', 'SuperAdmin'] },
        { icon: FileText, label: 'All Requests', path: '/requests', roles: ['User','Admin', 'SuperAdmin'] },
        { icon: PlusSquare, label: 'Create Task', path: '/create-task', roles: ['User', 'Admin'] },
        { icon: Users, label: 'Team Workload', path: '/workload', roles: ['SuperAdmin'] },
        { icon: GanttChartSquare, label: 'Gantt Overview', path: '/gantt', roles: ['Admin', 'SuperAdmin'] },
        { icon: UserCog, label: 'User Management', path: '/users', roles: ['SuperAdmin'] },
        { icon: FileUp, label: 'Data Import/Export', path: '/data-import', roles: ['SuperAdmin'] },
        { icon: Settings, label: 'Form Configuration', path: '/form-config', roles: ['SuperAdmin'] },
         { icon: ListChecks, label: 'Subtask Templates', path: '/subtask-templates', roles: ['Admin','SuperAdmin'] },
    ];

    const accessibleNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <aside className={`relative bg-gray-800 text-gray-300 h-screen flex flex-col border-r border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className="p-4 flex items-center border-b border-gray-700" style={{ minHeight: '65px' }}>
                {isExpanded && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ArrowRight className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-white">Marketing Hub</h1>
                    </div>
                )}
            </div>

            <div className={`p-4 flex items-center gap-3 border-b border-gray-700 ${isExpanded ? '' : 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                {isExpanded && (
                    <div className="overflow-hidden flex-1">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{user.role}</span>
                    </div>
                )}
                {isExpanded && user.role === 'SuperAdmin' && (
                    <div className="relative">
                        <button onClick={handleBellClick} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white">
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        {isPanelOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-30">
                                <div className="p-3 border-b border-gray-700">
                                    <h4 className="font-semibold text-white">Notifications</h4>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div key={notif.id} className="p-3 border-b border-gray-700 hover:bg-gray-800 flex items-start gap-3">
                                                <p className="text-sm text-gray-300 flex-1">{notif.message}</p>
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
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className={`px-2 text-xs font-semibold text-gray-500 uppercase ${isExpanded ? '' : 'text-center'}`}>{isExpanded ? 'Navigation' : 'Nav'}</p>
                {accessibleNavItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-700 transition-colors ${isActive ? 'bg-blue-600 text-white font-semibold' : ''} ${!isExpanded ? 'justify-center' : ''}`
                        }
                        title={item.label}
                    >
                        <item.icon size={20} />
                        {isExpanded && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-2 border-t border-gray-700">
                <button onClick={handleLogout} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors ${!isExpanded ? 'justify-center' : ''}`}>
                    <LogOut size={20} />
                    {isExpanded && <span className="font-medium">Log Out</span>}
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-700 text-gray-400 ${!isExpanded ? 'justify-center' : ''}`}>
                    <ChevronsLeft size={20} className={`transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
                    {isExpanded && <span className="font-medium">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;