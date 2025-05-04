import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, createPost, likePost, unlikePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Log user information for debugging
  useEffect(() => {
    console.log('Current user in Feed component:', user);
  }, [user]);

  // Sample posts data for display
  const samplePosts = [
    {
      id: '1',
      authorId: '101',
      authorName: 'Suresh Prasad',
      authorRole: 'alumni',
      authorBatch: '1980.0',
      authorBranch: 'CMI',
      authorProfilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: "Excited to share that I've just been promoted to Senior Engineering Manager at Govt of Jharkhand! Looking forward to mentoring more students from our college. If anyone is interested in government sector opportunities, feel free to reach out.",
      createdAt: new Date('2025-04-01T10:30:00'),
      likes: [{user: '102'}, {user: '103'}],
      comments: [
        {
          id: 'c1',
          user: '102',
          name: 'Priya Singh',
          text: 'Congratulations sir! Would love to learn more about opportunities in the government sector.',
          date: new Date('2025-04-01T11:45:00')
        }
      ]
    },
    {
      id: '2',
      authorId: '102',
      authorName: 'Ananya Sharma',
      authorRole: 'alumni',
      authorBatch: '2010',
      authorBranch: 'Computer Science',
      authorProfilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Just wrapped up a successful tech conference in Bangalore! Our team at Microsoft is hiring software engineers with experience in cloud technologies. If any recent graduates are interested, please DM me for referrals.',
      createdAt: new Date('2025-04-02T15:20:00'),
      likes: [{user: '101'}, {user: '103'}, {user: '104'}],
      comments: []
    },
    {
      id: '3',
      authorId: '103',
      authorName: 'Rajiv Mehta',
      authorRole: 'alumni',
      authorBatch: '2005',
      authorBranch: 'Electronics',
      authorProfilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
      content: "Hosting a virtual workshop on 'Transitioning from Academia to Industry' next Friday at 6 PM. Will cover resume building, interview preparation, and industry expectations. Perfect for final year students! Registration link in comments.",
      createdAt: new Date('2025-04-03T09:15:00'),
      likes: [{user: '102'}],
      comments: [
        {
          id: 'c2',
          user: '103',
          name: 'Rajiv Mehta',
          text: 'Registration link: https://workshop.example.com/register',
          date: new Date('2025-04-03T09:20:00')
        },
        {
          id: 'c3',
          user: '104',
          name: 'Amit Kumar',
          text: 'Looking forward to this! Will certificates be provided?',
          date: new Date('2025-04-03T10:05:00')
        }
      ]
    }
  ];

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch posts from backend
      const postsData = await getAllPosts();
      if (postsData && postsData.length > 0) {
        setPosts(postsData);
      } else {
        // If no posts from API, use sample posts
        setPosts(samplePosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use sample posts if API fails
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Only allow alumni to create posts
    if (user.role !== 'alumni') {
      setError('Only alumni can create posts.');
      return;
    }

    if (!newPost.trim()) {
      setError('Post content cannot be empty.');
      return;
    }
    
    try {
      // Create post
      const newPostData = await createPost(newPost);
      setNewPost('');
      
      // Add the new post to the beginning of the posts array
      setPosts([newPostData, ...posts]);
      
      // Also fetch from backend to ensure consistency
      await fetchPosts();
    } catch (error) {
      setError('Failed to create post. Please try again.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Alumni Feed</h1>
      
      {!user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
          <p>Sign in to interact with posts and see personalized content.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Post creation form - only visible to alumni */}
      {user && user.role === 'alumni' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Share something with students</h2>
          <form onSubmit={handlePostSubmit}>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Share your experience, advice, or opportunities..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No posts yet.</p>
          {user && user.role === 'alumni' && (
            <p className="text-gray-500 mt-2">Be the first to share something!</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                {post.authorProfilePic ? (
                  <img 
                    src={post.authorProfilePic} 
                    alt={post.authorName} 
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {post.authorName?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{post.authorName}</h3>
                      <div className="text-gray-600 text-sm">
                        {post.authorBatch && post.authorBranch && (
                          <span>{post.authorBatch} • {post.authorBranch}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="mt-4 text-gray-800 whitespace-pre-line">{post.content}</div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-4">
                    <button 
                      onClick={async () => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        try {
                          // First try to like the post
                          const updatedLikes = await likePost(post.id);
                          // Then update UI with the actual likes from server
                          setPosts(posts => posts.map(p =>
                            p.id === post.id
                              ? { ...p, likes: updatedLikes }
                              : p
                          ));
                        } catch (err) {
                          console.error('Error liking post:', err);
                          setError('Failed to like post. Please try again.');
                        }
                      }}
                      className="text-gray-500 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{post.likes?.length || 0} Like{post.likes?.length !== 1 ? 's' : ''}</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;