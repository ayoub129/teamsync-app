import React, { useState } from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import DiscussionModal from '../discussion/DiscussionModal'; 

const SideBar = ({ active, isSidebarOpen , toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const admin = localStorage.getItem('admin');

  const handlePress = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const userId = localStorage.getItem('user_id');

  return (
    <div className={`w-[60%] md:w-[16.66%] px-6 min-h-screen border-r fixed top-0 left-0 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 md:translate-x-0 bg-white`}>
      <div className='mt-7'></div>
      <div className='flex items-center justify-between'>
        <Link to="/" className='text-[#0F2239] text-xl md:text-2xl font-bold'>NANA CHAT</Link>
        <i onClick={toggleSidebar} className='fas fa-times block md:hidden pointer'></i>
      </div>
      <Button handlePress={handlePress} color='bg-sky-500' container='mr-8 mt-[4rem]'>New Discussion</Button>
      <div className='mt-[4rem]'></div>
      <MenuItem link={"/"} title={"Dashboard"} active={active === "dashboard"} />
      <MenuItem link={"/channels"} title={"Channels"} active={active === "channels"} />
      <MenuItem link={"/groups"} title={"Groups"} active={active === "groups"} />
      <MenuItem link={"/chat"} title={"Chats"} active={active === "chats"} />
      <MenuItem link={`/profile/${userId}`} title={"Profile"} active={active === "profile"} />
      {admin === '1' && <MenuItem link={"/video-chat"} title={"start a video chat"} active={active === "video"} />}
      <DiscussionModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
};

export default SideBar;