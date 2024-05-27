import React, { useState } from 'react';
import Input from './Input';
import Select from './Select';

const Filters = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      onSearch(searchTerm);
    };
  
    const handleFilterChange = (value) => {
      setFilter(value);
      onFilterChange(value);
    };
  
    const filterOptions = [
      { value: '', text: 'Select Filter' },
      { value: 'Latest', text: 'Latest' },
      { value: 'Solved', text: 'Solved' },
      { value: 'Unsolved', text: 'Unsolved' },
      { value: 'No Replies Yet', text: 'No Replies Yet' },
    ];
  
  return (
    <div className="flex justify-between items-start mt-5 mb-8">
      <div className="w-1/4">
        <h2 className="font-bold mb-4">Filter by</h2>
        <Select
          options={filterOptions}
          value={filter}
          onChange={handleFilterChange}
          label=""
          id="filter-select"
          Style=""
        />
      </div>
      <div className="w-1/4">
        <form onSubmit={handleSearchSubmit} className="relative">
            <Input handleChange={handleSearchChange} id='search-discussion' label={"Search"} placeholder='Search Discussions...' text={searchTerm}  />
          <button type="submit" className="absolute top-9 right-0 mt-3 mr-4">
            <i className="fa fa-search text-gray-500"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Filters;