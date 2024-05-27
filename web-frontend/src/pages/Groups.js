import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import GroupsGrid from '../components/groups/GroupsGrid';

const Groups = () => {

  const navigate = useNavigate()
  const admin = localStorage.getItem('admin');

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
      <GroupsGrid all={admin === 1 && true} />
    </div>
  )
}

export default Groups
