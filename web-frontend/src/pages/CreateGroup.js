import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import GroupForm from '../components/groups/GroupForm';

const CreateGroup = () => {

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
      <SideBar active="groups" />
      <GroupForm />
    </div>
  )
}

export default CreateGroup
