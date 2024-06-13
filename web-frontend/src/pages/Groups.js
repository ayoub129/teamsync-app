import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import GroupsGrid from '../components/groups/GroupsGrid';

const Groups = () => {

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

  const admin = localStorage.getItem('admin');

  return (
    <div className='min-h-screen'>
      <Header toggleSidebar={toggleSidebar} />
      <SideBar active="groups" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <GroupsGrid all={admin === 1 && true} />
    </div>
  )
}

export default Groups
