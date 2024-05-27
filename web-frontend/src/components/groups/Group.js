import React from 'react'
import { Link } from 'react-router-dom'

const Group = ({id , title , image , description , time}) => {
  return (
    <Link to={`/groups/${id}`} className='bg-gray-200 rounded'>
        <div className='flex p-5 items-center justify-between mb-[1.5rem]'>
            <div className='block'>
                <h2 className='text-xl font-bold text-[#0F2239]'>{title}</h2>
                <h3 className='text-base font-semibold text-[#0F2239]'>{time}</h3>
            </div>
        </div>
        <img src={image} alt={title} />
        <p className='text-gray-600 p-5 font-semibold'>{description}</p>
    </Link>
  )
}

export default Group
