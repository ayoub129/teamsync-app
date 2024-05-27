import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from './Search';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState('https://via.placeholder.com/40');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserImage = async () => {
      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('user_id');
      if (user_id) {
        try {
          const response = await axios.get(`http://localhost:8000/api/users/${user_id}/image`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserImage(response.data.image);
        } catch (error) {
          console.error('Error fetching user image', error);
        }
      }
    };
    fetchUserImage();
  }, []);

  const handleProfileClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNotifClick = () => {
    navigate('/notification');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  const handleSettings = () => {
    navigate(`/profile/${localStorage.getItem('user_id')}`);
  };

  return (
    <header className='flex items-center justify-between my-5 mx-8 ml-[19%]'>
      <h1 className='w-full flex'>
        <Search />
      </h1>
      <div className='flex items-center'>
        <div className="mr-4 relative">
          <i onClick={handleNotifClick} className="fas fa-bell text-xl text-gray-600 cursor-pointer"></i>
        </div>
        <div className='relative'>
          <button onClick={handleProfileClick} className='rounded-full w-[40px] h-[40px] focus:outline-none'>
            <img src={userImage} className='rounded-full w-[40px] h-[40px]' alt="profile" />
          </button>
          {menuOpen && (
            <div className="absolute z-10 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md">
              <button onClick={handleUpdateProfile} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Update Profile</button>
              <button onClick={handleSettings} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Settings</button>
              <button onClick={handleLogout} className="block text-red-500 px-4 py-2 hover:bg-gray-200 w-full text-left">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
