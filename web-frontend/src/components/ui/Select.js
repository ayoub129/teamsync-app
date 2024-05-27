import React from 'react';

const Select = ({ options, value, onChange , label , id , Style }) => {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div className={`block ${Style}`}>
          <label className={`block font-semibold `} htmlFor={id}>{label}</label>
          <select className='outline-0 focus:border-[#2684ff] focus:border-2 mt-3 cursor-pointer w-full border border-[#b3b3b3] rounded p-2' id={id} value={value} onChange={handleChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.text}
                    </option>
                ))}
           </select>
        </div>
    );
};

export default Select;
