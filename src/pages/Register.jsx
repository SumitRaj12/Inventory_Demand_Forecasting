// import {
//   FaUser,
//   FaLock,
//   FaEnvelope,
//   FaBuilding,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import citiesInIndia from "../constants/constants.js";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Register() {
//   const [show, setShow] = useState(false);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     companyName: "",
//     companyLocation: "",
//     userName: "",
//     email: "",
//     password: "",
//   });

//   const handleShow = () => {
//     setShow((prev) => !prev);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const resp = await axios.post("http://localhost:3000/admin/register", {
//         companyName: form.companyName,
//         companyLocation: form.companyLocation,
//         userName: form.userName,
//         Email: form.email,
//         Password: form.password,
//       });

//       toast.success(resp.data.message);
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="h-screen w-screen bg-[#080a45] flex justify-center items-center">
//       <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg flex flex-col items-center w-11/12 max-w-md">
//         <h1 className="text-3xl font-semibold text-white mb-6">Register</h1>

//         <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
//           {/* Company Name Input */}
//           <div className="relative flex items-center">
//             <input
//               type="text"
//               name="companyName"
//               placeholder="Company Name"
//               value={form.companyName}
//               onChange={handleChange}
//               className="w-full bg-white bg-opacity-40 text-white placeholder-white rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#51487e]"
//             />
//             <FaBuilding className="absolute left-3 text-white" />
//           </div>

//           {/* Company Location Input */}
//           <div className="relative flex items-center">
//             <select
//               name="companyLocation"
//               value={form.companyLocation}
//               onChange={handleChange}
//               className="w-full p-3 bg-white bg-opacity-40 text-white placeholder-white rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#51487e] z-10"
//             >
//               <option
//                 value=""
//                 disabled
//                 selected
//                 className="text-black bg-gray-300"
//               >
//                 Company Location
//               </option>
//               {citiesInIndia.map((city, key) => (
//                 <option key={key} value={city} className="text-black">
//                   {city}
//                 </option>
//               ))}
//             </select>
//             <FaLocationDot className="absolute left-3 text-white" />
//           </div>

//           {/* Username Input */}
//           <div className="relative flex items-center">
//             <input
//               type="text"
//               name="userName"
//               placeholder="User Name"
//               value={form.userName}
//               onChange={handleChange}
//               className="w-full bg-white bg-opacity-40 text-white placeholder-white rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#51487e]"
//             />
//             <FaUser className="absolute left-3 text-white" />
//           </div>

//           {/* Email Input */}
//           <div className="relative flex items-center">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full bg-white bg-opacity-40 text-white placeholder-white rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#51487e]"
//             />
//             <FaEnvelope className="absolute left-3 text-white" />
//           </div>

//           {/* Password Input */}
//           <div className="relative flex items-center">
//             <input
//               type={show ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full bg-white bg-opacity-40 text-white placeholder-white rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#51487e]"
//             />
//             <FaLock className="absolute left-3 text-white" />
//             {show ? (
//               <FaEyeSlash
//                 onClick={handleShow}
//                 className="absolute right-3 text-white text-lg cursor-pointer"
//               />
//             ) : (
//               <FaEye
//                 onClick={handleShow}
//                 className="absolute right-3 text-white text-lg cursor-pointer"
//               />
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full py-2 hover:opacity-90 transition-opacity"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaBuilding,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import citiesInIndia from "../constants/constants.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    companyLocation: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resp = await axios.post("http://localhost:3000/admin/register", {
        companyName: form.companyName,
        companyLocation: form.companyLocation,
        userName: form.userName,
        Email: form.email,
        Password: form.password,
      });

      toast.success(resp.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#080a45] flex justify-center items-center">
      <div className="bg-white shadow-md p-8 rounded-lg flex flex-col items-center w-11/12 max-w-md">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">Register</h1>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Company Name Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full bg-gray-50 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaBuilding className="absolute left-3 text-blue-600" />
          </div>

          {/* Company Location Input */}
          <div className="relative flex items-center">
            <select
              name="companyLocation"
              value={form.companyLocation}
              onChange={handleChange}
              className="w-full bg-gray-50 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 z-10"
            >
              <option
                value=""
                disabled
                selected
                className="text-gray-500 bg-gray-200"
              >
                Company Location
              </option>
              {citiesInIndia.map((city, key) => (
                <option key={key} value={city} className="text-gray-700">
                  {city}
                </option>
              ))}
            </select>
            <FaLocationDot className="absolute left-3 text-blue-600" />
          </div>

          {/* Username Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              value={form.userName}
              onChange={handleChange}
              className="w-full bg-gray-50 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaUser className="absolute left-3 text-blue-600" />
          </div>

          {/* Email Input */}
          <div className="relative flex items-center">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-50 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaEnvelope className="absolute left-3 text-blue-600" />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-50 text-blue-600 placeholder-blue-400 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaLock className="absolute left-3 text-blue-600" />
            {show ? (
              <FaEyeSlash
                onClick={handleShow}
                className="absolute right-3 text-blue-600 text-lg cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={handleShow}
                className="absolute right-3 text-blue-600 text-lg cursor-pointer"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full py-2 hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
