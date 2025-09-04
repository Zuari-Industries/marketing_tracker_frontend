import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const location = useLocation();

    
    const getPageTitle = (pathname) => {
        if (!pathname) return 'Dashboard';
        const segments = pathname.split('/').filter(Boolean); 
        const lastSegment = segments.pop() || 'dashboard';
        const title = lastSegment.replace('-', ' ');
        return title.charAt(0).toUpperCase() + title.slice(1);
    };

    return (
        <div className="flex bg-gray-900 h-screen overflow-hidden">
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title={getPageTitle(location.pathname)} />
                <main className="flex-1 p-6 bg-gray-900 text-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;