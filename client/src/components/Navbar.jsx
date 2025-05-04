import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
    
    // Call the logout function from AuthContext to clear user state
    logout();
    
    // Navigate to the login page
    navigate('/login');
    
    console.log('User logged out successfully');
  };

  return (
    <nav className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-xl">
        <Link to="/">ReMIT</Link>
      </div>
      <div className="space-x-4">
        <Link to="/feeds" className="hover:underline">Feeds</Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button 
              onClick={handleLogout} 
              className="hover:underline bg-transparent text-white cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
