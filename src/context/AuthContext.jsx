

import React, { useState, createContext, useMemo, useCallback,useEffect } from 'react';


const API_BASE = import.meta.env.VITE_API_URL;


const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        
    }
    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
   
    const data = await response.json();

    if (!response.ok) {
       
        throw new Error(data.message || 'An API error occurred');
    }
    return data;
};
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [comments, setComments] = useState({});
    const [history, setHistory] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const businessUnits = [...new Set(allUsers.map(u => u.businessUnit).filter(Boolean))];
    const [formFields, setFormFields] = useState([]);
    const [subtaskTemplates, setSubtaskTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const checkLoggedInUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                   
                    console.log("Token from localStorage:", token);

                    const response = await fetch('${API_BASE}/api/profile', {
                        headers: {
                            
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        console.error("Session token is invalid or expired.");
                        console.error(await response.text());

                        localStorage.removeItem('access_token');
                    }
                } catch (error) {
                    console.error("Failed to verify session:", error);
                    localStorage.removeItem('access_token');
                }
            }
            setIsLoading(false);
        };
        checkLoggedInUser();
    }, []);
const login = (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await apiFetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                localStorage.setItem('access_token', data.access_token);
                setUser(data.user);
                resolve(data.user);
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        
    };

const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await response.json();
};

const resetPassword = async (token, password) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  return await res.json();
};

    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch('${API_BASE}/api/requests');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks.');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, []);
    const updateTask = async (updatedTask) => {
        try {
            const response = await fetch(`${API_BASE}/api/requests/${updatedTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
          
            await fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };
    
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${API_BASE}/api/requests/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
           
            await fetchTasks(); 
        } catch (error){
            console.error("Error deleting task:", error);
        }
    };
// ...after deleteSubtask function

// --- ADD THIS ENTIRE BLOCK OF 3 FUNCTIONS ---
    const fetchSubtaskTemplates = useCallback(async () => {
        try {
            const data = await apiFetch('/api/subtask-templates');
            setSubtaskTemplates(data);
        } catch (error) {
            console.error("Error fetching subtask templates:", error);
        }
    }, []);

    const addSubtaskTemplate = async (templateData) => {
        try {
            await apiFetch('/api/subtask-templates', {
                method: 'POST',
                body: JSON.stringify(templateData),
            });
            await fetchSubtaskTemplates(); // Refresh the list
        } catch (error) {
            console.error("Error adding subtask template:", error);
        }
    };

    const deleteSubtaskTemplate = async (templateId) => {
        try {
            await apiFetch(`/api/subtask-templates/${templateId}`, {
                method: 'DELETE',
            });
            await fetchSubtaskTemplates(); // Refresh the list
        } catch (error) {
            console.error("Error deleting subtask template:", error);
        }
    };
// --- END OF NEW BLOCK ---

  
const getSubtasksForRequest = async (requestId) => {
        try {
            const response = await fetch(`${API_BASE}/api/requests/${requestId}/subtasks`);
            if (!response.ok) throw new Error('Failed to fetch subtasks');
            return await response.json();
        } catch (error) {
            console.error("Error fetching subtasks:", error);
            return [];
        }
    };

    const addSubtask = async (requestId, subtaskData) => {
        try {
            await fetch(`${API_BASE}/api/requests/${requestId}/subtasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subtaskData),
            });
        } catch (error) {
            console.error("Error adding subtask:", error);
        }
    };

const updateSubtask = async (subtaskData) => { // Ab requestId ki zaroorat nahin
    try {
        await apiFetch(`/api/subtasks/${subtaskData.id}`, { // apiFetch ka istemal
            method: 'PUT',
            body: JSON.stringify(subtaskData), // Poora subtaskData object bhejein
        });
    } catch (error) {
        console.error("Error updating subtask:", error);
    }
};

   const deleteSubtask = async (requestId, subtaskId) => {
        try {
            const response = await fetch(`${API_BASE}/api/subtasks/${subtaskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete subtask');
            }
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
    };
    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch('${API_BASE}/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, []);

    const addUser = async (userData) => {
        try {
            const response = await fetch('${API_BASE}/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add user');
            }

            alert(`User "${userData.name}" created successfully!`);
            
            await fetchUsers(); 
        } catch (error) {
            console.error("Error adding user:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const updateUser = async (updatedUserData) => {
        try {
            await fetch(`${API_BASE}/api/users/${updatedUserData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData),
            });
            await fetchUsers(); 
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await fetch(`${API_BASE}/api/users/${userId}`, {
                method: 'DELETE',
            });
            await fetchUsers(); 
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
  const fetchFormFields = useCallback(async () => {
        try {
            const response = await fetch('${API_BASE}/api/form-fields');
            if (!response.ok) throw new Error('Failed to fetch form fields');
            const data = await response.json();
            setFormFields(data);
        } catch (error) {
            console.error("Error fetching form fields:", error);
        }
    }, []);

    const addFormField = async (fieldData) => {
        try {
            await fetch('${API_BASE}/api/form-fields', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fieldData),
            });
            await fetchFormFields(); 
        } catch (error) {
            console.error("Error adding form field:", error);
        }
    };
const deleteFormField = async (fieldId) => {
        try {
            const response = await fetch(`${API_BASE}/api/form-fields/${fieldId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete form field');
            }
            await fetchFormFields(); 
        } catch (error) {
            console.error("Error deleting form field:", error);
        }
    };
  const updateFormField = async (updatedField) => {
        try {
            const response = await fetch(`${API_BASE}/api/form-fields/${updatedField.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedField),
            });
            if (!response.ok) {
                throw new Error('Failed to update form field');
            }
            await fetchFormFields(); 
        } catch (error) {
            console.error("Error updating form field:", error);
        }
    };
    const getCommentsForRequest = useCallback(async (requestId) => {
        const response = await fetch(`${API_BASE}/api/requests/${requestId}/comments`);
        return await response.json();
    }, []);

    // Purane addComment function ko isse replace karein
    const addComment = useCallback(async (requestId, commentData) => {
        try {
            await fetch(`${API_BASE}/api/requests/${requestId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...commentData, 
                    userId: user.id // YEH LINE SABSE ZAROORI HAI
                }),
            });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }, [user]); // user ko dependency array mein add karein

    const updateCommentAction = useCallback(async (commentId, actionStatus) => {
        await fetch(`${API_BASE}/api/comments/${commentId}/action`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actionStatus }),
        });
    }, []);
    
    const getHistoryForRequest = useCallback(async (requestId) => {
        const response = await fetch(`${API_BASE}/api/requests/${requestId}/history`);
        return await response.json();
    }, []);
    const importTasks = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('${API_BASE}/api/requests/import', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'File import failed.');
            }
            await fetchTasks();
            return data; 
        } catch (error) {
            console.error("Error importing tasks:", error);
            throw error; 
        }
    };
    const addTask = async (taskData) => {
        try {
            const response = await fetch('${API_BASE}/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...taskData,
                    userId: user.id 
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create task on the server.');
            }
            await fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };
const exportTasksToCSV = (tasksToExport) => {
        if (!tasksToExport || tasksToExport.length === 0) {
            alert("No data to export.");
            return;
        }
        
       
        const headers = ['Request', 'Type', 'Status', 'Priority', 'Requester', 'Business Unit', 'Due Date', 'Assignee', 'Admin Remarks'];
        const csvRows = tasksToExport.map(task => 
            [
                `"${task.title || ''}"`,
                `"${task.type || 'Other'}"`,
                `"${task.status || ''}"`,
                `"${task.priority || 'Medium'}"`,
                `"${task.requester || ''}"`,
                `"${task.businessUnit || ''}"`,
                `"${task.dueDate || 'No deadline'}"`,
                `"${task.assignee || 'Unassigned'}"`,
                `"${(task.adminRemarks || '').replace(/"/g, '""')}"` 
            ].join(',')
        );

        const csvString = [headers.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "marketing_requests_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
const getNotifications = useCallback(async () => {
        if (!user) return [];
        try {
           
            const response = await fetch(`${API_BASE}/api/notifications?userId=${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch notifications');
            return await response.json();
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    }, [user]); 
    const markNotificationAsRead = useCallback(async (notificationId) => {
        try {
            await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }, []);

   const value = useMemo(() => ({
        user, 
        selectedRole, 
        setSelectedRole, 
        login, 
        logout, 
        tasks, 
        updateTask,
        fetchTasks, 
        getSubtasksForRequest, 
        addSubtask, 
        updateSubtask, 
        deleteSubtask, 
        allUsers,
        addUser,
        updateUser,
        deleteUser,
        getCommentsForRequest,
        businessUnits, 
        addComment, 
        updateCommentAction, 
        getHistoryForRequest ,
         formFields,
        fetchFormFields,
        deleteFormField ,
        addFormField,
        updateFormField,
        importTasks,
        addTask,
        deleteTask,
        exportTasksToCSV,
        fetchUsers,
        getNotifications,
        markNotificationAsRead,
        forgotPassword,
        resetPassword,
        isLoading,
        subtaskTemplates,
        fetchSubtaskTemplates,
        addSubtaskTemplate,
        deleteSubtaskTemplate
     }), [user, selectedRole,isLoading, tasks, allUsers, resetPassword,fetchTasks,formFields,isLoading, fetchFormFields,businessUnits,forgotPassword, subtaskTemplates]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};