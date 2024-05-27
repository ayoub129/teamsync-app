import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { AppContext } from '../../context/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const DiscussionModal = ({ isOpen, onRequestClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      fetchChannels();
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/groups', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const options = response.data.groups.map(group => ({
        value: group.id,
        label: group.name,
      }));
      setGroups(options);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/channels', {
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup && !selectedChannel) {
      alert('Please select at least one group or channel.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (selectedGroup) {
      formData.append('group_id', selectedGroup.value);
    }
    if (selectedChannel) {
      formData.append('channel_id', selectedChannel.value);
    }
    if (file) {
      formData.append('file', file);
    }

    let url = 'http://localhost:8000/api/discussions';

    try {
      setLoading(true);
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: 'ADD_DISCUSSION', payload: response.data.discussion });
      setLoading(false);
      onRequestClose();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Create Discussion"
      className="discussion-modal"
      overlayClassName="discussion-modal-overlay"
    >
      <div className="discussion-modal-header">
        <h2 className="discussion-modal-title text-[#0F2239]">Create New Discussion</h2>
        <button className="discussion-modal-close" onClick={onRequestClose}>
          <i className='fas fa-close'></i>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="discussion-modal-form">
        <Input
          label="Title"
          id="title"
          handleChange={(e) => setTitle(e.target.value)}
          text={title}
          placeholder="Enter the title"
          type="text"
          Style="mt-4"
        />
        <div className="mt-4 ">
          <label htmlFor="content" className="block font-semibold">Content</label>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => setContent(editor.getData())}
            className="mt-4"
          />
        </div>
        <Input
          label="File"
          id="file"
          handleChange={handleFileChange}
          type="file"
          Style="mt-4"
          text=''
        />
        <div className="mt-4">
          <label htmlFor="group" className="block font-semibold">Select Group</label>
          <AsyncSelect
            cacheOptions
            defaultOptions={groups}
            loadOptions={(inputValue, callback) => callback(groups)}
            onChange={setSelectedGroup}
            className="mt-2"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="channel" className="block font-semibold">Select Channel</label>
          <AsyncSelect
            cacheOptions
            defaultOptions={channels}
            loadOptions={(inputValue, callback) => callback(channels)}
            onChange={setSelectedChannel}
            className="mt-2"
          />
        </div>
        <Button handlePress={handleSubmit} color="bg-sky-500 mt-6">
          {loading ? 'Creating ...' : 'Create'}
        </Button>
      </form>
    </Modal>
  );
};

export default DiscussionModal;
