import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const OtpVerificationModal = ({ email, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input when a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split('').forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/send-otp`, { email }, {
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsOtpSent(true);
      setCountdown(600);
      setMessage("OTP sent successfully!");
      // Focus first input when OTP is sent
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setMessage("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/verify-otp`, {
        email,
        otp: otpCode
      });
      setMessage("Verification successful!");
      setTimeout(onClose, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        
        {!isOtpSent ? (
          <div className="space-y-4">
            <p className="text-gray-300 text-center">
              We'll send a 6-digit code to <span className="font-semibold">{email}</span> to verify your account.
            </p>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Enter the 6-digit code sent to <span className="font-semibold">{email}</span>.
              <br />Expires in: <span className="text-yellow-400">{formatTime(countdown)}</span>
            </p>
            
            <div className="flex justify-center space-x-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-2xl text-center bg-gray-700 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  maxLength="1"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={otp.some(d => d === "") || isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            
            <button
              onClick={handleSendOtp}
              disabled={countdown > 540 || isLoading}
              className="w-full text-purple-400 hover:text-purple-300 text-sm disabled:opacity-50"
            >
              Didn't receive code? Resend
            </button>
          </div>
        )}

        {message && (
          <p className={`mt-4 text-center ${
            message.includes("success") ? "text-green-400" : "text-red-400"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationModal;