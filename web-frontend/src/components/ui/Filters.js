import React, { useState } from 'react';
import Input from './Input';
import Select from './Select';

const Filters = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };


  const filterOptions = [
    { value: '', text: 'Select Filter' },
    { value: 'Latest', text: 'Latest' },
    { value: 'Solved', text: 'Solved' },
    { value: 'Unsolved', text: 'Unsolved' },
    { value: 'No Replies Yet', text: 'No Replies Yet' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mt-5 mb-8 space-y-4 md:space-y-0 md:space-x-4">
      <div className="w-full md:w-1/4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            handleChange={handleSearchChange}
            id='search-discussion'
            label={"Search"}
            placeholder='Search Discussions...'
            text={searchTerm}
          />
          <button type="submit" className="absolute top-9 right-0 mt-3 mr-4">
            <i className="fa fa-search text-gray-500"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Filters;