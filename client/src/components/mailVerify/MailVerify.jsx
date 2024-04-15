// MailVerify.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MailVerify.scss";
import { toast } from "react-toastify";
import axios from "axios";

const MailVerify = ({ email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleOtpChange = (event, index) => {
    const { value } = event.target;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus on the next input field
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.get(
        `http://localhost:8800/api/auth/verifymail?email=${email}&otp=${otp.join(
          ""
        )}`
      );
      toast.success("Email verified Now Please Login");
      navigate("/login");
      console.log("Verifying OTP:", otp.join(""));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="email-verification-component">
      <h2 className="title">Email Verification</h2>
      <p className="description">
        Please enter the 4-digit OTP sent to your email address.
      </p>
      <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
      <button className="verify-button" onClick={handleVerifyOtp}>
        Verify OTP
      </button>
    </div>
  );
};

export default MailVerify;
