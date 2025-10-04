// import React, { useState, useEffect } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   Typography, 
//   Grid, 
//   Box,
//   Button,
//   Chip,
//   Switch,
//   FormControlLabel,
//   Paper,
//   Tabs,
//   Tab
// } from '@mui/material';
// import {
//   People as PeopleIcon,
//   TrendingUp as TrendingUpIcon,
//   Assignment as AssignmentIcon,
//   Notifications as NotificationsIcon,
//   GroupAdd as GroupAddIcon,
//   ListAlt as ListAltIcon,
//   UploadFile as UploadFileIcon,
//   RequestQuote as RequestQuoteIcon
// } from '@mui/icons-material';
// import ManpowerHRList from '../../ManpowerComponent/ManPowerHrList'
// import ManpowerRequestForm from '../../ManpowerComponent/ManpowerForm';
// import DashboardMrf from '../../ManpowerComponent/DashboardMrf'
// import MrfUploadList from '../../Mrf/MrfUploadList';
// import MrfUpload from "../../Mrf/MrfUpload";
// import { useLocation } from 'react-router-dom';

// const Dashboard = () => {
//   const location = useLocation();
//   const [onboardingEnabled, setOnboardingEnabled] = useState(true);
//   const [activeManpowerComponent, setActiveManpowerComponent] = useState(null);
//   const [activeTab, setActiveTab] = useState(0); // 0 for Manpower, 1 for Onboarding
//   const [hoveredTab, setHoveredTab] = useState(null);

//   // Set active tab based on route
//   useEffect(() => {
//     if (location.pathname === '/Manpower') {
//       setActiveTab(0); // Manpower tab
//     } else if (location.pathname === '/dashboard') {
//       setActiveTab(1); // Onboarding tab
//     }
//   }, [location.pathname]);

//   const stats = [
//     { 
//       label: 'Total Employees', 
//       value: '1,234', 
//       icon: PeopleIcon, 
//       color: 'blue' 
//     },
//     { 
//       label: 'Active Projects', 
//       value: '56', 
//       icon: AssignmentIcon, 
//       color: 'green' 
//     },
//     { 
//       label: 'Pending Requests', 
//       value: '23', 
//       icon: NotificationsIcon, 
//       color: 'orange' 
//     },
//     { 
//       label: 'Growth Rate', 
//       value: '+12%', 
//       icon: TrendingUpIcon, 
//       color: 'purple' 
//     },
//   ];

//   const manpowerMenuItems = [
//     { 
//       label: 'Dashboard', 
//       component: 'dashboard', 
//       icon: RequestQuoteIcon,
//     },
//     { 
//       label: 'Request Form', 
//       component: 'request-form', 
//       icon: RequestQuoteIcon,
//     },
//     { 
//       label: 'HR List', 
//       component: 'hr-list', 
//       icon: ListAltIcon,
//     },
//     { 
//       label: 'Upload Form', 
//       component: 'upload-form', 
//       icon: UploadFileIcon,
//     },
//     { 
//       label: 'Upload List', 
//       component: 'upload-list', 
//       icon: ListAltIcon,
//     },
//   ];

//   const onboardingMenuItems = [
//     { 
//       label: 'Employee Onboarding', 
//       component: 'employee-onboarding', 
//       icon: GroupAddIcon,
//     },
//     { 
//       label: 'Settings', 
//       component: 'onboarding-settings', 
//       icon: AssignmentIcon,
//     },
//     { 
//       label: 'Reports', 
//       component: 'onboarding-reports', 
//       icon: TrendingUpIcon,
//     },
//   ];

//   const handleMenuItemClick = (component) => {
//     setActiveManpowerComponent(component);
//   };

//   const handleOnboardingToggle = (event) => {
//     setOnboardingEnabled(event.target.checked);
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setActiveManpowerComponent(null);
//   };

//   const getColorClasses = (color) => {
//     const colorMap = {
//       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
//       green: { bg: 'bg-green-100', text: 'text-green-600' },
//       orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
//       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
//     };
//     return colorMap[color] || colorMap.blue;
//   };

//   // Render the active manpower component
//   const renderManpowerComponent = () => {
//     switch (activeManpowerComponent) {
//       case 'dashboard':
//         return <DashboardMrf />;
//       case 'request-form':
//         return <ManpowerRequestForm />;
//       case 'hr-list':
//         return <ManpowerHRList />;
//       case 'upload-form':
//         return <MrfUpload />;
//       case 'upload-list':
//         return <MrfUploadList />;
//       default:
//         return null;
//     }
//   };

//   // Render the active onboarding component
//   const renderOnboardingComponent = () => {
//     switch (activeManpowerComponent) {
//       case 'employee-onboarding':
//         return (
//           <div className="p-6">
//             <Typography variant="h4" className="mb-4">Employee Onboarding</Typography>
//             <Typography>Employee onboarding content goes here...</Typography>
//           </div>
//         );
//       case 'onboarding-settings':
//         return (
//           <div className="p-6">
//             <Typography variant="h4" className="mb-4">Onboarding Settings</Typography>
//             <Typography>Onboarding settings content goes here...</Typography>
//           </div>
//         );
//       case 'onboarding-reports':
//         return (
//           <div className="p-6">
//             <Typography variant="h4" className="mb-4">Onboarding Reports</Typography>
//             <Typography>Onboarding reports content goes here...</Typography>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="">
//       {/* Header */}
//       <Paper elevation={1} className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-orange-500">
  

//         {/* Main Tabs */}
//         <Box className="border-b border-gray-200">
//           <Tabs 
//             value={activeTab} 
//             onChange={handleTabChange}
//             className="min-h-0"
//             sx={{
//               '& .MuiTab-root': {
//                 minHeight: '48px',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 textTransform: 'none',
//               }
//             }}
//           >
//             <Tab 
//               label="Manpower" 
//               icon={<PeopleIcon />} 
//               iconPosition="start"
//             />
//             <Tab 
//               label="Onboarding" 
//               icon={<GroupAddIcon />} 
//               iconPosition="start"
//             />
//           </Tabs>
//         </Box>

//         {/* Submenu for Manpower Tab */}
//         {(activeTab === 0 || hoveredTab === 0) && (
//           <Box className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <Box className="flex flex-wrap gap-2">
//               {manpowerMenuItems.map((item) => {
//                 const IconComponent = item.icon;
//                 const isActive = activeManpowerComponent === item.component;
                
//                 return (
//                   <Button
//                     key={item.component}
//                     variant={isActive ? "contained" : "outlined"}
//                     size="medium"
//                     onClick={() => handleMenuItemClick(item.component)}
//                     className={`normal-case transition-all duration-200 ${
//                       isActive 
//                         ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
//                         : 'bg-white hover:bg-orange-50 border-gray-300 text-gray-700'
//                     }`}
//                     startIcon={<IconComponent />}
//                   >
//                     {item.label}
//                   </Button>
//                 );
//               })}
//             </Box>
//           </Box>
//         )}

//         {/* Submenu for Onboarding Tab */}
//         {(activeTab === 1 || hoveredTab === 1) && (
//           <Box className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <Box className="flex flex-wrap gap-2">
//               {onboardingMenuItems.map((item) => {
//                 const IconComponent = item.icon;
//                 const isActive = activeManpowerComponent === item.component;
                
//                 return (
//                   <Button
//                     key={item.component}
//                     variant={isActive ? "contained" : "outlined"}
//                     size="medium"
//                     onClick={() => handleMenuItemClick(item.component)}
//                     className={`normal-case transition-all duration-200 ${
//                       isActive 
//                         ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
//                         : 'bg-white hover:bg-orange-50 border-gray-300 text-gray-700'
//                     }`}
//                     startIcon={<IconComponent />}
//                   >
//                     {item.label}
//                   </Button>
//                 );
//               })}
//             </Box>
//           </Box>
//         )}
//       </Paper>

//       {/* Show active component */}
//       {activeManpowerComponent ? (
//         <Box>
//           <Paper elevation={2} className="p-2">
//             <Box className="flex justify-between items-center">
//               {/* Optional: Add back button if needed */}
//             </Box>
//             {activeTab === 0 ? renderManpowerComponent() : renderOnboardingComponent()}
//           </Paper>
//         </Box>
//       ) : (
//         <>
//           {/* Stats Cards - Only show when no component is active and on Manpower tab */}
//           {activeTab === 0 && (
//             <Grid container spacing={3} className="mb-6">
//               {stats.map((stat, index) => {
//                 const IconComponent = stat.icon;
//                 const colorClasses = getColorClasses(stat.color);
                
//                 return (
//                   <Grid item xs={12} sm={6} lg={3} key={index}>
//                     <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200">
//                       <CardContent className="p-4">
//                         <Box className="flex items-center justify-between">
//                           <Box>
//                             <Typography 
//                               variant="body2" 
//                               className="text-gray-500 mb-1 font-medium"
//                             >
//                               {stat.label}
//                             </Typography>
//                             <Typography 
//                               variant="h4" 
//                               className="font-bold text-gray-800"
//                             >
//                               {stat.value}
//                             </Typography>
//                           </Box>
//                           <Box 
//                             className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center transition-colors`}
//                           >
//                             <IconComponent className={colorClasses.text} />
//                           </Box>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           )}

//           {/* Recent Activity - Only show when no component is active and on Manpower tab */}
//           {activeTab === 0 && (
//             <Card className="shadow-md border border-gray-100">
//               <CardContent className="p-4">
//                 <Box className="flex justify-between items-center mb-4">
//                   <Typography variant="h6" className="font-semibold text-gray-800">
//                     Recent Activity
//                   </Typography>
//                   <Chip 
//                     label="No new notifications" 
//                     size="small" 
//                     color="default" 
//                     variant="outlined"
//                   />
//                 </Box>
//                 <Box className="text-center py-8">
//                   <NotificationsIcon className="text-gray-400 mb-2" fontSize="large" />
//                   <Typography variant="body1" className="text-gray-500">
//                     No recent activity to display
//                   </Typography>
//                   <Typography variant="body2" className="text-gray-400 mt-1">
//                     New activities will appear here
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}

//           {/* Default Onboarding Content */}
//           {activeTab === 1 && (
//             <Card className="shadow-md border border-gray-100">
//               <CardContent className="p-6">
//                 <Box className="text-center py-8">
//                   <GroupAddIcon className="text-gray-400 mb-2" fontSize="large" />
//                   <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
//                     Onboarding Management
//                   </Typography>
//                   <Typography variant="body1" className="text-gray-500">
//                     Select an onboarding option from the menu above to get started
//                   </Typography>
//                   <Paper variant="outlined" className="p-4 mt-4 max-w-md mx-auto">
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={onboardingEnabled}
//                           onChange={handleOnboardingToggle}
//                           color="primary"
//                           size="medium"
//                         />
//                       }
//                       label={
//                         <Box className="flex items-center gap-3">
//                           <GroupAddIcon fontSize="medium" />
//                           <Box>
//                             <Typography variant="body1" className="font-semibold">
//                               Employee Onboarding
//                             </Typography>
//                             <Typography variant="body2" className="text-gray-500">
//                               {onboardingEnabled 
//                                 ? 'Onboarding process is currently enabled' 
//                                 : 'Onboarding process is currently disabled'
//                               }
//                             </Typography>
//                           </Box>
//                         </Box>
//                       }
//                     />
//                   </Paper>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  GroupAdd as GroupAddIcon,
  ListAlt as ListAltIcon,
  UploadFile as UploadFileIcon,
  RequestQuote as RequestQuoteIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [activeManpowerComponent, setActiveManpowerComponent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { 
      label: 'Total Employees', 
      value: '1,234', 
      icon: PeopleIcon, 
      gradient: 'from-blue-500 to-cyan-500',
      lightGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      label: 'Active Projects', 
      value: '56', 
      icon: AssignmentIcon, 
      gradient: 'from-green-500 to-emerald-500',
      lightGradient: 'from-green-50 to-emerald-50'
    },
    { 
      label: 'Pending Requests', 
      value: '23', 
      icon: NotificationsIcon, 
      gradient: 'from-orange-500 to-red-500',
      lightGradient: 'from-orange-50 to-red-50'
    },
    { 
      label: 'Growth Rate', 
      value: '+12%', 
      icon: TrendingUpIcon, 
      gradient: 'from-purple-500 to-pink-500',
      lightGradient: 'from-purple-50 to-pink-50'
    },
  ];

  const manpowerMenuItems = [
    { 
      label: 'Dashboard', 
      component: 'dashboard', 
      icon: RequestQuoteIcon,
    },
    { 
      label: 'Request Form', 
      component: 'request-form', 
      icon: RequestQuoteIcon,
    },
    { 
      label: 'HR List', 
      component: 'hr-list', 
      icon: ListAltIcon,
    },
    { 
      label: 'Upload Form', 
      component: 'upload-form', 
      icon: UploadFileIcon,
    },
    { 
      label: 'Upload List', 
      component: 'upload-list', 
      icon: ListAltIcon,
    },
  ];

  const onboardingMenuItems = [
    { 
      label: 'Employee Onboarding', 
      component: 'employee-onboarding', 
      icon: GroupAddIcon,
    },
    { 
      label: 'Settings', 
      component: 'onboarding-settings', 
      icon: AssignmentIcon,
    },
    { 
      label: 'Reports', 
      component: 'onboarding-reports', 
      icon: TrendingUpIcon,
    },
  ];

  const handleMenuItemClick = (component) => {
    setActiveManpowerComponent(component);
  };

  const handleOnboardingToggle = (event) => {
    setOnboardingEnabled(event.target.checked);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveManpowerComponent(null);
  };

  const renderManpowerComponent = () => {
    switch (activeManpowerComponent) {
      case 'dashboard':
        return <div className="p-6"><Typography variant="h5">Dashboard Component</Typography></div>;
      case 'request-form':
        return <div className="p-6"><Typography variant="h5">Request Form Component</Typography></div>;
      case 'hr-list':
        return <div className="p-6"><Typography variant="h5">HR List Component</Typography></div>;
      case 'upload-form':
        return <div className="p-6"><Typography variant="h5">Upload Form Component</Typography></div>;
      case 'upload-list':
        return <div className="p-6"><Typography variant="h5">Upload List Component</Typography></div>;
      default:
        return null;
    }
  };

  const renderOnboardingComponent = () => {
    switch (activeManpowerComponent) {
      case 'employee-onboarding':
        return (
          <div className="p-6">
            <Typography variant="h4" className="mb-4">Employee Onboarding</Typography>
            <Typography>Employee onboarding content goes here...</Typography>
          </div>
        );
      case 'onboarding-settings':
        return (
          <div className="p-6">
            <Typography variant="h4" className="mb-4">Onboarding Settings</Typography>
            <Typography>Onboarding settings content goes here...</Typography>
          </div>
        );
      case 'onboarding-reports':
        return (
          <div className="p-6">
            <Typography variant="h4" className="mb-4">Onboarding Reports</Typography>
            <Typography>Onboarding reports content goes here...</Typography>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Box className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="px-8 py-6">
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Welcome back! Here's what's happening today
          </Typography>
        </div>

        {/* Main Tabs */}
        <Box className="px-8">
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                minHeight: '56px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#EA580C',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#EA580C',
                height: '3px',
                borderRadius: '3px 3px 0 0',
              }
            }}
          >
            <Tab 
              label="Manpower" 
              icon={<PeopleIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Onboarding" 
              icon={<GroupAddIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Submenu for Manpower Tab */}
        {activeTab === 0 && (
          <Box className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <Box className="flex flex-wrap gap-2">
              {manpowerMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeManpowerComponent === item.component;
                
                return (
                  <button
                    key={item.component}
                    onClick={() => handleMenuItemClick(item.component)}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <IconComponent fontSize="small" />
                    {item.label}
                  </button>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Submenu for Onboarding Tab */}
        {activeTab === 1 && (
          <Box className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <Box className="flex flex-wrap gap-2">
              {onboardingMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeManpowerComponent === item.component;
                
                return (
                  <button
                    key={item.component}
                    onClick={() => handleMenuItemClick(item.component)}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <IconComponent fontSize="small" />
                    {item.label}
                  </button>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Show active component */}
        {activeManpowerComponent ? (
          <Box>
            <Paper elevation={0} className="rounded-3xl border border-gray-200 shadow-sm bg-white">
              {activeTab === 0 ? renderManpowerComponent() : renderOnboardingComponent()}
            </Paper>
          </Box>
        ) : (
          <>
            {/* Stats Cards - Only show when no component is active and on Manpower tab */}
            {activeTab === 0 && (
              <Grid container spacing={3} className="mb-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  
                  return (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                      <div className={`rounded-3xl p-6 bg-gradient-to-br ${stat.lightGradient} border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
                        <Box className="flex flex-col">
                          <Box className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                            <IconComponent className="text-white" fontSize="medium" />
                          </Box>
                          <Typography 
                            variant="body2" 
                            className="text-gray-600 mb-1 font-medium"
                          >
                            {stat.label}
                          </Typography>
                          <Typography 
                            variant="h3" 
                            className="font-bold text-gray-900"
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* Recent Activity - Only show when no component is active and on Manpower tab */}
            {activeTab === 0 && (
              <div className="rounded-3xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <Box className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold text-gray-900">
                      Recent Activity
                    </Typography>
                    <Chip 
                      label="No new notifications" 
                      size="small" 
                      className="bg-gray-100 text-gray-600 font-medium"
                    />
                  </Box>
                </div>
                <div className="p-6">
                  <Box className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <NotificationsIcon className="text-gray-400" fontSize="large" />
                    </div>
                    <Typography variant="h6" className="text-gray-900 font-semibold mb-2">
                      No recent activity
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      New activities will appear here
                    </Typography>
                  </Box>
                </div>
              </div>
            )}

            {/* Default Onboarding Content */}
            {activeTab === 1 && (
              <div className="rounded-3xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="p-8">
                  <Box className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-6">
                      <GroupAddIcon className="text-orange-600" style={{ fontSize: '40px' }} />
                    </div>
                    <Typography variant="h5" className="font-bold text-gray-900 mb-3">
                      Onboarding Management
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-8">
                      Select an onboarding option from the menu above to get started
                    </Typography>
                    <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={onboardingEnabled}
                            onChange={handleOnboardingToggle}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#EA580C',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#EA580C',
                              },
                            }}
                          />
                        }
                        label={
                          <Box className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                              <GroupAddIcon fontSize="small" className="text-white" />
                            </div>
                            <Box className="text-left">
                              <Typography variant="body1" className="font-semibold text-gray-900">
                                Employee Onboarding
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                {onboardingEnabled 
                                  ? 'Currently enabled' 
                                  : 'Currently disabled'
                                }
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </div>
                  </Box>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;