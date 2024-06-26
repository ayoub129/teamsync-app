import React, { useState } from 'react';
import axios from '../../axios';

const UpdatePass = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); 

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false); 
            return;
        }

        try {
            const response = await axios.post('/reset-password', {
                password: password,
                password_confirmation: confirmPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess(response.data.message);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className='md:ml-[19%] mx-4 md:mx-8'>
            <div className='ml-4 md:p-8 bg-white rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold mb-4'>Update Password</h2>
                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>New Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Confirm Password</label>
                        <input
                            type='password'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className='w-full p-2 border border-gray-300 rounded mt-1'
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className={`px-4 py-2 rounded transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePass;
