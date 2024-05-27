import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import SingleDiscussion from '../components/discussion/SingleDiscussion';
import Comments from '../components/discussion/Comments';

const Discussion = () => {

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
      <SideBar active="" />
      <SingleDiscussion />
      <Comments />
    </div>
  )
}

export default Discussion
