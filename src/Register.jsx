import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import { apiRequest } from './utils/api';
import './Register.css'; // Import CSS file for styling
import image6 from './assets/image6.png'; // Import image
import bxHide from './assets/bx-hide.png'; // Import image
import bxShow from './assets/bx-show.png'; // Import image
import vericapture from './assets/vericapture.png';
import '@fortawesome/fontawesome-free/css/all.min.css';


function Register() {
  const navigate = useNavigate(); // initialize navigate
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    termsAccepted: false,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

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
      const data = await apiRequest({
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

      console.log('Registration Response:', data);

      if (data.success) {
        setMessage(data.data || 'Registration successful!');
        setTimeout(() => {
          navigate('/login'); // redirect after successful registration
        }, 5500); // short delay so user can see success message
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div style={{ padding: '2rem' }}>
  <div className="register-container">
   <div className="register-image">
      <img
        src={image6}
        alt="Login Illustration"
        className="img-fluid"
        style={{
          maxWidth: '37rem',
          height: '92.2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginRight: '6rem',
        }}
      />
    </div>
    <div className="register-form">
      <img
        src={vericapture}
        alt="vericapture logo"
        className="vericapture-logo"
        style={{
        maxWidth: '58rem',
        height: 'auto',
        border: 'none',
        borderRadius: '8px',
        margin: '-175px 300px 0px 0px', // setting top margin negative
        }}
      />
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <span style={{ fontSize: '1.2rem', marginLeft: '3rem', marginRight: '6rem' }}>
          Already have an account? <a className='login' href="./login">Login</a>
        </span>
        {/* First + Last name side by side */}
        <div className="name-row">
          <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
       </div>

       {/* Email, Username, Password stacked */}
       <div>
         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
       </div>
       <div>
         <input type="text" name="userName" placeholder="Username" value={form.userName} onChange={handleChange} required />
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

       <div>
          <select name="country" className='country-select' value={form.country} onChange={handleChange} required>
            <option value="">Select your country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="Brazil">Brazil</option>
            <option value="South Africa">South Africa</option>
            <option value="Mexico">Mexico</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Russia">Russia</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',  // Stacks children vertically
          marginLeft: '1rem',    // Maintains your indentation
          marginTop: '0rem',
          gap: '0.5rem'            // Adds consistent spacing between items
          }}>
          {/* Checkbox */}
          <div style={{ fontSize: '0.2rem', marginLeft: '0rem' }} className='check-to'>
            <label>
              <input
               type="checkbox"
               name="termsAccepted"
               checked={form.termsAccepted}
               onChange={handleChange}
              />{' '}
            <span>I accept the terms and conditions</span>
           </label>
          </div>

          {/* Password link */}
          <div style={{ fontSize: '0.6rem', marginRight: '0rem', marginLeft: '2.5rem' }} className='forgot-password'>
            <span>Forgot password? </span>
            <a href="./request-password-reset-otp">Change Password</a>
          </div>

         {/* Message */}
         {message && (
           <p style={{ 
            color: 'crimson',
            margin: 0            
           }}>
            {message}
         </p>
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
        <div className="line-container">
          <div className="line2"></div>
          <div className="or-text">or sign up with</div>
        </div>


        <div className="social-login">
          <a href="#" className="google-btn">
            <i className="fab fa-google"style={{ backgroundColor: 'blue' }} ></i> Sign up with Google
          </a>


          <div className="social-icons-row">
            <a className="media-button facebook-btn" href="#">
            <i className="fab fa-facebook"></i>
            </a>

           <a className='media-button' href="#">
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
     </form>
   </div>
 </div>
</div>
 );
}

export default Register;
