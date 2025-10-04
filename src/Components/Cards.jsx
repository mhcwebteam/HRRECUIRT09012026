import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IoArrowBack, 
  IoFolderOpen, 
  IoStatsChart, 
  IoCalendar,
  IoPeople,
  IoAdd,
  IoSearch,
  IoFilter,
  IoEllipsisVertical,
  IoDocumentText,
  IoTime,
  IoCheckmarkCircle
} from "react-icons/io5";
import { ContextData } from '../Context/ContextData';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cards = () => {

  
  const navigate = useNavigate();

  const { projects, isProjectsLoading, subproject, isSubProjectLoading } = useContext(ContextData);

  const stats = [
    { 
      label: 'Total Sub-Projects', 
      value: subproject?.data?.length || 0, 
      icon: IoFolderOpen, 
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
      description: 'All projects in system'
    },
    { 
      label: 'Active', 
      value: Math.floor((subproject?.data?.length || 0) * 0.6), 
      icon: IoCheckmarkCircle, 
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-white',
      description: 'Currently active'
    },
    { 
      label: 'In Progress', 
      value: Math.floor((subproject?.data?.length || 0) * 0.3), 
      icon: IoTime, 
      color: 'from-orange-500 to-amber-600',
      textColor: 'text-white',
      description: 'Work in progress'
    },
    { 
      label: 'Completed', 
      value: Math.floor((subproject?.data?.length || 0) * 0.1), 
      icon: IoCheckmarkCircle, 
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-white',
      description: 'Successfully completed'
    }
  ];

  const subProjectColors = [
    { bg: 'from-blue-500 to-blue-600', text: 'text-white', icon: 'bg-white/20' },
    { bg: 'from-green-500 to-emerald-600', text: 'text-white', icon: 'bg-white/20' },
    { bg: 'from-purple-500 to-purple-600', text: 'text-white', icon: 'bg-white/20' },
    { bg: 'from-orange-500 to-amber-600', text: 'text-white', icon: 'bg-white/20' },
    { bg: 'from-pink-500 to-pink-600', text: 'text-white', icon: 'bg-white/20' },
    { bg: 'from-indigo-500 to-indigo-600', text: 'text-white', icon: 'bg-white/20' }
  ];


const handleCardClick = (sub) => {
  if (sub.sub_project_name === "Man Power") {
    navigate("/dashboard"); 
  } else {
    navigate(`/subproject/${sub.sub_project_id}`);
  }
};

  return (
    <div className="min-h-screen max-w-7xl w-full mx-auto p-10 rounded-2xl shadow-2xl border border-gray-300 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 space-y-10">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300"
            >
              <IoArrowBack className="w-5 h-5" />
              <span className="font-medium">Back to Modules</span>
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all your sub-projects in one place</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <IoAdd className="w-5 h-5" />
            <span>New Sub-Project</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Animated Background Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700 delay-100"></div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${stat.textColor} opacity-90 mb-1`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${stat.textColor} mb-2`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs ${stat.textColor} opacity-75`}>
                      {stat.description}
                    </p>
                  </div>
                  
                  {/* Icon Container */}
                  <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <IoFolderOpen className="text-blue-500" />
                  Sub-Projects
                </h2>
                <span className="text-sm text-gray-500 px-3 py-1 rounded-full bg-white">
                  {subproject?.data?.length || 0} items
                </span>
              </div>

              {/* Sub-Projects Grid with Same Card UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subproject?.data?.length > 0 ? (
                  subproject.data.map((sub, index) => {
                    const colorScheme = subProjectColors[index % subProjectColors.length];

                    return (
                      <div
                        key={sub.sub_project_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    onClick={() => handleCardClick(sub)}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                      >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        
                        {/* Animated Background Elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700 delay-100"></div>

                        {/* Content */}
                        <div className="relative z-10 p-5 h-full flex flex-col justify-between min-h-[100px]">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className={`text-white text-lg font-bold mb-2 leading-tight`}>
                                {sub?.sub_project_name}
                              </h3>
                              <p className={`text-white opacity-75 text-sm`}>
                                Manage and track project progress
                              </p>
                            </div>
                            
                            {/* Icon Container */}
                            <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                          </div>

                   
                        </div>
                        
                        {/* Hover Effect Border */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <IoFolderOpen className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No sub-projects found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          {/* <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: IoAdd, label: 'Create New Project', color: 'text-blue-500' },
                  { icon: IoStatsChart, label: 'View Analytics', color: 'text-green-500' },
                  { icon: IoCalendar, label: 'Schedule Meeting', color: 'text-purple-500' },
                  { icon: IoPeople, label: 'Team Members', color: 'text-orange-500' }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Cards;