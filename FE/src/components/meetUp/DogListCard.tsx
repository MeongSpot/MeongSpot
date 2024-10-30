import React, { useState } from 'react';
import { FaDog } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

interface Dog {
  id: number;
  name: string;
  breed: string;
  birthdate: string;
  age: number;
  personalityTags: string[];
}

const DogCard: React.FC<{ dog: Dog }> = ({ dog }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
    setShowDetails((prev) => !prev);
    };

    return (
    <div 
        className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-300 cursor-pointer" 
        onClick={toggleDetails} 
    >
        <div className="flex items-center mb-2">
        <FaDog className="text-gray-400 mr-2" size={24} />
        <div className="flex-1">
            <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{dog.name}</h3>
            <p className="text-gray-500">{dog.breed}</p>
            </div>
        </div>
        <div className="text-gray-500 ml-2">
            {showDetails ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        </div>

        <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            {showDetails && (
            <>
                <div className="text-sm text-gray-500 mt-2">
                <span role="img" aria-label="cake">🎂</span> {dog.birthdate} / {dog.age}살
                </div>
                <div className="flex flex-wrap mt-2">
                {dog.personalityTags.map((tag, index) => (
                    <span key={index} className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                    {tag}
                    </span>
                ))}
                </div>
            </>
            )}
        </div>
    </div>
    );
};

export default DogCard;
