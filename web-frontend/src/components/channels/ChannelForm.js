import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Select from '../ui/Select';
import AsyncSelect from 'react-select/async';
import Button from '../ui/Button';
import axios from 'axios';
import Toast, { useCustomToast } from '../ui/CustomToast';
import Loader from '../ui/Loader';

const ChannelForm = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState({
        channelName: '',
        channelDescription: '',
        channelStatus: 'public',
        channelGroups: []
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { toasts, showToast } = useCustomToast();
    const navigate = useNavigate();

    useEffect(() => {        
        fetchGroupOptions();
        if (id) {
            fetchChannelData(id);
        }
    }, [id]);

    const fetchChannelData = async (channelId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/channels/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const channelData = response.data.channel;
            setChannel({
                channelName: channelData.name,
                channelDescription: channelData.description,
                channelStatus: channelData.status,
            });
        } catch (error) {
            console.error('Error fetching channel data:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupOptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/groups', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const groupOptions = response.data.groups.map(group => ({
                value: group.id,
                label: group.name
            }));
            setGroups(groupOptions);
        } catch (error) {
            console.error('Error fetching groups:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadGroupOptions = async (inputValue, callback) => {
        callback(groups);
    };

    const handleChange = (field, e) => {
        setChannel({ ...channel, [field]: e.target.value });
        setErrors({ ...errors, [field]: '' });
    };

    const handleSelectChange = (value) => {
        setChannel({ ...channel, channelStatus: value });
        setErrors({ ...errors, channelStatus: '' });
    };

    const handleGroupChange = (selectedOptions) => {
        setChannel({ ...channel, channelGroups: selectedOptions });
        setErrors({ ...errors, channelGroups: '' });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const data = {
            name: channel.channelName,
            description: channel.channelDescription,
            status: channel.channelStatus,
            groups: (channel.channelGroups || []).map(group => group.value)
        };

        try {
            let response;
            if (id) {
                response = await axios.post(`http://localhost:8000/api/channels/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                showToast('Channel updated successfully!', 'success');
            } else {
                response = await axios.post('http://localhost:8000/api/channels', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                showToast('Channel created successfully!', 'success');
            }
            console.log('Channel operation successful:', response.data);
            navigate("/channels");
        } catch (error) {
            console.error('Error in channel operation:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                showToast('Error in channel operation', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader /> 
            ) : (
                <div className='my-12 mx-8 ml-[19%] w-[70%]'>
                    <div className="ml-4">
                        <div className='flex items-center justify-between'>
                            <Input
                                label="Channel Name"
                                id='channelName'
                                handleChange={(e) => handleChange('channelName', e)}
                                text={channel.channelName}
                                placeholder='Channel Name'
                                type='text'
                                Style="w-[48%] mt-[2rem]"
                                error={errors.channelName}
                            />
                            <Select
                                label="Channel Status"
                                id="channelStatus"
                                onChange={handleSelectChange}
                                options={[
                                    { value: 'public', text: 'Public' },
                                    { value: 'private', text: 'Private' }
                                ]}
                                value={channel.channelStatus}
                                Style="w-[48%] mt-[2rem]"
                                error={errors.channelStatus}
                            />
                        </div>
                        {channel.channelStatus === 'private' && (
                            <div className="mt-[2rem] w-full">
                                <label htmlFor="channelGroup" className="block font-semibold mb-4">Channel Group</label>
                                <AsyncSelect
                                    id="channelGroup"
                                    cacheOptions
                                    loadOptions={loadGroupOptions}
                                    onChange={handleGroupChange}
                                    value={channel.channelGroups}
                                    placeholder="Select a group"
                                    isMulti
                                    defaultOptions={groups}
                                    error={errors.channelGroups}
                                />
                            </div>
                        )}
                        <Input
                            bigInput
                            label="Channel Description"
                            id='channelDescription'
                            handleChange={(e) => handleChange('channelDescription', e)}
                            text={channel.channelDescription}
                            placeholder='Channel Description'
                            type='text'
                            Style="w-full mt-[2rem]"
                            error={errors.channelDescription}
                        />
                        <Button handlePress={handleSubmit} color="bg-blue-500 mt-8">
                            {submitting ? 'Submitting...' : id ? 'Update Channel' : 'Create Channel'}
                        </Button>
                    </div>
                    <Toast toasts={toasts} />
                </div>
            )}
        </>
    );
};

export default ChannelForm;
