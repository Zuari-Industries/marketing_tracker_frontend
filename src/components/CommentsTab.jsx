import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Send, Check, X, Clock, CornerDownRight } from 'lucide-react';

// Ismein koi change nahin
const ActionResponse = ({ status }) => {
    const statusMap = {
        Approved: { text: 'Approved', icon: Check, color: 'text-green-400' },
        Rejected: { text: 'Rejected', icon: X, color: 'text-red-400' },
        'For Review': { text: 'For Review', icon: Clock, color: 'text-yellow-400' },
    };
    const statusInfo = statusMap[status];
    if (!statusInfo) return null;
    const { text, icon: Icon, color } = statusInfo;
    return <div className={`flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-md bg-gray-900/50 ${color}`}><Icon size={14} />{text}</div>;
};

// Ismein koi change nahin
const UserResponseForm = ({ comment, onRespond }) => {
    const [responseText, setResponseText] = useState('');
    const [selectedResponse, setSelectedResponse] = useState('Approved');
    const quickResponses = ['Approved', 'Rejected'];
    const handleSubmit = () => {
        const fullComment = `${selectedResponse}: ${responseText || 'No comment added.'}`;
        onRespond(comment.id, selectedResponse, fullComment);
    };
    return (
        <div className="mt-3 pt-3 border-t border-gray-600 bg-gray-900/50 p-3 rounded-b-lg">
            <p className="text-sm font-semibold text-yellow-400 mb-2">Action Required: Please Respond</p>
            <div className="flex flex-wrap gap-2 mb-3">
                {quickResponses.map(res => (<button key={res} onClick={() => setSelectedResponse(res)} className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${selectedResponse === res ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{res}</button>))}
            </div>
            <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Add an optional comment..." rows="2" className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600" />
            <button onClick={handleSubmit} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"><Send size={16} /> Submit Response</button>
        </div>
    );
};

// Reply form component
const ReplyInputForm = ({ parentId, onSubmit, onCancel }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text, parentId);
        setText('');
    };
    return (
        <form onSubmit={handleSubmit} className="mt-2 ml-11">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply..." rows="2" className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
            <div className="flex items-center gap-2 mt-2">
                <button type="submit" className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"><Send size={14} /> Reply</button>
                <button type="button" onClick={onCancel} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-semibold hover:bg-gray-500 transition-colors">Cancel</button>
            </div>
        </form>
    );
};

// Recursive CommentItem component
const CommentItem = ({ comment, user, replyingTo, onReplyClick, onReplySubmit, onRespond }) => {
    const showResponseForm = user.role === 'User' && comment.type === 'ActionRequired' && comment.actionStatus === 'Pending';
    const isReplying = replyingTo === comment.id;
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 mt-1"></div>
            <div className="flex-1">
                <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-white">{comment.userName}</p>
                        {comment.isInternal && <span className="text-xs bg-yellow-500/50 text-yellow-300 px-1.5 py-0.5 rounded-full">Internal</span>}
                    </div>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{comment.text}</p>
                    {comment.type === 'ActionRequired' && (<div className="mt-3 pt-3 border-t border-gray-600">{showResponseForm ? <UserResponseForm comment={comment} onRespond={onRespond} /> : <ActionResponse status={comment.actionStatus} />}</div>)}
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                    <p className="text-xs opacity-60 text-gray-400">{comment.timestamp}</p>
                    <button onClick={() => onReplyClick(comment.id)} className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors"><CornerDownRight size={14} />Reply</button>
                </div>
                {isReplying && <ReplyInputForm parentId={comment.id} onSubmit={onReplySubmit} onCancel={() => onReplyClick(null)} />}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-gray-700 space-y-4">
                        {comment.replies.map(reply => (<CommentItem key={reply.id} comment={reply} user={user} replyingTo={replyingTo} onReplyClick={onReplyClick} onReplySubmit={onReplySubmit} onRespond={onRespond} />))}
                    </div>
                )}
            </div>
        </div>
    );
};

// CLEANUP: Unused ReplyComment component ko hata diya gaya hai.

const CommentsTab = ({ request }) => {
    const { getCommentsForRequest, addComment, updateCommentAction, user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [commentMode, setCommentMode] = useState('General');
    const [isInternal, setIsInternal] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    // LAYOUT CHANGE: Naya state form ko expand karne ke liye
    const [isNewCommentFocused, setIsNewCommentFocused] = useState(false);

    if (!user) return null;
    
    const canPostInternal = user.role === 'Admin' || user.role === 'SuperAdmin';
 
    const loadComments = useCallback(async () => {
        if (!request.id) return;
        setIsLoading(true);
        const fetchedComments = await getCommentsForRequest(request.id);
        setComments(fetchedComments);
        setIsLoading(false);
    }, [request.id, getCommentsForRequest]);

    useEffect(() => { loadComments(); }, [loadComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        await addComment(request.id, { text: newComment, type: commentMode, isInternal: canPostInternal && isInternal, });
        setNewComment('');
        setIsNewCommentFocused(false); // Form ko chota kar dein
        await loadComments();
    };

    const handleUserResponse = async (originalCommentId, actionStatus, responseText) => {
        await addComment(request.id, { text: responseText, type: 'General', parentId: originalCommentId });
        await updateCommentAction(originalCommentId, actionStatus);
        await loadComments();
    };

    const handleReplySubmit = async (text, parentId) => {
        await addComment(request.id, { text, type: 'General', parentId });
        setReplyingTo(null);
        await loadComments();
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo(current => (current === commentId ? null : commentId));
    };

    const visibleComments = canPostInternal ? comments : comments.filter(c => !c.isInternal);

    if (isLoading) {
        return <div className="text-center text-gray-400 py-12">Loading comments...</div>;
    }

    return (
        // LAYOUT CHANGE: Main container ab flex-grow use karega
        <div className="flex flex-col h-full">
            {/* Comment list ab bachi hui saari jagah le legi */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4">
                {visibleComments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} user={user} replyingTo={replyingTo} onReplyClick={handleReplyClick} onReplySubmit={handleReplySubmit} onRespond={handleUserResponse} />
                ))}
            </div>
            
            {/* LAYOUT CHANGE: Yeh naya, compact "Add Comment" form hai */}
            <div className="mt-auto pt-2 border-t border-gray-700">
                {/* Form expand hone par extra options dikhenge */}
                {isNewCommentFocused && (
                    <div className="px-1 pb-2">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <button onClick={() => setCommentMode('General')} className={`px-2 py-1 text-xs font-medium rounded-md ${commentMode === 'General' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>General</button>
                                {canPostInternal && (
                                    <button onClick={() => setCommentMode('ActionRequired')} className={`px-2 py-1 text-xs font-medium rounded-md ${commentMode === 'ActionRequired' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>Assign to User</button>
                                )}
                            </div>
                            {canPostInternal && (
                                <label className="flex items-center gap-2 text-xs text-gray-400">
                                    <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="form-checkbox bg-gray-600 border-gray-500 rounded text-blue-500 h-3.5 w-3.5"/>
                                    Internal
                                </label>
                            )}
                        </div>
                    </div>
                )}
                <div className="bg-gray-700 rounded-lg p-2 flex items-start gap-2">
                    <textarea 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        onFocus={() => setIsNewCommentFocused(true)}
                        placeholder="Write a comment..." 
                        rows={isNewCommentFocused ? 3 : 1} // Click karne par bada hoga
                        className="w-full bg-transparent text-white p-1 focus:outline-none resize-none transition-all duration-200"
                    />
                    <button 
                        onClick={handleAddComment} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-500"
                        disabled={!newComment.trim()}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsTab;