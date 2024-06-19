import React from 'react';

const FriendsList = ({ friends, groups, onSelectFriendOrGroup }) => {
  return (
    <div className="w-1/3 p-4 bg-white shadow-lg h-[80%] overflow-y-scroll">
      <h2 className='text-xl font-semibold mb-4'>Friends</h2>
      {friends && friends.map(friend => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow cursor-pointer"
          onClick={() => onSelectFriendOrGroup(friend)}
        >
          <div className="flex items-center">
            <img src={friend.image} alt={friend.name} className="w-10 h-10 rounded-full mr-3" />
            <span>{friend.name}</span>
          </div>
        </div>
      ))}
      {/* <h2 className='text-xl font-semibold mb-4'>Groups</h2>
      {groups && groups.map(group => (
        <div
          key={group.id}
          className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow cursor-pointer"
          onClick={() => onSelectFriendOrGroup(group)}
        >
          <div className="flex items-center">
            <span>{group.name}</span>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default FriendsList;