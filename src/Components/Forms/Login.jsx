import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import { CardContent } from "@mui/material";
import { ArrowRight, Maximize2, Play, User, Lock } from "lucide-react";
import { FaCar, FaRegImages } from "react-icons/fa";
import { API_BASE_URL } from '../../Config/Config';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";



export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const location = useLocation();
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setIsModalOpen(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();


  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const userInfo = {
      token: data.token,
      Emp_Id: data.employee.Emp_Id,
      employee: data.employee.Employee_Name,
      Email: data.employee.Email,
      Is_Employee: data.employee.Is_Employee,
      Emp_Category: data.employee.Emp_Category,
    };
     navigate('/Manpower');

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  } finally {
    // setIsLoading(false);
  }
};
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: -2,
        }}
      >
        <source src="/myHomeDashboard/Login/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="flex justify-between items-center">
        <img
          src="/myHomeDashboard/Login/my home logo.png"
          alt="Logo"
          className="h-12 w-12 rounded-full object-cover border-2 border-[#5F7161] absolute left-8 top-8"
        />
      </div>

      <div className="min-h-screen flex items-center justify-between px-2 lg:px-4">
        {/* Left Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card
            className="max-w-[200px] h-20 flex items-center justify-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-violet-500"
            style={{ backgroundColor: "#C4B5FD" }}
          >
            <CardContent className="flex items-center space-x-4 p-0">
              <FaRegImages className="text-4xl text-violet-600" />
              <div className="h-10 w-[4px] bg-violet-600"></div>
              <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
                MHCPL EVENTS
              </h3>
            </CardContent>
          </Card>

          <Card
            className="max-w-[240px] h-20 flex items-center justify-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-yellow-500"
            style={{ backgroundColor: "#FFDBAA" }}
          >
            <CardContent className="flex items-center space-x-4 p-0">
              <FaCar className="text-4xl text-yellow-700" />
              <div className="h-10 w-[4px] bg-yellow-700"></div>
              <h3 className="text-sm md:text-base lg:text-lg text-black font-bold">
                TRAVEL GRID
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Center Login Form */}
        <div className="flex justify-center flex-1 max-w-md mx-8">
          <div className="w-full">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative">
              <div className="flex justify-center mt-6 mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
                <p className="text-gray-600">Access your account securely</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="h-full flex flex-col space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      // onFocus={() => setFocusedField("username")}
                      // onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      ></button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Sign In <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300">
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Video */}
        <div className="hidden lg:flex flex-col space-y-6 w-[28rem] xl:w-[34rem]">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-3 border border-white/10 shadow-2xl h-[670px]">
            <div className="text-center">
              <h3 className="text-white mb-2">WATCH OUR SERVICES IN ACTION</h3>
            </div>

            <div className="relative group flex-1">
              <video
                src="/myHomeDashboard/Login/v2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => openModal("video")}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300"
                >
                  <Maximize2 className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 space-y-2 p-2">
              <h1 className="flex items-center justify-center text-md text-white text-center">
                WARM WISHES ON YOUR SPECIAL DAY
              </h1>

              <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                <img
                  src="https://s-media-cache-ak0.pinimg.com/originals/8d/ee/a1/8deea1684d2e774d2a4e691decb07334.gif"
                  alt="Birthday"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute -top-3 right-0 text-white text-3xl font-bold z-10 hover:text-gray-300"
            >
              ×
            </button>
            {modalType === "video" && (
              <video
                src="/myHomeDashboard/Login/v2.mp4"
                autoPlay
                controls
                loop
                className="w-full h-[60vh] md:h-[80vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
