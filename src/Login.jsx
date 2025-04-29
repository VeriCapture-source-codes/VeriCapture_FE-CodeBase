import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate
import { apiRequest } from './utils/api'; // your fetch based apiRequest
import image6 from './assets/image6.png'; // Import image
import bxHide from './assets/bx-hide.png'; // Import image
import bxShow from './assets/bx-show.png'; // Import image
import './Login.css'; // Import CSS file for styling
import vericapture from './assets/vericapture.png'; // Import image


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
 };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.emailOrUsername || !form.password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/sign-in-user', // <-- your login endpoint
        body: {
          email: form.emailOrUsername,
          password: form.password,
        },
      });

      console.log('Login Response:', data);

      if (data.success && data.data?._id) {
        localStorage.setItem('authToken', data.data._id); // store token
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/explore');
        }, 1000);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);

      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
    <div className="login-container">
      <div className="login-form">
         <img
            src={vericapture}
            alt="vericapture logo"
            className="vericapture-logo2"
            style={{
            maxWidth: '58rem',
            height: 'auto',
            border: 'none',
            borderRadius: '8px',
            margin: '-175px 20px 0px 50px', // setting top margin negative
            }}
          />
        <a className='register' href="./register">Create an accout</a>
        <h2 style={{ fontSize: '1.9rem', fontWeight: '700', marginLeft: '15rem'}}>Login</h2>
        <form onSubmit={handleSubmit} className="form-group2">
          <p style={{ fontSize: '2rem', fontWeight: '800', marginLeft: '9.5rem'}}>Welcome Back</p>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', marginLeft: '9.5rem', width: '40rem'}}>
            Welcome Back, Please enter your detail
          </span>
        
         <div className="social-login2">
           <a href="#" className="google-btn2">
             <i className="fab fa-google"style={{ backgroundColor: 'blue' }} ></i> Sign up with Google
           </a>

            <div className="social-icons-row2">
             <a className="media-button2 facebook-btn" href="#">
               <  i className="fab fa-facebook"></i>
             </a>
              <a className='media-button2' href="#">
                <svg
                  className="x-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50" 
                 >
                 <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
               </svg>
             </a>
           </div>
          </div>
          <div className="line-container2">
            <div className="line2"></div>
            <div className="or-text">OR</div>
          </div>

          {/* Email,Text, Password stacked */}
          <div>
            <input type="email" name="email" placeholder="Email or Username" value={form.email} onChange={handleChange} required />
          </div>
          <div className="password-wrapper">
            <input
             type={showPassword ? "text" : "password"} // we'll add this logic next
             name="password"
             placeholder="Password"
             value={form.password}
             onChange={handleChange}
             required
            />
            <img
             src={showPassword ? bxShow : bxHide}
             alt="Toggle Visibility"
             onClick={togglePasswordVisibility}
             className="password-toggle-icon"
            />
         </div>
 {/* Checkbox */}
 <div style={{ fontSize: '0.6rem', marginLeft: '3rem' }} className='check-to2'>
            <label>
              <input
               type="checkbox"
               name="termsAccepted"
               checked={form.termsAccepted}
               onChange={handleChange}
              />{' '}
             <span>Keep me signed in</span>
           </label>
          </div>

          {/* Password link */}
          <div style={{ fontSize: '0.8rem', marginLeft: '21.3rem' }} className='forgot'>
            <a href="./request-password-reset-otp">Forgot password</a>
          </div>

         <div style={{ marginTop: '1rem' }}>
           <button type="submit" disabled={isSubmitting}>
             {isSubmitting ? 'Logging in...' : 'Login'}
           </button>
          </div>
  
          {message && <p style={{ marginTop: '1rem', color: 'crimson' }}>{message}</p>}
       </form>
      </div>
      <div className="login-image">
        <img
          src={image6}
          alt="Login Illustration"
          className="img-fluid"
          style={{
            maxWidth: '36rem',
            height: '80rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginLeft: '14.2rem',
          }}
        />
      </div>
    </div>
  </div>
  );
}

export default Login;
