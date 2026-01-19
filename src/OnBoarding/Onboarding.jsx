
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Typography
} from '@mui/material';

import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  GroupAdd as GroupAddIcon
} from '@mui/icons-material';

import JoiningReportList from './JoiningReportList';

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);

  const onboardingMenuItems = [
    {
      label: 'Joining Report',
      component: 'joining-report',
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

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setActiveComponent(null);
  };

  const renderOnboardingComponent = () => {
    switch (activeComponent) {
      case 'joining-report':
        return <JoiningReportList />;

      case 'onboarding-settings':
        return (
          <Paper className="p-6">
            <Typography variant="h6">Onboarding Settings</Typography>
            <Typography className="text-gray-500 mt-2">
              Settings configuration will be available here.
            </Typography>
          </Paper>
        );

      case 'onboarding-reports':
        return (
          <Paper className="p-6">
            <Typography variant="h6">Onboarding Reports</Typography>
            <Typography className="text-gray-500 mt-2">
              Reports and analytics will be available here.
            </Typography>
          </Paper>
        );

      default:
        return (
          <Paper className="p-8 text-center">
            <GroupAddIcon fontSize="large" className="text-gray-400 mb-2" />
            <Typography variant="h6">
              Employee Onboarding
            </Typography>
            <Typography className="text-gray-500 mt-1">
              Select an option above to continue
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <Paper elevation={1} className="mb-6 p-6 border-l-4 border-orange-500">
        <Typography variant="h5" className="font-semibold mb-4">
          Onboarding
        </Typography>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
            }
          }}
        >
          <Tab
            label="Onboarding"
            icon={<PeopleIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Sub Menu */}
        {activeTab === 0 && (
          <Box className="mt-4 flex gap-2 flex-wrap">
            {onboardingMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeComponent === item.component;

              return (
                <Button
                  key={item.component}
                  variant={isActive ? 'contained' : 'outlined'}
                  startIcon={<Icon />}
                  onClick={() => setActiveComponent(item.component)}
                  className={
                    isActive
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'hover:bg-orange-50'
                  }
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Content */}
      <Box>
        {renderOnboardingComponent()}
      </Box>
    </div>
  );
};

export default Onboarding;
