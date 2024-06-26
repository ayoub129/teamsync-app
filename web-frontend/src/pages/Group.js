import React, { useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import SingleGroup from '../components/groups/SingleGroup';

const Group = () => {
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
      <SideBar setIsSidebarOpen={setIsSidebarOpen} active="groups" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <SingleGroup />
    </div>
  );
};

export default Group;
