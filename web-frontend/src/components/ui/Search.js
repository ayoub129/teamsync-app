import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Search = () => {
  const { cat, search } = useParams();
  const [searchTerm, setSearchTerm] = useState(search ? search : "");
  const [searchCategory, setSearchCategory] = useState(cat ? cat : 'discussion');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchCategory}/${searchTerm}`);
    }
  };

  return (
    <div className="flex items-center w-full">
      <form onSubmit={handleSearch} className="flex w-full relative">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 px-12 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
          <button type='submit'>
            <i className="fas fa-search absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-600 cursor-pointer"></i>
          </button>
        </div>
        <div className="absolute right-0 md:right-[-2rem] ml-2">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          >
            <option value="discussion">Discussions</option>
            <option value="groups">Groups</option>
            <option value="channels">Channels</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default Search;