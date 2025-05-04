import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // Get user data from localStorage if it exists
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            console.log('User restored from localStorage');
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
          }
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  const login = (userData) => {
    // Set user in state
    setUser(userData);
    
    // Save user data to localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('User logged in and saved to localStorage');
  };

  const logout = () => {
    // Clear user from state
    setUser(null);
    
    // Remove user data and token from localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    console.log('User logged out and removed from localStorage');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
