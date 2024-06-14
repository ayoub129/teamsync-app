import React, { useEffect,  useState, useCallback } from 'react';
import Group from './Group';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const GroupsGrid = ({ all = false }) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    return `${process.env.REACT_APP_API_URL_STORAGE}/storage/${imagePath}`;
  };


  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const url = all ? '/groups' : '/user/groups';
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, [all]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const navigateToCreate = () => {
    navigate('/create-group');
  };


  return (
    <div className='my-12 mx-8 ml-0 md:ml-[19%]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-[#0F2239] text-2xl font-bold ml-4'>
          {all ? 'All Groups' : 'Your Groups'}
        </h2>
        <Button handlePress={navigateToCreate} color='bg-sky-500 flex items-center justify-center w-[25px] h-[25px] p-0'>
          <i className='fas fa-plus cursor-pointer'></i>
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {groups.length !== 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 ml-4 mt-5'>
              {groups.map((group) => {
                const imageUrl = getImageUrl(group.image);

                return (
                  <Group
                    key={group.id}
                    id={group.id}
                    title={group.name}
                    image={imageUrl}
                    description={group.description}
                    time={new Date(group.created_at).toLocaleDateString()}
                  />
                );
              })}
            </div>
          ) : (
            <p className='font-semibold text-xl text-[#0F2239] ml-4 mt-5'>
              You are Not a Part of any Group yet{' '}
              <Link className='text-blue-400' to='/create-group'>
                Create a Group
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default GroupsGrid;