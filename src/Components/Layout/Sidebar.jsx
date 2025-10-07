import React, { useState, useContext } from 'react';
import { Home, Users, LogOut, ChevronRight, Sun, CloudRain, Wind, Zap, Trash2, Droplets, TrendingUp, Users as UsersIcon, FileKey2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();

  
  const handleBack = () => {
    navigate('/dashboard');
  }

  const menuItems = [
    { path: '/Manpower', icon: Users, label: 'Manpower' },
        {path:'/RecruitmentProcess', icon: FileKey2, label:'Recruitments'},
    { path: '/onBoarding', icon: Home, label: 'Onboarding' }

  ];

  return (
    <div
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}

      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#0f3d32] to-[#145644] shadow-2xl
        ${isSidebarOpen ? 'w-[280px]' : 'w-[100px]'} 
        transition-all duration-300 ease-in-out overflow-hidden z-50`}
    >
      <div 
        className='h-[80px] flex items-center px-4 border-b cursor-pointer group'
        onClick={handleBack}
      >
        <div className='flex items-center gap-3 w-full'>
          <div className='relative'>
               <div className='w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200'>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <img
                src="/images/imagesmy.png"
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </div>

          </div>
          {isSidebarOpen && (
            <div className='flex flex-col'>
              <span className='text-emerald-500 font-bold text-lg tracking-tight'>My Home</span>
              <span className='text-gray-500 text-xs'>Dashboard</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className='mt-6 px-3'>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full mb-2 py-3.5 px-3 rounded-2xl flex items-center gap-4 cursor-pointer
                transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 shadow-lg border border-emerald-500/30' 
                  : 'hover:bg-slate-700/50'
                } block no-underline`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full' />
              )}
              
              {/* Icon Container */}
              <div className={`relative flex-shrink-0 ${isActive ? 'ml-2' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg' 
                    : 'bg-slate-700 group-hover:bg-slate-600'
                  }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                </div>
              </div>
              
              {/* Label */}
              {isSidebarOpen && (
                <div className='flex items-center justify-between flex-1'>
                  <span className={`font-semibold text-[15px] transition-colors
                    ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-all duration-200
                    ${isActive ? 'text-cyan-300 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`} />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

 export default Sidebar;