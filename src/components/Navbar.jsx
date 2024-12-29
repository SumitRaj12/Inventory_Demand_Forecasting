import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Navbar({role}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const handleLogout = async()=>{
    try {
      const resp = await axios.get("http://localhost:3000/admin/logout",{withCredentials:true})
      toast.success(resp.data.message)
      navigate('/')
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const handleChangePassword = async()=>{
    navigate('/dashboard/change-password')
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    console.log("From nav bar",role)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-[#080a45] flex justify-between items-center py-4 px-8 shadow-lg">
      <div className="text-white">
        <h1 className="font-serif text-2xl font-bold tracking-wide">
     
        </h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="p-2 text-white cursor-pointer hover:bg-[#2a2d80] rounded-full transition-all"
          onClick={toggleDropdown}
        >
          <CgProfile size={30} />
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 overflow-hidden">
            <div className="flex flex-col items-center p-4 border-b">
              <CgProfile size={40} className="text-gray-500" />
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-600">johndoe@example.com</p>
              <p className="text-sm text-black">{role?"Admin":"Employee"}</p>
            </div>
            <ul className="text-black">
              <button onClick={handleLogout} className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-red-600">
                Logout
              </button>
            </ul>
            <ul className="text-black">
              <button onClick={handleChangePassword} className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-green-600">
                Change Password
              </button>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
