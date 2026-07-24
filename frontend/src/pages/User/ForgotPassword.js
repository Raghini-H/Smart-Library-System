import React, { useState } from "react";
import API from "../../api/axios";
import "../../style/ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await API.post("/user/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message);
    }
  };

  const resetPass = async () => {
    try {
      const res = await API.post("/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      navigate('/login')
    } catch (err) {
      setMessage(err.response?.data?.message);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        {message && <div className="forgot-message">{message}</div>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={resetPass}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;