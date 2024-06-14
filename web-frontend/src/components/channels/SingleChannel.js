import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios'; 
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import Filters from '../ui/Filters';
import parse from 'html-react-parser';
import ChannelMembers from './ChannelMembers';
import Loader from '../ui/Loader';
import ConfirmationModal from '../ui/ConfirmationModal';
import Toast, { useCustomToast } from '../ui/CustomToast';

const SingleChannel = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const userId = localStorage.getItem('user_id');
  const { toasts, showToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/channels/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setChannel(response.data.channel);
      } catch (error) {
        console.error('Error fetching channel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`/channels/${id}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const fetchDiscussions = useCallback(async (filter = null, search = null) => {
    setLoading(true);
    try {
      const response = await axios.get(`/channels/${id}/discussions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          page,
          filter,
          search
        }
      });
      setDiscussions(response.data.discussions.data);
      setTotalPages(response.data.discussions.last_page);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

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

  const handleSearch = (searchTerm) => {
    setPage(1); // Reset to the first page
    fetchDiscussions(null, searchTerm);
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

  const getExcerpt = (content) => {
    const parsedContent = parse(content);
    let paragraphs = [];
    React.Children.forEach(parsedContent, child => {
      if (child.type === 'p') {
        paragraphs.push(child);
      }
    });

    return paragraphs.slice(0, 2);
  };

  const join = async () => {
    setJoining(true);
    try {
      await axios.post(`/channels/${id}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchMembers();
      showToast('Successfully joined the channel', 'success');
    } catch (error) {
      console.error('Error joining channel:', error);
      showToast('Error joining the channel', 'error');
    } finally {
      setJoining(false);
    }
  };

  const leave = async () => {
    setLeaving(true);
    try {
      await axios.post(`/channels/${id}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchMembers();
      showToast('Successfully left the channel', 'success');
    } catch (error) {
      console.error('Error leaving channel:', error);
      showToast('Error leaving the channel', 'error');
    } finally {
      setLeaving(false);
    }
  };

  const deleteChannel = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/channels/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting channel:', error.response ? error.response.data : error.message);
      showToast('Error deleting channel', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setShowModal(false);
    deleteChannel();
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const edit = () => {
    navigate(`/edit-channel/${id}`);
  };

  const [isUserMember, setIsUserMember] = useState(false);

  useEffect(() => {
    setIsUserMember(members.some(member => member.id === parseInt(userId, 10)));
  }, [members]);

  return (
    <div className="relative my-12 mx-4 md:mx-8 md:ml-[19%]">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Filters onSearch={handleSearch}  />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className="col-span-2">
              {channel && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className='flex items-center justify-between'>
                    <h1 className="text-3xl font-bold text-gray-800">{channel.name}</h1>
                    <div className='flex items-center'>
                      {localStorage.getItem('admin') !== '1' ? !isUserMember ? (
                        <Button color="bg-green-500 p-[5px] w-[70px]" handlePress={join}>
                          {joining ? 'Joining...' : 'Join'}
                        </Button>
                      ) : (
                        <Button color="bg-red-500 p-[5px] mx-[8px] w-[70px]" handlePress={leave}>
                          {leaving ? 'Leaving...' : 'Leave'}
                        </Button>
                      ) : null}
                      {localStorage.getItem('admin') === '1' && (
                        <>
                          <Button handlePress={edit}>
                            <i className='fas fa-pen text-yellow-500'></i>
                          </Button>
                          <Button handlePress={handleDeleteClick}>
                            <i className='fas fa-trash-can text-red-500'></i>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{channel.description}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Status: {channel.status}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Created at: {new Date(channel.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-8">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="mb-4 p-4 border rounded bg-white shadow">
                    <h2 className="text-xl font-semibold">{discussion.title}</h2>
                    <div className='my-5'>{getExcerpt(discussion.content)} <Link className='text-red-500' to={`/discussion/${discussion.id}`}>Read More ...</Link></div>
                    <p className="text-sm text-gray-500">{new Date(discussion.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className='flex justify-end mt-5 mr-4 items-end'>
                  <Button handlePress={handlePrevPage} color="bg-sky-500">Previous</Button>
                  {renderPagination()}
                  <Button handlePress={handleNextPage} color="bg-sky-500 ml-5 mr-4">Next</Button>
                </div>
              )}
            </div>
            <div className="col-span-1">
              <ChannelMembers members={members} setMembers={setMembers} />
            </div>
          </div>
        </>
      )}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this channel?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {deleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white p-8 rounded shadow-lg z-10">
            <p>Deleting channel...</p>
          </div>
        </div>
      )}
      <Toast toasts={toasts} />
    </div>
  );
};

export default SingleChannel;
