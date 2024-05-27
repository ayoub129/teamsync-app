import React from 'react';
import PropTypes from 'prop-types';

const Input = ({Style, label, id, handleChange, order , text = '', placeholder = '', type = 'text', bigInput = false }) => {
  return (
    <div className={`block ${Style}`}>
      <label className={`block font-semibold text-[#0F2239] ${order}`} htmlFor={id}>{label}</label>
      {bigInput ? (
        <textarea rows={6} className='block w-full outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded mt-4' id={id} placeholder={placeholder} onChange={handleChange} value={text} />
      ) : (
        <input className={`block ${type === "checkbox" ? "" : "w-full mt-4"} outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded `} type={type} id={id} placeholder={placeholder} value={text} onChange={handleChange} />
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  bigInput: PropTypes.bool,
  order: PropTypes.string,
  style: PropTypes.string,
};

export default Input;