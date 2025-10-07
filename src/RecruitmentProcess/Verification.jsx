// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Grid,
//   Button,
//   Chip,
//   Paper,
//   Divider,
//   Alert,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ArticleIcon from '@mui/icons-material/Article';
// import VerifiedIcon from '@mui/icons-material/Verified';
// import ChecklistIcon from '@mui/icons-material/Checklist';

// const Verification = () => {
//   const [currentStage, setCurrentStage] = useState(0);
//   const [candidateData, setCandidateData] = useState({
//     personalInfo: {
//       name: 'John Doe',
//       email: 'john.doe@email.com',
//       phone: '+1-234-567-8900'
//     },
//     appliedRole: 'Senior React Developer',
//     verificationStatus: 'completed',
//     interviewStages: [],
//     currentStatus: 'verified',
//     documents: {
//       resume: 'verified',
//       certificates: 'verified',
//       idProof: 'verified'
//     }
//   });

//   const recruitmentStages = [
//     {
//       stage: 'verified',
//       label: 'Profile Verified',
//       description: 'Candidate documents and background verified',
//       icon: <CheckCircleIcon />,
//       color: 'success'
//     },
//     {
//       stage: 'screening',
//       label: 'Initial Screening',
//       description: 'HR screening call scheduled',
//       icon: <PersonIcon />,
//       color: 'primary'
//     },
//     {
//       stage: 'technical',
//       label: 'Technical Interview',
//       description: 'Technical skills assessment',
//       icon: <WorkIcon />,
//       color: 'primary'
//     },
//     {
//       stage: 'manager',
//       label: 'Manager Interview',
//       description: 'Interview with hiring manager',
//       icon: <InterviewIcon />,
//       color: 'primary'
//     },
//     {
//       stage: 'hr',
//       label: 'HR Discussion',
//       description: 'Final HR and compensation discussion',
//       icon: <AssignmentIcon />,
//       color: 'primary'
//     },
//     {
//       stage: 'offer',
//       label: 'Offer Extended',
//       description: 'Job offer prepared and sent',
//       icon: <EmailIcon />,
//       color: 'warning'
//     },
//     {
//       stage: 'onboarding',
//       label: 'Onboarding',
//       description: 'Candidate onboarding process',
//       icon: <CelebrationIcon />,
//       color: 'success'
//     }
//   ];

//   const [interviewSchedule, setInterviewSchedule] = useState([
//     {
//       id: 1,
//       type: 'HR Screening',
//       scheduledDate: '2024-01-15T10:00',
//       interviewer: 'Sarah Wilson - HR Manager',
//       status: 'scheduled',
//       meetingLink: 'https://meet.google.com/abc-xyz-123'
//     },
//     {
//       id: 2,
//       type: 'Technical Interview',
//       scheduledDate: '2024-01-18T14:00',
//       interviewer: 'Mike Chen - Tech Lead',
//       status: 'pending',
//       meetingLink: ''
//     }
//   ]);

//   const [openScheduleDialog, setOpenScheduleDialog] = useState(false);

//   // Simulate stage progression
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (currentStage < recruitmentStages.length - 1) {
//         setCurrentStage(prev => prev + 1);
//       }
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [currentStage]);

//   const handleScheduleInterview = (interviewId) => {
  
//     console.log('Scheduling interview:', interviewId);
//     setOpenScheduleDialog(true);
//   };

//   const handleSendOffer = () => {

//     alert('Offer letter sent to candidate!');
//   };

//   const handleStartOnboarding = () => {

//     alert('Onboarding process initiated!');
//   };

//   const getStageStatus = (stageIndex) => {
//     if (stageIndex < currentStage) return 'completed';
//     if (stageIndex === currentStage) return 'current';
//     return 'pending';
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
//       {/* Header */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={8}>
//               <Typography variant="h4" gutterBottom>
//                 Recruitment Process
//               </Typography>
//               <Typography variant="h6" color="primary">
//                 Candidate: {candidateData.personalInfo.name}
//               </Typography>
//               <Typography variant="body1" color="text.secondary">
//                 Applied Role: {candidateData.appliedRole}
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 <Chip 
//                   label="Profile Verified" 
//                   color="success" 
//                   variant="filled"
//                   icon={<CheckCircleIcon />}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
//                 <Typography variant="h6">Verification Status</Typography>
//                 <Typography variant="h4" color="success.main">
//                   COMPLETED
//                 </Typography>
//               </Paper>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Recruitment Progress */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recruitment Progress
//           </Typography>
//           <Stepper alternativeLabel sx={{ mt: 3 }}>
//             {recruitmentStages.map((stage, index) => (
//               <Step key={stage.stage} completed={getStageStatus(index) === 'completed'}>
//                 <StepLabel 
//                   icon={stage.icon}
//                   error={getStageStatus(index) === 'current'}
//                 >
//                   <Typography variant="body2" fontWeight="bold">
//                     {stage.label}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {stage.description}
//                   </Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </CardContent>
//       </Card>

//       {/* Action Cards */}
//       <Grid container spacing={3}>
//         {/* Interview Schedule */}
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <ScheduleIcon /> Interview Schedule
//               </Typography>
              
//               <List>
//                 {interviewSchedule.map((interview) => (
//                   <ListItem key={interview.id} divider>
//                     <ListItemIcon>
//                       {interview.status === 'scheduled' ? (
//                         <CheckCircleIcon color="success" />
//                       ) : (
//                         <ScheduleIcon color="action" />
//                       )}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={interview.type}
//                       secondary={
//                         <Box>
//                           <Typography variant="body2">
//                             {new Date(interview.scheduledDate).toLocaleString()}
//                           </Typography>
//                           <Typography variant="body2">
//                             Interviewer: {interview.interviewer}
//                           </Typography>
//                           {interview.meetingLink && (
//                             <Button 
//                               size="small" 
//                               variant="outlined" 
//                               sx={{ mt: 1 }}
//                               onClick={() => window.open(interview.meetingLink, '_blank')}
//                             >
//                               Join Meeting
//                             </Button>
//                           )}
//                         </Box>
//                       }
//                     />
//                     <Button 
//                       variant="contained" 
//                       size="small"
//                       onClick={() => handleScheduleInterview(interview.id)}
//                     >
//                       {interview.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
//                     </Button>
//                   </ListItem>
//                 ))}
//               </List>

//               <Button 
//                 variant="outlined" 
//                 fullWidth 
//                 sx={{ mt: 2 }}
//                 onClick={() => setOpenScheduleDialog(true)}
//               >
//                 + Add Interview Round
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Next Steps */}
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Next Steps
//               </Typography>
              
//               {currentStage === 0 && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                   Candidate verification complete. Ready for initial screening.
//                 </Alert>
//               )}

//               {currentStage === 1 && (
//                 <Box>
//                   <Alert severity="warning" sx={{ mb: 2 }}>
//                     Schedule HR screening call with candidate.
//                   </Alert>
//                   <Button variant="contained" fullWidth>
//                     Schedule Screening Call
//                   </Button>
//                 </Box>
//               )}

//               {currentStage === 4 && (
//                 <Box>
//                   <Alert severity="success" sx={{ mb: 2 }}>
//                     All interview rounds completed. Ready for offer.
//                   </Alert>
//                   <Button 
//                     variant="contained" 
//                     fullWidth 
//                     color="success"
//                     onClick={handleSendOffer}
//                   >
//                     Prepare & Send Offer Letter
//                   </Button>
//                 </Box>
//               )}

//               {currentStage === 5 && (
//                 <Box>
//                   <Alert severity="info" sx={{ mb: 2 }}>
//                     Offer accepted by candidate. Ready for onboarding.
//                   </Alert>
//                   <Button 
//                     variant="contained" 
//                     fullWidth 
//                     color="primary"
//                     onClick={handleStartOnboarding}
//                   >
//                     Start Onboarding Process
//                   </Button>
//                 </Box>
//               )}

//               {/* Quick Actions */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography variant="subtitle2" gutterBottom>
//                   Quick Actions:
//                 </Typography>
//                 <Grid container spacing={1}>
//                   <Grid item xs={6}>
//                     <Button variant="outlined" size="small" fullWidth>
//                       Send Email
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button variant="outlined" size="small" fullWidth>
//                       Add Notes
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button variant="outlined" size="small" fullWidth>
//                       Download CV
//                     </Button>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Button variant="outlined" size="small" fullWidth>
//                       View Profile
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Candidate Evaluation */}
//       <Card sx={{ mt: 3 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Candidate Evaluation
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//               <Paper sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h4" color="primary">8.5/10</Typography>
//                 <Typography variant="body2">Technical Score</Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Paper sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h4" color="primary">9/10</Typography>
//                 <Typography variant="body2">Cultural Fit</Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Paper sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h4" color="primary">85%</Typography>
//                 <Typography variant="body2">Overall Match</Typography>
//               </Paper>
//             </Grid>
//           </Grid>

//           <Box sx={{ mt: 3 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Interviewer Feedback:
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               "Strong technical skills in React and Node.js. Good communication skills. 
//               Would be a great fit for the team."
//             </Typography>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Schedule Interview Dialog */}
//       <Dialog 
//         open={openScheduleDialog} 
//         onClose={() => setOpenScheduleDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Schedule Interview</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Schedule a new interview round for {candidateData.personalInfo.name}
//           </Typography>
//           {/* Add schedule form here */}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={() => setOpenScheduleDialog(false)}>
//             Schedule
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Verification;