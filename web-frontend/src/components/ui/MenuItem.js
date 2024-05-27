import React from 'react'
import { Link } from 'react-router-dom'

const MenuItem = ({link , title , active}) => {
  return (
    <Link to={link} className={`flex items-center ${active && 'bg-gray-100'} menuitem hover:bg-gray-100 mb-[1rem] py-2 rounded-full mr-8`}>
      <div className={`py-4 rounded px-1 ml-[1.5rem]  bg-gray-400  w-[10px] ${active && 'bg-sky-400'} `}></div>
      <p className={`text-[#0F2239] font-semibold  ${active && 'text-sky-400'} ml-[.75rem]`}>{title}</p>
    </Link>
  )
}

export default MenuItem
