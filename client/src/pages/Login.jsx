import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('alumni');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', { email, password, role });
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log('Login response:', data);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        login(data.user);
        // Redirect to home page after login
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex flex-col space-y-2">
          <button 
            type="button" 
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            onClick={() => {
              setRole('alumni');
              setTimeout(() => handleSubmit(new Event('submit')), 100);
            }}
          >
            Login as Alumni
          </button>
          <button 
            type="button" 
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            onClick={() => {
              setRole('student');
              setTimeout(() => handleSubmit(new Event('submit')), 100);
            }}
          >
            Login as Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
