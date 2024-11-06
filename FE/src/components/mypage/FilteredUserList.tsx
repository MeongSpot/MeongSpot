import React from 'react';
import { UserInfo } from '@/types/user';

interface FilteredUserListProps {
  data: UserInfo[];
}

const FilteredUserList = ({ data }: FilteredUserListProps) => {
  // Filter the users based on the filter value

  return (
    <div>
      {data.map((user, index) => (
        <div key={index}>
          <div className="py-4 flex items-center justify-between space-x-2 border-b">
            <div className="flex space-x-3">
              <div className="w-14 h-14 border rounded-full">
                <img src={user.profile_image} alt="profile" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold">{user.name}</p>
                <div className="flex space-x-1">
                  <p className="text-sm text-deep-coral font-medium">
                    {user.dogs[0]}
                    {user.dogs.length > 1 && ` 외 ${user.dogs.length - 1}마리`}
                  </p>
                  <p className="text-sm text-zinc-600">견주</p>
                </div>
              </div>
            </div>
            <div>
              <button className="bg-deep-coral text-white px-3 py-1 rounded-2xl">친구 추가</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilteredUserList;
