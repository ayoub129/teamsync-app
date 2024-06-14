import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import AsyncSelect from 'react-select/async';
import Button from '../ui/Button';
import axios from '../../axios';
import ImageInput from '../ui/ImageInput';
import Toast, { useCustomToast } from '../ui/CustomToast';
import Loader from '../ui/Loader';

const GroupForm = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({
        groupName: '',
        groupDescription: '',
        members: [],
        image: null,
    });
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { toasts, showToast } = useCustomToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFriendOptions();
        if (id) {
            fetchGroupData(id);
        }
    }, [id]);

    const handleChange = (field, e) => {
        setGroup({ ...group, [field]: e.target.value });
        setErrors({ ...errors, [field]: '' });
    };

    const handleFileChange = (e) => {
        setGroup({ ...group, image: e.target.files[0] });
        setErrors({ ...errors, image: '' });
    };

    const handleMemberChange = (selectedOptions) => {
        setGroup({ ...group, members: selectedOptions });
        setErrors({ ...errors, members: '' });
    };

    const fetchFriendOptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/friends', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const friendOptions = response.data.friends.map(user => ({
                value: user.id,
                label: user.name
            }));
            setFriends(friendOptions);
        } catch (error) {
            console.error('Error fetching friends:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupData = async (groupId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const groupData = response.data.group;
            setGroup({
                groupName: groupData.name,
                groupDescription: groupData.description,
                members: groupData.users.map(user => ({
                    value: user.id,
                    label: user.name
                })),
                image: groupData.image || null,
            });
        } catch (error) {
            console.error('Error fetching group data:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFriendOptions = async (inputValue, callback) => {
        callback(friends);
    };

    const handleGroupSubmission = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('name', group.groupName);
        formData.append('description', group.groupDescription);
        if (group.image instanceof File) {
            formData.append('image', group.image);
        }
        
        if (group.members.length > 0) {
            group.members.forEach(member => {
                formData.append('members[]', member.value);
            });
        } else {
            formData.append('members', '[]'); 
        }

        try {
            let response;
            if (id) {
                response = await axios.post(`/groups/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                showToast('Group updated successfully!', 'success');
            } else {
                response = await axios.post('/groups', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                showToast('Group created successfully!', 'success');
            }
            console.log('Group operation successful:', response.data);
            navigate("/groups");
        } catch (error) {
            console.error('Error in group operation:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                showToast('Error in group operation', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='my-12 md:my-6 mx-8 md:ml-[19%] md:w-[70%]'>
            {loading ? (
                <Loader />
            ) : (
                <div className="ml-4">
                    <form onSubmit={handleGroupSubmission}>
                        <div className='md:flex items-center justify-between'>
                            <Input
                                label="Group Name"
                                id='groupName'
                                handleChange={(e) => handleChange('groupName', e)}
                                text={group.groupName}
                                placeholder='Group Name'
                                type='text'
                                Style="md:w-[48%] mt-[1rem] md:mt-[2rem]"
                                error={errors.name}
                            />
                            <div className="mt-[1rem] md:mt-[2rem] md:w-[48%]">
                                <label htmlFor="groupMembers" className="block font-semibold mb-4">Group Members</label>
                                <AsyncSelect
                                    id="groupMembers"
                                    cacheOptions
                                    loadOptions={loadFriendOptions}
                                    onChange={handleMemberChange}
                                    value={group.members}
                                    placeholder="Select Members"
                                    isMulti
                                    defaultOptions={friends}
                                    error={errors.members}
                                />
                            </div>
                        </div>
                        <Input
                            bigInput
                            label="Group Description"
                            id='groupDescription'
                            handleChange={(e) => handleChange('groupDescription', e)}
                            text={group.groupDescription}
                            placeholder='Group Description'
                            type='text'
                            Style="w-full mt-[1rem] md:mt-[2rem]"
                            error={errors.description}
                        />
                        <ImageInput
                            label="Group Image"
                            handleFileChange={handleFileChange}
                            support="PNG , JPEG , JPG"
                            supported="image/png, image/jpeg, image/jpg"
                            error={errors.image}
                        />
                        <Button handlePress={handleGroupSubmission} type="submit" color="bg-blue-500 mt-5 md:mt-8">
                            {submitting ? 'Submitting...' : id ? 'Update Group' : 'Create Group'}
                        </Button>
                    </form>
                </div>
            )}
            <Toast toasts={toasts} />
        </div>
    );
};

export default GroupForm;