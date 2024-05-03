import React, { useState } from 'react';
import { registerfunction } from '../services/Apis';
import { useNavigate } from 'react-router-dom';
import '../styles/mix.css';

const Register = () => {
  const [inputdata, setInputdata] = useState({
    fname: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, email, password } = inputdata;

    if (fname === '') {
      alert('Enter Your Name');
    } else if (email === '') {
      alert('Enter Your Email');
    } else if (!email.includes('@')) {
      alert('Enter Valid Email');
    } else if (password === '') {
      alert('Enter Your Password');
    } else if (password.length < 6 || password.length > 12) {
      alert('Password must be between 6 and 12 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}/.test(password)) {
      alert('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    } else {
      try {
        const response = await registerfunction(inputdata);

        if (response.status === 200) {
          setInputdata({ fname: '', email: '', password: '' });
          alert('User registered successfully!');
          navigate('/');
        } else {
          const errorResponse = response?.response?.data?.error || 'Unknown error occurred';
          alert(errorResponse);
        }
      } catch (error) {
        console.error('Error occurred during registration:', error);
        alert('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
              </h6>
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              name="fname"
                              className="form-style"
                              placeholder="Your Full Name"
                              autoComplete="off"
                              value={inputdata.fname}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              autoComplete="off"
                              value={inputdata.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              autoComplete="off"
                              value={inputdata.password}
                              onChange={handleChange}
                            />
                          </div>
                          <button type="submit" className="btn mt-4">Submit</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
