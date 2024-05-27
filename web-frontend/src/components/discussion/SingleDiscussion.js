import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import Loader from '../ui/Loader';

const SingleDiscussion = () => {
    const { id } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        const fetchDiscussion = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/discussions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const fetchedDiscussion = response.data.discussion;
                setDiscussion(fetchedDiscussion);

                if (fetchedDiscussion.user_id) {
                    const userResponse = await axios.get(`http://localhost:8000/api/users/${fetchedDiscussion.user_id}/image`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setUserImage(userResponse.data.image);
                }
            } catch (error) {
                console.error('Error fetching discussion:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussion();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!discussion) {
        return <div className='text-center'>No discussion found</div>;
    }

    return (
        <div className="mx-8 ml-[19%] p-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                        {userImage && <img src={userImage} alt={discussion.user?.name} className="w-10 h-10 rounded-full mr-3" />}
                        <h1 className="text-3xl font-bold text-gray-800">{discussion.title}</h1>
                    </div>
                </div>
                <p className="mt-2 text-gray-600">{parse(discussion.content)}</p>
                <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Created at: {new Date(discussion.created_at).toLocaleString()}
                    </span>
                </div>
                {discussion.files && discussion.files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Attachments:</h3>
                        <ul>
                            {discussion.files.map(file => (
                                <li key={file.id} className="mb-2">
                                    <a href={`http://localhost:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        {file.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleDiscussion;