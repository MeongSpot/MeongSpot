import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

const DogListHeader: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center bg-deep-coral text-white p-4">
      <button onClick={() => navigate(-1)} className="mr-3">
        <IoChevronBack size={24} />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};

export default DogListHeader;
