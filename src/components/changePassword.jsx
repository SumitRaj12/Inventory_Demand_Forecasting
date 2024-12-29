import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/employee/changePassword",
        { password: newPassword },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage("Error changing password");
      toast.error("Error changing password");
    }
  };

  const handleShowNewPassword = ()=>{
    setShowNewPassword(!showNewPassword)
  }
  const handleShowConfirmPassword = ()=>{
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Change Password
        </h2>
        <div className="mb-4">
          <label className="block text-blue-700 mb-2" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {showNewPassword ? (
              <FaEyeSlash
                className="absolute right-3 text-black cursor-pointer"
                onClick={handleShowNewPassword}
              />
            ) : (
              <FaEye
                className="absolute right-3 text-black cursor-pointer"
                onClick={handleShowNewPassword}
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Re-enter new password"
              className="w-full p-2 border border-gray-300 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {showConfirmPassword ? (
              <FaEyeSlash
                className="absolute right-3 text-black cursor-pointer"
                onClick={handleShowConfirmPassword}
              />
            ) : (
              <FaEye
                className="absolute right-3 text-black cursor-pointer"
                onClick={handleShowConfirmPassword}
              />
            )}
          </div>
        </div>
        {message && <p className="text-red-700 mb-4">{message}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
