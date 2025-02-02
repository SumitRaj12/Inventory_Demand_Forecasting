import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import React, { useState, useContext } from "react";
import { SalesContext } from "@/context/salesUpdate.context";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {updateRole} = useContext(SalesContext)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const resp = await axios.post("http://localhost:3000/admin/login", {
        userName: formData.userName,
        Email: formData.email,
        Password: formData.password,
      }, {
        withCredentials: true
      });
      setFormData({
        userName: "",
        email: "",
        password: "",
      })
      toast.success(resp.data.message);
      updateRole(resp.data.admin)
      setTimeout(() => navigate("/dashboard", { state: { role: resp.data.admin } }), 2000);
    } catch (error) {
      toast.error(error?.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen w-screen  bg-[#080a45] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-11/12 max-w-md">
        <h1 className="text-3xl font-semibold text-blue-800 mb-6">Log In</h1>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="User Name"
              value={formData.userName}
              onChange={handleChange}
              className="w-full bg-gray-100 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
            <FaUser className="absolute left-3 text-blue-600" />
          </div>

          {/* Email Input */}
          <div className="relative flex items-center">
            <input
              type="email"
              name="email"
              id="Email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
            <FaEnvelope className="absolute left-3 text-blue-600" />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
            <FaLock className="absolute left-3 text-blue-600" />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-3 text-blue-400 cursor-pointer"
                onClick={handleShowPassword}
              />
            ) : (
              <FaEye
                className="absolute right-3 text-blue-600 cursor-pointer"
                onClick={handleShowPassword}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-600 text-white font-semibold rounded-full py-2 hover:opacity-90 transition-opacity duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
