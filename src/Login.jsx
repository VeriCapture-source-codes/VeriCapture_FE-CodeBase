import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from './utils/api';
import './Login.css';
import image6 from './assets/image6.png';
import bxHide from './assets/bx-hide.png';
import bxShow from './assets/bx-show.png';
import vericapture from './assets/vericapture.png';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { emailOrUsername, password } = form;

    if (!emailOrUsername || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        method: 'POST',
        route: '/users/sign-in-user',
        body: {
          email: emailOrUsername,
          password,
        },
      });

      console.log("Login Response:", response);

      if (response.success) {
        const token = response.data?._id || response.data?.token || 'session';
        localStorage.setItem('authToken', token);
        setMessage('Login successful! Redirecting...');
        setShouldRedirect(true);
      } else {
        setMessage(typeof response.message === 'string' ? response.message : 'Login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        console.log("Redirecting to /explore...");
        navigate('/explore');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-form">
          <img src={vericapture} alt="Vericapture Logo" className="vericapture-logo2" />

          <p className="register">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              Create one
            </span>
          </p>

          <h2 className="login-title">Login</h2>

          <form onSubmit={handleSubmit} className="form-group2">
            <p className="welcome-text">Welcome Back</p>
            <span className="welcome-subtext">
              Welcome Back, Please enter your detail
            </span>

            <div className="social-login2">
              <a href="#" className="google-btn2">
                <i className="fab fa-google"></i> Sign up with Google
              </a>

              <div className="social-icons-row2">
                <a className="media-button2 facebook-btn" href="#"><i className="fab fa-facebook"></i></a>
                <a className="media-button2" href="#">
                  <svg className="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d="M 6.9 6 L 21.1 26.7 L 6.2 44 L 9.4 44 L 22.5 28.8 L 33 44 L 43 44 L 28.1 22.3 L 42.2 6 L 39 6 L 26.7 20.3 L 16.9 6 L 6.9 6 z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="line-container2">
              <div className="line2" />
              <div className="or-text">OR</div>
            </div>

            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              value={form.emailOrUsername}
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <img
                src={showPassword ? bxShow : bxHide}
                alt="Toggle Password"
                onClick={togglePasswordVisibility}
                className="password-toggle-icon"
              />
            </div>

            <div className="form-options">
              <label className="stay-signed-in">
                <input type="checkbox" name="staySignedIn" />
                Keep me signed in
              </label>

              <span className="forgot">
                <a href="./request-password-reset-otp">Forgot password</a>
              </span>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {typeof message === 'string' && message.trim() !== '' && (
              <p className="form-message" style={{ color: 'crimson' }}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="login-image">
          <img src={image6} alt="Login Illustration" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default Login;
