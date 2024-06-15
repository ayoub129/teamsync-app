import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import ChannelsGrid from '../components/channels/ChannelsGrid';

const Channels = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='min-h-screen'>
      <Header toggleSidebar={toggleSidebar} />
      <SideBar toggleSidebar={toggleSidebar} active="channels" isSidebarOpen={isSidebarOpen} />
      <ChannelsGrid all={true} />
    </div>
  )
}

export default Channels