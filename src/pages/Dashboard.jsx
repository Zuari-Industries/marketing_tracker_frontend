import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/StatCard';
import { FileText, Clock, AlertTriangle, CalendarClock, CheckCircle } from 'lucide-react';
import GanttChart from '../components/GanttChart';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

// --- View for Admins and SuperAdmins ---
const AdminDashboardView = () => {
    const { tasks, fetchTasks } = useAuth();
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            await fetchTasks();
            try {
                const response = await fetch('${API_BASE}/api/dashboard-stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [fetchTasks]);

    const timelineData = useMemo(() => {
        if (!tasks || tasks.length === 0) return [];
        return tasks.filter(task => task.dueDate).map(task => ({
            title: task.title,
            startDate: task.dueDate,
            endDate: new Date(new Date(task.dueDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));
    }, [tasks]);

    const statCards = [
        { title: 'Total Requests', value: stats.totalRequests, icon: FileText, color: 'blue' },
        { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'purple' },
        { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
            <p className="text-gray-400 mb-6">Oversee all marketing requests and project progress.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map(stat => (
                    <StatCard key={stat.title} {...stat} value={isLoading ? '...' : stat.value} />
                ))}
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Project Timeline</h3>
                {isLoading ? (
                    <div className="h-96 flex items-center justify-center text-gray-500">Loading timeline...</div>
                ) : (
                    <GanttChart data={timelineData} currentDate={new Date()} />
                )}
            </div>
        </div>
    );
};

// --- View for Users and Viewers ---
const UserDashboardView = () => {
    const { user, tasks, fetchTasks } = useAuth();
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true);
            await fetchTasks();
            try {
                const response = await fetch(`${API_BASE}/api/dashboard-stats?userId=${user.id}`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) {
            loadUserData();
        }
    }, [user, fetchTasks]);

    const myTasks = useMemo(() => {
        if (!tasks) return [];
        return tasks.filter(task => task.requester === user.name).slice(0, 5);
    }, [tasks, user.name]);

    const statCards = [
        { title: 'My Total Requests', value: stats.totalRequests, icon: FileText, color: 'blue' },
        { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'purple' },
        { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-2">My Dashboard</h2>
            <p className="text-gray-400 mb-6">Track the status of your submitted requests.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map(stat => (
                    <StatCard key={stat.title} {...stat} value={isLoading ? '...' : stat.value} />
                ))}
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">My Recent Requests</h3>
                    <Link to="/requests" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                </div>
                {isLoading ? (
                     <div className="text-center text-gray-500 py-8">Loading requests...</div>
                ) : (
                    <ul className="space-y-3">
                        {myTasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                <span className="text-white font-medium">{task.title}</span>
                                <span className="text-xs text-gray-400 font-semibold px-2 py-1 bg-gray-700 rounded-full">{task.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
const Dashboard = () => {
   
 const { user } = useAuth();

    if (!user) {
        return <div className="p-6 text-center text-gray-400">Loading user data...</div>;
    }
    if (user.role === 'SuperAdmin' || user.role === 'Admin') {
        return <AdminDashboardView />;
    } else {
        return <UserDashboardView />;
    }
};

export default Dashboard;