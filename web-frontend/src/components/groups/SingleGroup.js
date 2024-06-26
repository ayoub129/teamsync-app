import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import Filters from '../ui/Filters'; 
import parse from 'html-react-parser';
import GroupMembers from './GroupMembers';
import Loader from '../ui/Loader';
import ConfirmationModal from '../ui/ConfirmationModal'; 
import Toast, { useCustomToast } from '../ui/CustomToast';

// Custom hook to detect screen size
const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isSmallScreen;
};

const SingleGroup = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(false); 
  const [discussionToDelete, setDiscussionToDelete] = useState(null); 
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false); // State for group delete confirmation
  const [showModal, setShowModal] = useState(false); // State for group delete confirmation
  const userId = localStorage.getItem('user_id'); 
  const { toasts, showToast } = useCustomToast();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setGroup(response.data.group);
      } catch (error) {
        console.error('Error fetching group:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const fetchDiscussions = async (filter = null, search = null) => {
    setLoading(true);
    try {
      const response = await axios.get(`/groups/${id}/discussions`, {
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
  };

  useEffect(() => {
    fetchDiscussions();
  }, [id, page]);

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

  const deleteGroup = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast('Group deleted successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting group:', error.response ? error.response.data : error.message);
      showToast('Error deleting group', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const deleteDiscussion = async (discussionId) => {
    setDeleting(true);
    try {
      await axios.delete(`/discussions/${discussionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast('Discussion deleted successfully!', 'success');
      // Refresh the discussions list
      fetchDiscussions();
    } catch (error) {
      console.error('Error deleting discussion:', error.response ? error.response.data : error.message);
      showToast('Error deleting discussion', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteDiscussionClick = (discussionId) => {
    setDiscussionToDelete(discussionId);
    setShowModal(true); // Show the modal when delete button is clicked
  };

  const handleConfirmDeleteDiscussion = () => {
    setShowModal(false);
    deleteDiscussion(discussionToDelete);
  };

  const handleCancelDeleteDiscussion = () => {
    setShowModal(false);
    setDiscussionToDelete(null);
  };

  const handleDeleteGroupClick = () => {
    setShowDeleteGroupModal(true); // Show the modal when delete group button is clicked
  };

  const handleConfirmDeleteGroup = () => {
    setShowDeleteGroupModal(false);
    deleteGroup();
  };

  const handleCancelDeleteGroup = () => {
    setShowDeleteGroupModal(false);
  };

  const edit = () => {
    navigate(`/edit-group/${id}`);
  };

  return (
    <div className="relative mx-4 md:mx-8 md:ml-[19%] ">
      <Filters onSearch={handleSearch}  />
      {loading ? (
        <Loader />
      ) : (
        <div className='md:grid md:grid-cols-3 gap-4'>
          <div className="w-full md:col-span-2">
            {group && (
              <div className="bg-white shadow rounded-lg p-6 ">
                <div className='flex items-center justify-between'>
                  <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
                  {parseInt(userId) === group.user_id && (
                    <div className='flex items-center'>
                      <Button handlePress={edit}>
                        <i className='fas fa-pen text-yellow-500'></i>
                      </Button>
                      <Button handlePress={handleDeleteGroupClick}>
                        <i className='fas fa-trash-can text-red-500'></i>
                      </Button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{group.description}</p>
                <div className="mt-4">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Created at: {new Date(group.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
         {showModal && (
            <ConfirmationModal 
              message="Are you sure you want to delete this discussion?" 
              onConfirm={handleConfirmDeleteDiscussion} 
              onCancel={handleCancelDeleteDiscussion} 
           />
          )}
            <div className="mt-8">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="mb-4 p-4 border rounded bg-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <div className='w-full'>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{discussion.title}</h2>
                        {parseInt(userId) === discussion.user_id && (
                          <Button handlePress={() => handleDeleteDiscussionClick(discussion.id)} >
                             <i className='fas fa-trash-can text-red-500'></i>
                          </Button>
                        )}
                      </div>
                      <div className='my-5'>{getExcerpt(discussion.content)} <Link className='text-red-500' to={`/discussion/${discussion.id}`}>Read More ...</Link></div>
                      <p className="text-sm text-gray-500">{new Date(discussion.created_at).toLocaleString()}</p>
                    </div>
                  </div>
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
          <div className="w-full md:col-span-1">
           <GroupMembers groupId={id} />
          </div>
        </div>
      )}
      {showDeleteGroupModal && (
        <ConfirmationModal 
          message="Are you sure you want to delete this group?" 
          onConfirm={handleConfirmDeleteGroup} 
          onCancel={handleCancelDeleteGroup} 
        />
      )}
      {deleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white p-8 rounded shadow-lg z-10">
            <p>Deleting...</p>
          </div>
        </div>
      )}
      <Toast toasts={toasts} />
    </div>
  );
};

export default SingleGroup;
