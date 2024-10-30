import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DogListHeader: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center bg-orange-500 text-white px-4 py-3">
      <button onClick={() => navigate(-1)} className="mr-3">
        <FaArrowLeft size={20} />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};

export default DogListHeader;
