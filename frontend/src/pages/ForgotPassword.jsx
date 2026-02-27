import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPasword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setErr(error?.response?.data?.message);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setErr(error?.response?.data?.message);
    }
  };

  const handleResetPassword = async () => {
    if (newPasword !== confirmPassword) return null;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPasword },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setErr(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 ">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowBack
            size={24}
            className=" text-[#ff4d2d]"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d] ">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email :
              </label>
              <input
                id="email"
                type="email"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="true"
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-1">*{err}</p>}
          </div>
        )}

        {step == 2 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP :
              </label>
              <input
                id="otp"
                type="number"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter Your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-1">*{err}</p>}
          </div>
        )}

        {step == 3 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="newpassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New password :
              </label>
              <input
                id="newpassword"
                type="password"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter Your new Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPasword}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmnewpassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm New password :
              </label>
              <input
                id="confirmnewpassword"
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm Your new Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
            {err && <p className="text-red-500 text-center my-1">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
