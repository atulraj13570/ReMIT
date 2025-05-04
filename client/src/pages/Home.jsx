import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Home = () => {
  const [data, setData] = useState([]);
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [batchOptions, setBatchOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllAlumni();
    fetchFilterOptions();
  }, []);

  // Removed automatic filtering on state change to give user more control

  const fetchAllAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'Alumni'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(data);
      if (data.length === 0) setError('No alumni data found in the database.');
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      setError('Failed to fetch alumni data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const alumniRef = collection(db, 'Alumni');
      const alumniSnapshot = await getDocs(alumniRef);
      
      // Extract unique batch years and branches
      const batches = new Set();
      const branches = new Set();
      
      alumniSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.batch) batches.add(data.batch);
        if (data.branch) branches.add(data.branch);
      });
      
      setBatchOptions(Array.from(batches).sort());
      setBranchOptions(Array.from(branches).sort());
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let q;
      
      if (batch && branch) {
        // Both filters applied
        q = query(
          collection(db, 'Alumni'),
          where('batch', '==', batch),
          where('branch', '==', branch)
        );
      } else if (batch) {
        // Only batch filter
        q = query(
          collection(db, 'Alumni'),
          where('batch', '==', batch)
        );
      } else if (branch) {
        // Only branch filter
        q = query(
          collection(db, 'Alumni'),
          where('branch', '==', branch)
        );
      } else {
        // No filters, fetch all
        q = query(collection(db, 'Alumni'));
      }
      
      const querySnapshot = await getDocs(q);
      const filteredData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData(filteredData);
      if (filteredData.length === 0) setError('No alumni found matching your criteria.');
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      setError('Failed to fetch filtered data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Alumni Directory</h2>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600">Batch Year</label>
          <select
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={batch}
            onChange={e => setBatch(e.target.value)}
          >
            <option value="">Select Batch Year</option>
            {batchOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600">Branch</label>
          <select
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branchOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center">
          <button 
            onClick={fetchData} 
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Filter Alumni
          </button>
          <button 
            onClick={() => {
              setBatch('');
              setBranch('');
              fetchAllAlumni();
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">Batch: {item.batch}</p>
                <p className="text-gray-600">Branch: {item.branch}</p>
                {item.designation && <p className="text-gray-600">Designation: {item.designation}</p>}
                {item.company && <p className="text-gray-600">Company: {item.company}</p>}
                {item.email && <p className="text-gray-600">Email: {item.email}</p>}
                {item.location && <p className="text-gray-600">Location: {item.location}</p>}
                {item.linkedin_url && (
                  <a 
                    href={item.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {item.current_position && (
                  <p className="text-gray-700">Current Position: {item.current_position}</p>
                )}
                {item.profile_picture && (
                  <div className="mt-4">
                    <img 
                      src={item.profile_picture} 
                      alt={item.name} 
                      className="w-32 h-32 rounded-full mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
