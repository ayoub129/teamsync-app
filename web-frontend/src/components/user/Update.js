import React, { useState } from 'react';
import axios from 'axios';
import Input from '../ui/Input';
import ImageInput from '../ui/ImageInput';
import Button from '../ui/Button';
import Toast, { useCustomToast } from '../ui/CustomToast';

const Update = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    file: null,
  });
  const { toasts, showToast } = useCustomToast();
  const [loading, setLoading] = useState(false);

  const handleChange = (field, e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (formData.file) {
      data.append('file', formData.file);
    }

    console.log(`http://localhost:8000/api/users/${user_id}` , token , data)
    try {
      setLoading(true);
      await axios.post(`http://localhost:8000/api/users/${user_id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Profile Updated successfully!', 'success');
    } catch (error) {
      showToast('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ml-[19%] mx-8 p-8'>
      <h3 className='text-center font-bold text-[#0F2239] text-[1.5rem]'>Update Profile</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Username'
          id='name'
          handleChange={(e) => handleChange('name', e)}
          text={formData.name}
          placeholder='Enter your Username'
        />
        <Input
          label='Email'
          id='email'
          type='email'
          handleChange={(e) => handleChange('email', e)}
          text={formData.email}
          placeholder='Enter your email'
        />
        <ImageInput
          label='Profile Picture'
          handleFileChange={handleFileChange}
          supported='image/jpeg,image/png,image/jpg'
          support='JPEG, PNG, JPG'
        />
        <Button color='bg-sky-500' handlePress={handleSubmit}>
          {loading ? 'Updating ...' : 'Update Profile'}
        </Button>
      </form>
      <Toast toasts={toasts} />
    </div>
  );
};

export default Update;
