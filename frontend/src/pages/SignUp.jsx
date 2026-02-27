import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { ClipLoader } from "react-spinners";
import { setUserData } from "../redux/userSlice";

export const SignUp = () => {
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(result);
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("Mobile number is required");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );
      // console.log(data);
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{ borderColor: borderColor }}
      >
        <h1 className="font-bold mb-2 text-3xl p-1 hover:text-[#e64323] transition duration-200 text-[#ff4d2d]">
          Vingo
        </h1>
        <p className="text-gray-600 mb-8 mt-2">
          Sign up today and enjoy quick, easy, and reliable food delivery right
          at your fingertips. Explore a wide variety of restaurants and
          cuisines, place your order in seconds, and track it in real time.
        </p>
        {/* full name  */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name :
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-amber-500"
            placeholder="Enter Your Full Name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        </div>
        {/* email  */}
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
            className="w-full border rounded-lg px-3 py-2 focus:outline-amber-500"
            placeholder="Enter Your Email"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            autoComplete="true"
          />
        </div>
        {/* mobile number */}
        <div className="mb-4">
          <label
            htmlFor="mobilenumber"
            className="block text-gray-700 font-medium mb-1"
          >
            Number :
          </label>
          <input
            id="mobilenumber"
            type="Number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-amber-500"
            placeholder="Enter Your Phone Number"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            required
          />
        </div>
        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password :
          </label>
          <div className="relative">
            <input
              id="password"
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-amber-500"
              placeholder="Enter Your Password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              className="absolute right-3 cursor-pointer top-[15px] text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* role  */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role :
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors capitalize cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: "#e64323", color: "#fff" }
                    : { borderColor: "#ff4d2d", color: "#ff4d2d" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>
        {err && <p className="text-red-500 text-center my-1">*{err}</p>}
        <button
          className="cursor-pointer w-full mt-4 flex items-center justify-center gap-2 border-rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>
        </button>
        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already Have a Account?{" "}
          <span className="text-[#ff4d2d]">Sign in</span>
        </p>
      </div>
    </div>
  );
};
