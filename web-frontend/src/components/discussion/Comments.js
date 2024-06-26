import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { useParams } from 'react-router-dom';
import Loader from '../ui/Loader';
import Toast, { useCustomToast } from '../ui/CustomToast';
import ConfirmationModal from '../ui/ConfirmationModal';

const Comments = () => {
    const { id } = useParams(); // Assuming the discussion ID is passed as a route parameter
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [replying, setReplying] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newFile, setNewFile] = useState(null); // New state for the file
    const [replyContent, setReplyContent] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const { toasts, showToast } = useCustomToast();
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/discussions/${id}/comments`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const commentsWithImages = await Promise.all(response.data.comments.map(async (comment) => {
                    const userResponse = await axios.get(`/users/${comment.user_id}/image`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    return { ...comment, userImage: userResponse.data.image };
                }));

                setComments(commentsWithImages);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); // Set submitting state to true
        const formData = new FormData();
        formData.append('content', newComment);
        if (newFile) {
            formData.append('file', newFile);
        }

        try {
            const response = await axios.post(`/discussions/${id}/comments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const userResponse = await axios.get(`/users/${userId}/image`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setNewComment('');
            setNewFile(null);
            setComments((prevComments) => [...prevComments, { ...response.data.comment, userImage: userResponse.data.image }]);
            showToast('Your answer has been submitted', 'success'); // Show success toast
        } catch (error) {
            console.error('Error submitting comment:', error);
            showToast('Error submitting comment', 'error'); // Show error toast
        } finally {
            setSubmitting(false); // Set submitting state to false
        }
    };

    const handleFileChange = (e) => {
        setNewFile(e.target.files[0]);
    };

    const handleReply = async (commentId) => {
        try {
            setReplying(true);
            const response = await axios.post(`/comments/${commentId}/reply`, {
                content: replyContent,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const userResponse = await axios.get(`/users/${userId}/image`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setReplyContent('');
            setReplyTo(null);
            setReplying(false);
            setComments((prevComments) => [...prevComments, { ...response.data.reply, userImage: userResponse.data.image }]);
            showToast('Your reply has been submitted', 'success'); // Show success toast
        } catch (error) {
            console.error('Error replying to comment:', error);
            showToast('Error replying to comment', 'error'); // Show error toast
        }
    };

    const url = process.env.URL

    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setShowModal(true); // Show the modal when delete button is clicked
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/comments/${commentToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setComments((prevComments) => prevComments.filter(comment => comment.id !== commentToDelete));
            showToast('Comment deleted successfully', 'success'); // Show success toast
        } catch (error) {
            console.error('Error deleting comment:', error);
            showToast('Error deleting comment', 'error'); // Show error toast
        } finally {
            setShowModal(false); // Hide the modal
            setCommentToDelete(null); // Reset the comment to delete
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false); // Hide the modal
        setCommentToDelete(null); // Reset the comment to delete
    };

    const renderComments = (comments, parentId = null) => {
        return comments
            .filter(comment => comment.parent_id === parentId)
            .map(comment => (
                <div key={comment.id} className={`mb-4 md:p-8 bg-white shadow rounded-lg ${parentId ? 'ml-4 md:ml-8 mt-4' : ''}`}>
                    <div className="flex items-center">
                        <img src={comment.userImage} alt={comment.user?.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleString()}
                            </p>
                            {comment.files && comment.files.length > 0 && (
                                <a href={`${url}/storage/${comment.files[0].path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    View Attachment
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        <button
                            className="text-blue-500 text-sm mr-2"
                            onClick={() => setReplyTo(comment.id)}
                        >
                            Reply
                        </button>
                        {parseInt(userId) === comment.user_id && (
                            <button
                                className="text-red-500 text-sm"
                                onClick={() => handleDeleteClick(comment.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    {replyTo === comment.id && (
                        <div className="mt-2">
                            <textarea
                                className="w-full p-2 border rounded"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Type your reply..."
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                                onClick={() => handleReply(comment.id)}
                            >
                                {replying ? "Replying..." : "Submit Reply"}
                            </button>
                        </div>
                    )}
                    {renderComments(comments, comment.id)}
                </div>
            ));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='mx-8 ml-[19%] p-8'>
            {comments.length > 0 ? (
                renderComments(comments)
            ) : (
                <div>No Answer found</div>
            )}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your Answer..."
                />
                <input
                    type="file"
                    className="w-full p-2 border rounded mb-2"
                    onChange={handleFileChange}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
            </form>
            <Toast toasts={toasts} />
            {showModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this comment?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default Comments;
