import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import ChannelsGrid from '../components/channels/ChannelsGrid';
import GroupsGrid from '../components/groups/GroupsGrid';

const Home = () => {

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
      <SideBar active="dashboard" isSidebarOpen={isSidebarOpen} />
      <ChannelsGrid />
      <GroupsGrid />
    </div>
  )
}

export default Home
