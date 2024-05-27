import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, container = '', color , handlePress }) => {
  return (
    <div className={container}>
      <button
        className={`w-full p-[10px] font-bold rounded text-white ${color} `}
        onClick={handlePress}
      >
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  container: PropTypes.string,
  color: PropTypes.string,
  handlePress: PropTypes.func.isRequired,
};

export default Button;
