import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import VideoForm from '../components/chat/VideoForm';

const CreateVideo = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    if (!token) {
      navigate("/login");
    }

    if(admin == "0") { 
      navigate("/");
    }

  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='min-h-screen'>
      <Header toggleSidebar={toggleSidebar} />
      <SideBar active="video" isSidebarOpen={isSidebarOpen} />
      <VideoForm />
    </div>
  )
}

export default CreateVideo
