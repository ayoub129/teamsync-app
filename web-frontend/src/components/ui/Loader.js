import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse mt-5">
      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
    </div>
  );
};

export default Loader;
