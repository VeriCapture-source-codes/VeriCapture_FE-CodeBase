import React, { useState, useEffect } from "react";
import GoLiveModal from './Components/GoLiveModal';
import { apiRequest } from './utils/api'; 

function ExplorePage() {
  const categories = ['Crime', 'Protest', 'Accident', 'Riot', 'Traffic', 'General'];
  
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [posts, setPosts] = useState([]);

  const openGoLiveModal = () => {
    setShowGoLiveModal(true);
  };

  const closeGoLiveModal = () => {
    setShowGoLiveModal(false);
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      const result = await apiRequest({
        method: 'GET',
        route: '/users/get-user-posts', // Adjust if needed
      });

      if (result.success) {
        setPosts(result.data.posts || []);
      } else {
        console.error('Failed to fetch posts:', result.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const getFileExtension = (url) => {
    return url.split('.').pop().toLowerCase().split('?')[0];
  };

  const renderMedia = (mediaUrl) => {
    const ext = getFileExtension(mediaUrl);
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) {
      return (
        <video
          src={mediaUrl}
          controls
          className="w-full mt-2 rounded-lg"
        />
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return (
        <img
          src={mediaUrl}
          alt="Post Media"
          className="w-full mt-2 rounded-lg"
        />
      );
    } else {
      return <p>Unsupported media type</p>;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-white p-5 border-r border-gray-200">
        <div className="mb-10 flex items-center gap-2">
          <img src="/Explore Vericapture img.png" alt="Logo" />
        </div>
        <nav className="flex flex-col gap-4">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 bg-gray-200">
            <img src="/House.png" alt="Home" className="w-5 h-5" />
            Home
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">
            <img src="/Explore.png" alt="Explore" className="w-5 h-5" />
            Explore
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">
            <img src="/notification.png" alt="Notification" className="w-5 h-5" />
            Notification
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">
            <img src="/user.png" alt="Profile" className="w-5 h-5" />
            Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex flex-col border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex gap-8 font-semibold text-gray-800">
              <a href="#" className="hover:text-green-500">Home</a>
              <a href="#" className="hover:text-green-500">RealTime Capture</a>
              <a href="#" className="hover:text-green-500">Map</a>
              <a href="#" className="hover:text-green-500">Trending</a>
            </div>
          </div>
          <div className="ml-auto flex gap-3 items-center px-6 pb-4">
            <button className="text-sm bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-semibold cursor-pointer">
              Post an Update
            </button>
            <button
              className="text-sm bg-red-500 text-white px-6 py-3 rounded-2xl font-semibold cursor-pointer"
              onClick={openGoLiveModal}
            >
              Go Live
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap gap-3 px-6 py-4 bg-gray-50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-100 cursor-pointer'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Feed Area */}
        <div className="flex-1 p-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
              <img src="/empty-state.png" alt="Empty Feed" className="w-40 h-40 mb-4" />
              <p className="text-lg">No posts yet! Start by uploading 🚀</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts
                .filter(post => post.category === selectedCategory || selectedCategory === 'General')
                .map((post) => (
                  <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold mb-2">{post.caption}</h4>
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Location:</strong> {post.location || 'Unknown'}
                    </p>
                    {renderMedia(post.media)}
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showGoLiveModal && (
        <GoLiveModal selectedCategory={selectedCategory} onClose={closeGoLiveModal} />
      )}
    </div>
  );
}

export default ExplorePage;
