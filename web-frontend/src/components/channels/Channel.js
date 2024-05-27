import React from 'react'
import { Link } from 'react-router-dom'

const Channel = ({id , title , total_conversation , description , color}) => {
  return (
    <Link to={`/channels/${id}`} className='bg-gray-200 rounded p-5 '>
        <div className='flex items-center justify-between mb-[1.5rem]'>
            <div className='flex items-center'>
                <div className={`py-4 rounded px-1 mr-1 ${color} w-[7px]`}></div>
                <h2 className='text-xl font-bold text-[#0F2239]'>{title}</h2>
            </div>
            <p className='text-gray-600 font-semibold'>{total_conversation} Conversations</p>
        </div>
        <p className='text-gray-600 font-semibold'>{description}</p>
    </Link>
  )
}

export default Channel
