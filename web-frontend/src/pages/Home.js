import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import ChannelsGrid from '../components/channels/ChannelsGrid';
import GroupsGrid from '../components/groups/GroupsGrid';

const Home = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className='min-h-screen'>
      <Header />
      <SideBar active="dashboard" />
      <ChannelsGrid />
      <GroupsGrid />
    </div>
  )
}

export default Home
