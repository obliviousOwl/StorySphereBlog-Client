import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import AddPost from './pages/AddPost';
import Post from './pages/Post';
import PostView from './pages/PostsView';
import Error from './pages/Error';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    id: null,
    username: null,
    email: null,
    isAdmin: null
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      username: null,
      email: null,
      isAdmin: null
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.hasOwnProperty('user')) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
              email: data.user.email,
              username: data.user.username
            });
          } else {
            unsetUser();
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/posts" element={<Post />} />
            <Route path="/newPost" element={<AddPost />} />
            <Route path="/post/:postId" element={<PostView />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
