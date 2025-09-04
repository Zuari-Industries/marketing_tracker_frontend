import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AllRequestsTable from '../components/AllRequestsTable';
import FilterDropdown from '../components/FilterDropdown';
import StatCard from '../components/StatCard';
import RequestDetailsModal from '../components/RequestDetailsModal';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { FileText, Clock, AlertTriangle, CheckCircle, Search, Download, Trash2, X, CheckCircle2 } from 'lucide-react';

const AllRequestsPage = () => {
   const { tasks, user, updateTask, fetchTasks,allUsers, fetchUsers, exportTasksToCSV} = useAuth(); 
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All'); 
    const [buFilter, setBuFilter] = useState('All'); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [adminFilter, setAdminFilter] = useState([]); // For multi-select
    const [sortBy, setSortBy] = useState('dueDate'); // Default sort
    const [sortOrder, setSortOrder] = useState('desc'); // Default order

   useEffect(() => {
        const loadData = async () => {
            if (user) {
                setIsLoading(true);
                await fetchTasks();
                 await fetchUsers();
                setIsLoading(false);
            }
        };
        loadData();
    }, [user, fetchTasks,fetchUsers]);
    
   const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        let tasksToFilter;
        if (user.role === 'SuperAdmin' || user.role === 'Admin') {
            tasksToFilter = tasks; 
        } else if (user.role === 'User') {
            tasksToFilter = tasks.filter(task => task.requester === user.name); 
        } else {
            tasksToFilter = []; 
        }

        if (searchTerm) {
            tasksToFilter = tasksToFilter.filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'All') {
            tasksToFilter = tasksToFilter.filter(task => task.status === statusFilter);
        }
         if (typeFilter !== 'All') {
            tasksToFilter = tasksToFilter.filter(task => task.type === typeFilter);
        }
        if (buFilter !== 'All') {
            tasksToFilter = tasksToFilter.filter(task => task.businessUnit === buFilter);
        }
         if (user.role === 'SuperAdmin' && adminFilter.length > 0) {
            tasksToFilter = tasksToFilter.filter(task => adminFilter.includes(task.assignee));
        }

        // NAYA: Sorting logic
        return [...tasksToFilter].sort((a, b) => {
            const dateA = a[sortBy] ? new Date(a[sortBy]) : 0;
            const dateB = b[sortBy] ? new Date(b[sortBy]) : 0;
            if (!dateA) return 1; // Null dates ko neeche rakhein
            if (!dateB) return -1;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        
    }, [tasks, user.role, user.name, searchTerm, statusFilter,typeFilter, buFilter, adminFilter, sortBy, sortOrder]);

    if (isLoading) {
        return <div className="p-6 text-center text-gray-400">Loading requests from database...</div>;
    }

    if (!user || !tasks) {
        return <div className="p-6 text-white">Loading...</div>;
    }

    const handleActionClick = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleSaveChanges = (updatedRequest) => {
        updateTask(updatedRequest);
        setShowSaveConfirmation(true);
    };
    const handleToggleRow = (taskId) => {
        setExpandedRowId(prevId => (prevId === taskId ? null : taskId));
    };

    const stats = [
        { title: 'Total Requests', value: filteredTasks.length, icon: FileText, color: 'blue' },
        { title: 'In Progress', value: filteredTasks.filter(t => t.status === 'In Progress').length, icon: Clock, color: 'purple' },
        { title: 'Completed', value: filteredTasks.filter(t => t.status === 'Completed').length, icon: CheckCircle, color: 'green' },
    ];

    return (
        <>
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">All Requests</h2>
                    <p className="text-gray-400">Manage and track all work requests across business units.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                    {stats.map(stat => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <div className="relative w-full md:w-64 flex-shrink-0">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search requests..." 
                                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                           
                            <div className="flex items-center gap-2 w-full flex-wrap">
                                <FilterDropdown 
                                    label="All Statuses"
                                    options={['All', 'Not Started', 'In Progress', 'On Hold', 'Completed']}
                                    selectedValue={statusFilter}
                                    onSelect={setStatusFilter}
                                />
                                <FilterDropdown label="All Types" options={['All', 'Creative', 'Campaign', 'Social Post', 'Event','Other']} selectedValue={typeFilter} onSelect={setTypeFilter} />
                                <FilterDropdown label="All BUs" options={['All','Infra', 'Snackpure', 'Marketing', 'Strategy']} selectedValue={buFilter} onSelect={setBuFilter} />
                                   {user.role === 'SuperAdmin' && (
                                    <>
                                        <MultiSelectDropdown
                                            options={allUsers.filter(u => u.role === 'Admin')}
                                            selectedOptions={adminFilter}
                                            onChange={setAdminFilter}
                                            placeholder="Filter by Admin"
                                        />
                                        <div className="flex items-center bg-gray-700 rounded-lg">
                                            <button onClick={() => setSortBy('createdAt')} className={`px-3 py-2 text-sm rounded-l-lg ${sortBy === 'createdAt' ? 'bg-blue-600 text-white' : ''}`}>Start Date</button>
                                            <button onClick={() => setSortBy('dueDate')} className={`px-3 py-2 text-sm rounded-r-lg ${sortBy === 'dueDate' ? 'bg-blue-600 text-white' : ''}`}>End Date</button>
                                        </div>
                                        <div className="flex items-center bg-gray-700 rounded-lg">
                                            <button onClick={() => setSortOrder('asc')} className={`px-3 py-2 text-sm rounded-l-lg ${sortOrder === 'asc' ? 'bg-blue-600 text-white' : ''}`}>Asc</button>
                                            <button onClick={() => setSortOrder('desc')} className={`px-3 py-2 text-sm rounded-r-lg ${sortOrder === 'desc' ? 'bg-blue-600 text-white' : ''}`}>Desc</button>
                                        </div>
                                    </>
                                )}
                                <button onClick={() => { setSearchTerm(''); setStatusFilter('All'); setTypeFilter('All'); setBuFilter('All'); }} className="text-sm text-gray-400 hover:text-white px-3 py-2 flex items-center gap-1">
                                    <X size={14}/> Clear
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm w-full justify-center">
                                <Download size={16} /> CSV
                            </button>
                            
                        <button 
                            onClick={() => exportTasksToCSV(filteredTasks)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full justify-center"
                                 >
                            <Download size={16} /> Export
                        </button>

                            
                        </div>
                    </div>
                </div>

                <AllRequestsTable tasks={filteredTasks} onActionClick={handleActionClick}  expandedRowId={expandedRowId}
    onToggleRow={handleToggleRow}/>
            </div>

            {isModalOpen && (
                <RequestDetailsModal 
                    request={selectedRequest} 
                    onClose={handleCloseModal} 
                    onSave={handleSaveChanges}
                    allUsers={allUsers}
                />
            )}

            {showSaveConfirmation && (
                <div className="fixed bottom-5 right-5 bg-gray-800 border border-green-500/50 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <p className="text-sm font-medium">Changes saved successfully!</p>
                </div>
            )}
        </>
    );
};

export default AllRequestsPage;