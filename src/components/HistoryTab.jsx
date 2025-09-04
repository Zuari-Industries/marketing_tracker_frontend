
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';

const HistoryTab = ({ requestId }) => {
    const { getHistoryForRequest } = useAuth();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadHistory = useCallback(async () => {
        if (!requestId) return;
        setIsLoading(true);
        const fetchedHistory = await getHistoryForRequest(requestId);
        setHistory(fetchedHistory);
        setIsLoading(false);
    }, [requestId, getHistoryForRequest]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);
    if (isLoading) {
        return <div className="text-center text-gray-400 py-12">Loading history...</div>;
    }
    return (
        <div className="space-y-4">
            {history.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User size={16} />
                    </div>
                    <div>
                        <p className="text-sm text-white">
                            <span className="font-bold">{item.userName}</span> {item.action}
                        </p>
                        <p className="text-xs text-gray-400">{item.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryTab;