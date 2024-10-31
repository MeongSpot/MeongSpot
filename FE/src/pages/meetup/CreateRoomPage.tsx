import RoomCreatForm from '@/components/meetUp/RoomCreatForm';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CreateMeetupForm = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto p-4 bg-white rounded-lg ">
      <div className="flex items-center mb-4">
        <button className="mr-3 text-gray-600" onClick={() => navigate(-1)}>
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold">산책 모임 생성하기</h1>
      </div>
      <hr className="my-4 -mx-4 w-screen" />
      <RoomCreatForm />
    </div>
  );
};

export default CreateMeetupForm;
