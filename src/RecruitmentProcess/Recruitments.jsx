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
import RecruitmentMail from './RecruitmentMail';
import RecruitmentForm from './RecruitmentForm';
import { CircleCheckBig, ScrollText, Signature } from 'lucide-react';
import Verification from './Verification';
import Salarystackup from './Salarystackup';
import CandidateApproval from './CandidateApproval';
import NoteForApprovals from './NoteForApprovals';
import OfferLetter from './OfferLetter';

const Recruitments = () => {
  const location = useLocation();
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [activeRecruitmentComponent, setActiveRecruitmentComponent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);

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

  const RecruitmentMenuItems = [
    { 
      label: 'Recruitment Mail', 
      component: 'recruitment-mail', 
      icon: GroupAddIcon,
    },
    { 
      label: 'Verification', 
      component: 'verification', 
      icon: AssignmentIcon,
    },
    { 
      label: 'Salary Stackup', 
      component: 'salary-stackup', 
      icon: ScrollText,
    },
    { 
      label: 'Candidate Approval', 
      component: 'candidate-approval', 
      icon: Signature,
    },
    { 
      label: 'Note For Approval', 
      component: 'note-approval', 
      icon: TrendingUpIcon,
    },

       { 
      label: 'Offer Letter', 
      component: 'offer-letter', 
      icon: CircleCheckBig,
    },

    {
      label: 'Form',
      component: 'form',
      icon:TrendingUpIcon
    }

  ];

  const handleMenuItemClick = (component) => {
    console.log('Clicked component:', component);
    setActiveRecruitmentComponent(component);
  };

  const handleOnboardingToggle = (event) => {
    setOnboardingEnabled(event.target.checked);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveRecruitmentComponent(null);
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

  const renderRecruitmentComponent = () => {
    console.log('Current component:', activeRecruitmentComponent);
    
    switch (activeRecruitmentComponent) {
      case 'recruitment-mail':
        return <RecruitmentMail />;
    

      case 'verification':
       return <Verification />

      case 'salary-stackup':
        
 return <Salarystackup/>

      case 'candidate-approval':
        return <CandidateApproval/>
        
      case 'note-approval':
        return <NoteForApprovals/>

        case 'offer-letter':
  return <OfferLetter/>

         
case 'form':
  // return <RecruitmentForm />



      default:
        return null;
    }
  };

  return (
    <div className="">
  
      <Paper elevation={1} className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-orange-500">
  
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
              label="Recruitment Process" 
              icon={<PeopleIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Submenu for Onboarding Tab */}
        {(activeTab === 0 || hoveredTab === 0) && (
          <Box className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Box className="flex flex-wrap gap-2">
              {RecruitmentMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeRecruitmentComponent === item.component;
                
                return (
                  <Button
                    key={item.component}
                    variant={isActive ? "contained" : "outlined"}
                    size="medium"
                    onClick={() => {
                      console.log('Button clicked:', item.component);
                      handleMenuItemClick(item.component);
                    }}
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
      {activeRecruitmentComponent ? (
        <Box>
          <Paper elevation={2} className="p-2">
            <Box className="flex justify-between items-center">
              {/* <Button 
                onClick={() => setActiveRecruitmentComponent(null)}
                variant="outlined"
                size="small"
              >
                Back to Dashboard
              </Button> */}
            </Box>
            {renderRecruitmentComponent()}
          </Paper>
        </Box>
      ) : (
        <>
    
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

          {/* Recent Activity */}
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
        </>
      )}
    </div>
  );
};

export default Recruitments;