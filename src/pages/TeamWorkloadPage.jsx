import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import WorkloadCard from '../components/WorkloadCard';
import FilterDropdown from '../components/FilterDropdown';
import { Users, UserCheck, ShieldCheck, ListTodo, X, User, Eye } from 'lucide-react';

const TeamWorkloadPage = () => {
    const { tasks ,allUsers} = useAuth(); 
    const [teamData, setTeamData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('Admin');
    const [buFilter, setBuFilter] = useState('All');
    const [adminFilter, setAdminFilter] = useState('All');
    const admins = useMemo(() => 
        allUsers.filter(user => user.role === 'Admin'), 
    [allUsers]);
    useEffect(() => {
        const fetchWorkload = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('${API_BASE}/api/workload');
                const data = await response.json();
                setTeamData(data);
            } catch (error) {
                console.error("Failed to fetch workload data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkload();
    }, []);

    const filteredTeamData = useMemo(() => {
        let dataToFilter = teamData; 

        if (roleFilter !== 'All') {
            dataToFilter = dataToFilter.filter(u => u.role === roleFilter);
        }
        if (buFilter !== 'All') {
            dataToFilter = dataToFilter.filter(u => u.businessUnit === buFilter);
        }
        if (adminFilter !== 'All') {
            dataToFilter = dataToFilter.filter(u => u.name === adminFilter);
        }
        return dataToFilter;
    }, [teamData, roleFilter, buFilter,adminFilter]);
   
    const stats = useMemo(() => ({
        totalMembers: teamData.length,
        admins: teamData.filter(u => u.role === 'Admin').length,
        superAdmins: teamData.filter(u => u.role === 'SuperAdmin').length,
        users: teamData.filter(u => u.role === 'User').length,
        viewers: teamData.filter(u => u.role === 'Viewer').length,
        activeTasks: teamData.reduce((acc, user) => acc + (user.workload ? user.workload.active : 0), 0),
    }), [teamData]);
    
   
    const businessUnits = ['All', ...new Set(teamData.map(u => u.businessUnit).filter(Boolean))];
    if (isLoading) {
        return <div className="p-6 text-center text-gray-400">Loading team workload data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Team Workload</h2>
                <p className="text-gray-400">View team member workload and performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                <StatCard title="Total Members" value={stats.totalMembers} icon={Users} color="blue" />
                <StatCard title="Super Admins" value={stats.superAdmins} icon={ShieldCheck} color="green" />
                <StatCard title="Admins" value={stats.admins} icon={UserCheck} color="purple" />
                <StatCard title="Users" value={stats.users} icon={User} color="orange" />
                <StatCard title="Viewers" value={stats.viewers} icon={Eye} color="blue" />
                <StatCard title="Active Tasks" value={stats.activeTasks} icon={ListTodo} color="red" />
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
                
                <FilterDropdown 
                    label="All Business Units"
                    options={businessUnits}
                    selectedValue={buFilter}
                    onSelect={setBuFilter}
                />
                 <FilterDropdown 
                    label="All Admins"
                    options={['All', ...admins.map(a => a.name)]}
                    selectedValue={adminFilter}
                    onSelect={setAdminFilter}
                />
                <button onClick={() => { setRoleFilter('All'); setBuFilter('All');setAdminFilter('All'); }} className="text-sm text-gray-400 hover:text-white px-3 py-2 flex items-center gap-1 ml-auto">
                    <X size={14}/> Clear Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredTeamData.map(member => (
                    <WorkloadCard key={member.id} member={member} />
                ))}
            </div>
             {filteredTeamData.length === 0 && (
                <div className="col-span-full text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400">No team members match the current filters.</p>
                </div>
            )}
        </div>
    );
};

export default TeamWorkloadPage;