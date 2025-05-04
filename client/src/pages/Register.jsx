import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', batch_year: '', branch: '', profile_picture: '', linkedin_url: '', current_position: '', location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form data
    if (!form.name || !form.email || !form.password || !form.batch_year || !form.branch) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Ensure batch_year is a number
    const formData = {
      ...form,
      batch_year: parseInt(form.batch_year, 10)
    };
    
    console.log('Submitting registration data:', formData);
    
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log('Registration response:', data);
      
      if (res.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
        <input name="name" type="text" placeholder="Name" className="w-full p-2 border rounded" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" value={form.password} onChange={handleChange} required />
        <select name="role" className="w-full p-2 border rounded" value={form.role} onChange={handleChange} required>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
        <input name="batch_year" type="number" placeholder="Batch Year" className="w-full p-2 border rounded" value={form.batch_year} onChange={handleChange} required />
        <input name="branch" type="text" placeholder="Branch" className="w-full p-2 border rounded" value={form.branch} onChange={handleChange} required />
        <input name="profile_picture" type="url" placeholder="Profile Picture URL (optional)" className="w-full p-2 border rounded" value={form.profile_picture} onChange={handleChange} />
        <input name="linkedin_url" type="url" placeholder="LinkedIn URL (optional)" className="w-full p-2 border rounded" value={form.linkedin_url} onChange={handleChange} />
        <input name="current_position" type="text" placeholder="Current Position (optional)" className="w-full p-2 border rounded" value={form.current_position} onChange={handleChange} />
        <input name="location" type="text" placeholder="Location (optional)" className="w-full p-2 border rounded" value={form.location} onChange={handleChange} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">Register</button>
      </form>
    </div>
  );
};

export default Register;
