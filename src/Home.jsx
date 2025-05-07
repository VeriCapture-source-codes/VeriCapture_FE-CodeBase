import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarMenu from './Components/SideMenu';
import FeedCard from './Components/FeedCard';
import Loader from './Components/Loader';
import { apiRequest } from './utils/api';

const categories = ['crime', 'fight', 'politics', 'trending'];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryModal(false);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    fetchPosts();
  };

  const getFileExtension = (url) => {
    return url.split('.').pop().toLowerCase().split('?')[0];
  };

  const renderMedia = (mediaUrl) => {
    const ext = getFileExtension(mediaUrl);
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) {
      return <video src={mediaUrl} controls style={{ width: '80%', marginTop: '0.5rem', borderRadius: '8px' }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img src={mediaUrl} alt="Post Media" style={{ width: '100%', marginTop: '0.5rem', borderRadius: '8px' }} />;
    } else {
      return <p>Unsupported media type</p>;
    }
  };

  const fetchPosts = async () => {
    try {
      const result = await apiRequest({
        method: 'GET',
        route: '/users/get-user-posts',
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

  const fetchUserData = async () => {
    const userId = localStorage.getItem('authToken');
    if (!userId) {
      console.error('No authToken found in localStorage');
      return;
    }

    try {
      const result = await apiRequest({
        method: 'GET',
        route: `/users/get-user-by-id/${userId}`,
      });

      if (result.success) {
        setUser(result.data);
        localStorage.setItem('userInfo', JSON.stringify(result.data));
      } else {
        console.error('Failed to fetch user:', result.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await fetchPosts();
      setLoading(false); // stop loading after both APIs resolve
    };
    init();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Header user={user} />

      <Container fluid className="mt-3">
        <Row>
          <Col md={2} className="d-none d-md-block">
            <SidebarMenu />
          </Col>

          <Col md={7} className="py-3">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <FeedCard
                  key={index}
                  user={{ name: user?.name || 'Anonymous', avatar: user?.avatar || '/avatar.jpg' }}
                  time="2m ago"
                  location={post.location || 'Unknown'}
                  text={post.text}
                  image={post.mediaUrl}
                  tag={post.tag}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                />
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </Col>

          <Col md={3} className="py-3 d-none d-md-block">
            {/* Optional Right Sidebar */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
