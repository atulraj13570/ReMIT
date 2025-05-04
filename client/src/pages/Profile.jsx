import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
      <Link to="/login" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Login</Link>
    </div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={user.profile_picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} 
            alt={user.name}
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Role</span>
            <span className="font-medium">{user.role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Batch Year</span>
            <span className="font-medium">{user.batch_year}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Branch</span>
            <span className="font-medium">{user.branch}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Position</span>
            <span className="font-medium">{user.current_position || 'Not specified'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location</span>
            <span className="font-medium">{user.location || 'Not specified'}</span>
          </div>
          {user.linkedin_url && (
            <a 
              href={user.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              LinkedIn Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
