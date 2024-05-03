import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sentOtpFunction } from '../services/Apis';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/mix.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (email === '') {
      toast.error('Enter Your Email!');
    } else if (!email.includes('@')) {
      toast.error('Enter Valid Email!');
    } else {
      setSpinner(true);
      const data = {
        email: email,
      };

      const response = await sentOtpFunction(data);

      if (response.status === 200) {
        setSpinner(false);
        navigate('/user/otp', { state: email });
      } else {
        toast.error(response.response.data.error);
      }
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span>Log In </span>
                <span>About Us</span>
              </h6>
              <input 
                className="checkbox" 
                type="checkbox" 
                id="reg-log" 
                name="reg-log" 
                checked={isChecked} 
                onChange={handleCheckboxChange} 
              />
              <label htmlFor="reg-log"></label>
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="form-group">
                          <input
                            type="email"
                            name="logemail"
                            className="form-style"
                            placeholder="Your Email"
                            id="logemail"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <button className="btn mt-4" onClick={sendOtp}>
                          {spinner ? (
                            <Spinner animation="border" variant="light" size="sm" />
                          ) : (
                            'Submit'
                          )}
                        </button>
                        <p className="mt-2">Don't have an account? <a href="/register">SignUp Now</a>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h5 className="mb-3"><strong>ABOUT US</strong></h5>
                        <p>Welcome to <strong>VeriFactual - Verify if ACTUAL!</strong> 

<br></br>VeriFactual is your reliable ally in the battle against fake news. With implementing AIML and other technologies, we look forward to empower users to discern fact from fiction in today's information landscape.

Our mission is simple yet vital: to verify if it's ACTUAL! Armed with various algorithms and approach and a dedication to impartiality, VeriFactual aims to deliver trustworthy insights. With VeriFactual, you can check for a news to be real or fake.

Join us on this exciting adventure as we revolutionize the field of Fake News Detection. Together, we can make a difference.

Thank you for choosing VeriFactual.</p>
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

export default Login;
