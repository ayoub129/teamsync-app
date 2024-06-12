import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import AsyncSelect from 'react-select/async';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const VideoForm = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('/channels', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const options = response.data.channels.map(channel => ({
        value: channel.id,
        label: channel.name,
      }));
      setChannels(options);
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChannel) {
      setError('Please select a channel.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/video-chat', {
        channel_id: selectedChannel.value,
        channel_name: selectedChannel.label
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Room created successfully');
      setSelectedChannel(null);
      navigate(`/video-chat/${response.data.room}`)
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='md:ml-[19%] mx-8 p-8'>
      <h2 className='text-3xl text-center mb-4'>Create a Video Chat Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Channel</label>
          <AsyncSelect
            cacheOptions
            defaultOptions={channels}
            loadOptions={(inputValue, callback) => callback(channels)}
            onChange={setSelectedChannel}
            className="mt-2"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <Button handlePress={handleSubmit} color="bg-sky-500 mt-6">
          {loading ? 'Creating ...' : 'Create'}
        </Button>
      </form>
    </div>
  );
};

export default VideoForm;
