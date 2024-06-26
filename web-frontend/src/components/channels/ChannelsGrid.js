import React, { useEffect, useState, useCallback } from 'react';
import Channel from './Channel';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const ChannelsGrid = ({ all = false }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  const fetchPopularChannel = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/popular/channels', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChannels(response.data.popularChannels);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChannels = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/channels?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChannels(response.data.channels);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (all) {
      fetchChannels(page);
    } else {
      fetchPopularChannel();
    }
  }, [all, page, fetchChannels, fetchPopularChannel]);

  const getRandomColorClass = () => {
    const colors = ['bg-blue-500', 'bg-orange-500', 'bg-pink-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const navigateToCreate = () => {
    navigate("/create-channel");
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            handlePress={() => setPage(i)}
            color={page === i ? 'bg-gray-700' : 'bg-sky-500'}
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(
        <Button
          key={1}
          handlePress={() => setPage(1)}
          color={page === 1 ? 'bg-gray-700' : 'bg-sky-500'}
        >
          1
        </Button>
      );

      if (page > 3) {
        pages.push(<span key="start-ellipsis" className="mx-2">...</span>);
      }

      if (page > 2 && page < totalPages - 1) {
        pages.push(
          <Button
            key={page}
            handlePress={() => setPage(page)}
            color='bg-gray-700'
          >
            {page}
          </Button>
        );
      }

      if (page < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="mx-2">...</span>);
      }

      pages.push(
        <Button
          key={totalPages}
          handlePress={() => setPage(totalPages)}
          color={page === totalPages ? 'bg-gray-700' : 'bg-sky-500'}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className='my-12 mx-4 md:mx-8 ml-0 md:ml-[19%]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-[#0F2239] text-2xl font-bold ml-4'>{all ? 'All Channels' : 'Most Popular Channels'}</h2>
        
        {localStorage.getItem('admin') === '1' && <Button handlePress={navigateToCreate} color="bg-sky-500 w-[25px] flex items-center justify-between h-[25px] p-0">
          <i className='fas fa-plus cursor-pointer'></i>
        </Button>}
      </div>
      {loading ? (
         <Loader />
      ) : (
        <>
          {channels.length !== 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 ml-4 mt-5'>
              {channels.map((channel) => (
                <Channel
                  key={channel.id}
                  id={channel.id}
                  title={channel.name}
                  color={getRandomColorClass()}
                  description={channel.description}
                  total_conversation={channel.discussions_count}
                />
              ))}
            </div>
          ) : (
            <p className='font-semibold text-xl text-[#0F2239] ml-4 mt-5'>
              There is No Channel Yet {localStorage.getItem("admin") === '1' && <Link className='text-blue-400' to="/create-channel">Create a Channel</Link>}
            </p>
          )}
        </>
      )}
      {totalPages > 1 && (
        <div className='flex justify-end mt-5 mr-4 items-end'>
          <Button handlePress={handlePrevPage} color="bg-sky-500">Previous</Button>
          {renderPagination()}
          <Button handlePress={handleNextPage} color="bg-sky-500 ml-5 mr-4">Next</Button>
        </div>
      )}
    </div>
  );
};

export default ChannelsGrid;