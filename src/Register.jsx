import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from './utils/api';
import './Register.css';
import image6 from './assets/image6.png';
import bxHide from './assets/bx-hide.png';
import bxShow from './assets/bx-show.png';
import vericapture from './assets/vericapture.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    termsAccepted: false,
    country: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.termsAccepted) {
      setMessage('You must accept the terms and conditions.');
      return;
    }

    if (form.password.length < 4) {
      setMessage('Your password must be more than four characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        method: 'POST',
        route: '/users/create-form',
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          userName: form.userName,
          password: form.password,
        },
      });

      if (response.success) {
        setMessage(typeof response.data === 'string' ? response.data : 'Registration successful!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(typeof response.message === 'string' ? response.message : 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-image">
          <img src={image6} alt="Illustration" className="img-fluid" />
        </div>

        <div className="register-form">
          <img src={vericapture} alt="Vericapture Logo" className="vericapture-logo" />
          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
            <p className="already-account">
              Already have an account?{' '}
              <span className="login" onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>
                Login
              </span>
            </p>

            <div className="name-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={form.userName}
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

            <select
              name="country"
              className="country-select"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              {[
                'USA', 'Canada', 'UK', 'Australia', 'India', 'Germany', 'France', 'Japan', 'China', 'Brazil',
                'South Africa', 'Mexico', 'Italy', 'Spain', 'Netherlands', 'Russia', 'Nigeria',
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="terms-row">
              <label>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                />
                I accept the terms and conditions
              </label>

              <span className="forgot-password">
                Forgot password? <a href="./request-password-reset-otp">Change Password</a>
              </span>
            </div>

            {typeof message === 'string' && message.trim() !== '' && (
              <p className="form-message" style={{ color: 'crimson' }}>
                {message}
              </p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <div className="line-container">
              <div className="line2" />
              <div className="or-text">or sign up with</div>
            </div>

            <div className="social-login">
              <a href="#" className="google-btn">
                <i className="fab fa-google"></i> Sign up with Google
              </a>
              <div className="social-icons-row">
                <a className="media-button facebook-btn" href="#"><i className="fab fa-facebook"></i></a>
                <a className="media-button" href="#">
                  <svg className="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d="M 6.9 6 L 21.1 26.7 L 6.2 44 L 9.4 44 L 22.5 28.8 L 33 44 L 43 44 L 28.1 22.3 L 42.2 6 L 39 6 L 26.7 20.3 L 16.9 6 L 6.9 6 z" />
                  </svg>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
