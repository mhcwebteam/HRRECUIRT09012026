





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

import { useLocation } from 'react-router-dom';

const Onboarding = () => {
  const location = useLocation();
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [activeManpowerComponent, setActiveManpowerComponent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname === '/Manpower') {
      setActiveTab(1); // Manpower tab
    } else if (location.pathname === '/OnBoarding') {
      setActiveTab(0); // Onboarding tab
    }
  }, [location.pathname]);

  const stats = [
    { 
      label: 'Total Employees', 
      value: '1,234', 
      icon: PeopleIcon, 
      color: 'blue' 
    },
    { 
      label: 'Active Projects', 
      value: '56', 
      icon: AssignmentIcon, 
      color: 'green' 
    },
    { 
      label: 'Pending Requests', 
      value: '23', 
      icon: NotificationsIcon, 
      color: 'orange' 
    },
    { 
      label: 'Growth Rate', 
      value: '+12%', 
      icon: TrendingUpIcon, 
      color: 'purple' 
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

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    };
    return colorMap[color] || colorMap.blue;
  };

  // Render the active manpower component
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

  // Render the active onboarding component
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
    <div className="">
      {/* Header */}
      <Paper elevation={1} className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-orange-500">
  

        {/* Main Tabs */}
        <Box className="border-b border-gray-200">
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            className="min-h-0"
            sx={{
              '& .MuiTab-root': {
                minHeight: '48px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }
            }}
          >
            <Tab 
              label="onBoarding" 
              icon={<PeopleIcon />} 
              iconPosition="start"
            />
        
          </Tabs>
        </Box>

   

        {/* Submenu for Onboarding Tab */}
        {(activeTab === 0 || hoveredTab === 0) && (
          <Box className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Box className="flex flex-wrap gap-2">
              {onboardingMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeManpowerComponent === item.component;
                
                return (
                  <Button
                    key={item.component}
                    variant={isActive ? "contained" : "outlined"}
                    size="medium"
                    onClick={() => handleMenuItemClick(item.component)}
                    className={`normal-case transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
                        : 'bg-white hover:bg-orange-50 border-gray-300 text-gray-700'
                    }`}
                    startIcon={<IconComponent />}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Show active component */}
      {activeManpowerComponent ? (
        <Box>
          <Paper elevation={2} className="p-2">
            <Box className="flex justify-between items-center">
              {/* Optional: Add back button if needed */}
            </Box>
            {activeTab === 1 ? renderManpowerComponent() : renderOnboardingComponent()}
          </Paper>
        </Box>
      ) : (
        <>
          {/* Stats Cards - Only show when no component is active and on Manpower tab */}
          {activeTab === 0 && (
            <Grid container spacing={3} className="mb-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const colorClasses = getColorClasses(stat.color);
                
                return (
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200">
                      <CardContent className="p-4">
                        <Box className="flex items-center justify-between">
                          <Box>
                            <Typography 
                              variant="body2" 
                              className="text-gray-500 mb-1 font-medium"
                            >
                              {stat.label}
                            </Typography>
                            <Typography 
                              variant="h4" 
                              className="font-bold text-gray-800"
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                          <Box 
                            className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center transition-colors`}
                          >
                            <IconComponent className={colorClasses.text} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {activeTab === 0 && (
                  <Card className="shadow-md border border-gray-100">
                    <CardContent className="p-4">
                      <Box className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-semibold text-gray-800">
                          Recent Activity
                        </Typography>
                        <Chip 
                          label="No new notifications" 
                          size="small" 
                          color="default" 
                          variant="outlined"
                        />
                      </Box>
                      <Box className="text-center py-8">
                        <NotificationsIcon className="text-gray-400 mb-2" fontSize="large" />
                        <Typography variant="body1" className="text-gray-500">
                          No recent activity to display
                        </Typography>
                        <Typography variant="body2" className="text-gray-400 mt-1">
                          New activities will appear here
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}

          {/* Default Onboarding Content */}
         {activeTab === 1 && (
            <Card className="shadow-md border border-gray-100">
              <CardContent className="p-6">
                <Box className="text-center py-8">
                  <GroupAddIcon className="text-gray-400 mb-2" fontSize="large" />
                  <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                    Onboarding Management
                  </Typography>
                  <Typography variant="body1" className="text-gray-500">
                    Select an onboarding option from the menu above to get started
                  </Typography>
                  <Paper variant="outlined" className="p-4 mt-4 max-w-md mx-auto">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={onboardingEnabled}
                          onChange={handleOnboardingToggle}
                          color="primary"
                          size="medium"
                        />
                      }
                      label={
                        <Box className="flex items-center gap-3">
                          <GroupAddIcon fontSize="medium" />
                          <Box>
                            <Typography variant="body1" className="font-semibold">
                              Employee Onboarding
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                              {onboardingEnabled 
                                ? 'Onboarding process is currently enabled' 
                                : 'Onboarding process is currently disabled'
                              }
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          )} 
        </>
      )}
    </div>
  );
};

export default Onboarding;