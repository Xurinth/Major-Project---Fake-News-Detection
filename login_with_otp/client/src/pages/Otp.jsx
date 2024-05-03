import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Removed ToastContainer import
import { useLocation, useNavigate } from 'react-router-dom';
import { userVerify } from "../services/Apis"

const Otp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    if (otp === "") {
      toast.error("Enter Your Otp")
    } else if (!/[^a-zA-Z]/.test(otp)) {
      toast.error("Enter Valid Otp")
    } else if (otp.length < 6) {
      toast.error("Otp Length minimum 6 digit")
    } else {
      const data = {
        otp, email: location.state
      }

      const response = await userVerify(data);
      if (response.status === 200) {
        localStorage.setItem("userdbtoken", response.data.userToken);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/dashboard")
        }, 5000)
      } else {
        toast.error(response.response.data.error)
      }
    }
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Enter OTP</h4>
                        <div className="form-group">
                          <input
                            type="text"
                            name="otp"
                            className="form-style"
                            placeholder="Enter OTP"
                            id="otp"
                            autoComplete="off"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </div>
                        <button className="btn mt-4" onClick={loginUser}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-back">
                    {/* Add content for card back if needed */}
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

export default Otp;
