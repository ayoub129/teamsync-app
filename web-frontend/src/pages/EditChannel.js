import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import ChannelForm from '../components/channels/ChannelForm';

const CreateChannel = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    if (!token) {
      navigate("/login");
    }

    if(!admin) { 
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className='min-h-screen'>
      <Header />
      <SideBar active="channels" />
      <ChannelForm />
    </div>
  )
}

export default CreateChannel
