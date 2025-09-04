// src/pages/GanttOverviewPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import GanttChart from '../components/GanttChart';
import FilterDropdown from '../components/FilterDropdown';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GanttOverviewPage = () => {
    const { tasks, fetchTasks } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date('2025-08-01'));
    const [viewMode, setViewMode] = useState('Month');
    const [buFilter, setBuFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    // NEW: State to track expanded tasks using a Set for efficiency
    const [expandedTasks, setExpandedTasks] = useState(new Set());

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDateChange = (increment) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            if (viewMode === 'Month') {
                newDate.setMonth(newDate.getMonth() + increment);
            } else if (viewMode === 'Week') {
                newDate.setDate(newDate.getDate() + (increment * 7));
            }
            return newDate;
        });
    };

    // NEW: Toggles a task's ID in the expandedTasks set
    const toggleTaskExpansion = (taskId) => {
        setExpandedTasks(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(taskId)) {
                newExpanded.delete(taskId);
            } else {
                newExpanded.add(taskId);
            }
            return newExpanded;
        });
    };

    const timelineData = useMemo(() => {
        let filteredTasks = tasks;
        if (buFilter !== 'All') filteredTasks = filteredTasks.filter(t => t.businessUnit === buFilter);
        if (statusFilter !== 'All') filteredTasks = filteredTasks.filter(t => t.status === statusFilter);

        const data = [];
        filteredTasks.forEach(task => {
            // Add the main task
            if (task.dueDate && !isNaN(new Date(task.dueDate))) {
                const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                data.push({
                    id: task.id, // Make sure each task has a unique 'id'
                    title: task.title,
                    startDate: task.dueDate,
                    endDate: new Date(new Date(task.dueDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isSubtask: false,
                    hasSubtasks: hasSubtasks,
                    isExpanded: expandedTasks.has(task.id),
                });
            }

            // MODIFIED: Only add subtasks if the parent task is expanded
            if (expandedTasks.has(task.id) && task.subtasks && task.subtasks.length > 0) {
                task.subtasks.forEach(sub => {
                    if (sub.startDate && sub.endDate) {
                        data.push({
                            id: `${task.id}-${sub.id}`, // Create a unique ID for the subtask
                            title: `    ↳ ${sub.title}`, // Indent subtask
                            startDate: sub.startDate,
                            endDate: sub.endDate,
                            isSubtask: true,
                        });
                    }
                });
            }
        });
        return data;
    }, [tasks, buFilter, statusFilter, expandedTasks]); // Dependency added

    const businessUnits = ['All', 'Infra', 'Snackpure', 'Marketing', 'Strategy'];
    const statuses = ['All', 'Not Started', 'In Progress', 'On Hold', 'Completed'];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Gantt Overview</h2>
                <p className="text-gray-400">Complete timeline view of all requests and subtasks.</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        {/* Date and View controls remain the same */}
                        <div className="flex items-center border border-gray-600 rounded-md">
                            <button onClick={() => handleDateChange(-1)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-l-md"><ChevronLeft size={20} /></button>
                            <span className="px-4 text-lg font-semibold text-white w-36 text-center border-x border-gray-600">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={() => handleDateChange(1)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-r-md"><ChevronRight size={20} /></button>
                        </div>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold rounded-md border border-gray-600 hover:bg-gray-700">Today</button>
                        <FilterDropdown
                            label={`${viewMode} View`}
                            options={['Month', 'Week']}
                            selectedValue={viewMode}
                            onSelect={setViewMode}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Filter controls remain the same */}
                        <FilterDropdown label="All Business Units" options={businessUnits} selectedValue={buFilter} onSelect={setBuFilter} />
                        <FilterDropdown label="All Statuses" options={statuses} selectedValue={statusFilter} onSelect={setStatusFilter} />
                        {/* REMOVED: "Show Subtasks" checkbox is no longer needed */}
                        <button onClick={() => { setBuFilter('All'); setStatusFilter('All'); }} className="text-sm text-gray-400 hover:text-white px-3 py-2 flex items-center gap-1">
                            <X size={14} /> Clear
                        </button>
                    </div>
                </div>

                {/* NEW: Pass the toggle function to the GanttChart component */}
                <GanttChart data={timelineData} currentDate={currentDate} viewMode={viewMode} onTaskClick={toggleTaskExpansion} />
            </div>
        </div>
    );
};

export default GanttOverviewPage;