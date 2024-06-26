import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import Loader from '../ui/Loader';
import { Link } from 'react-router-dom';

const User = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data.user);


                const imageResponse = await axios.get(`/users/${userId}/image`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfilePicture(imageResponse.data.image);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleNotificationChange = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div className="md:ml-[19%] mx-4 md:mx-8">
            <div className="ml-4 md:p-8 bg-white rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <img
                        src={profilePicture || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="rounded-full w-[60px] h-[60px]"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                <p className="mt-4 text-gray-700">{user.bio || 'Bio not available'}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-100 rounded-lg text-center">
                        <h4 className="text-lg font-semibold">Channels</h4>
                        <p className="text-2xl font-bold">{user.channels_count}</p>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg text-center">
                        <h4 className="text-lg font-semibold">Groups</h4>
                        <p className="text-2xl font-bold">{user.groups_count}</p>
                    </div>
                    <div className="p-4 bg-yellow-100 rounded-lg text-center">
                        <h4 className="text-lg font-semibold">Friends</h4>
                        <p className="text-2xl font-bold">{user.friends_count}</p>
                    </div>
                    <div className="p-4 bg-red-100 rounded-lg text-center">
                        <h4 className="text-lg font-semibold">Discussions</h4>
                        <p className="text-2xl font-bold">{user.discussions_count}</p>
                    </div>
                </div>

                <div className="mt-6 block md:flex space-x-4">
                    <Link
                        to="/update-profile"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Update Profile
                    </Link>
                    <Link
                        to={`/update-pass/${userId}`}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Update Password
                    </Link>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Settings</h3>
                    <div className="mt-4">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={notificationsEnabled}
                                onChange={handleNotificationChange}
                            />
                            <span className="text-gray-700">Enable Notifications</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;