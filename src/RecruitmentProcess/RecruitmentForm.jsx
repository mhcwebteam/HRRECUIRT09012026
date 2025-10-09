import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Person,
  Email,
  Phone,
  Home,
  School,
  Work,
  AttachFile,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Send,
} from '@mui/icons-material';

function RecruitmentForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: '',
    tenthCertificate: null,
    interCertificate: null,
    btechCertificate: null,
    resume: null,
    previousCompany: '',
    designation: '',
    experienceYears: '',
    experienceMonths: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
    payslip1: null,
    payslip2: null,
    payslip3: null,
    experienceLetter: null,
    relievingLetter: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    tenthCertificate: null,
    interCertificate: null,
    btechCertificate: null,
    resume: null,
    payslip1: null,
    payslip2: null,
    payslip3: null,
    experienceLetter: null,
    relievingLetter: null,
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const steps = activeTab === 0
    ? ['Personal Details', 'Education & Documents']
    : ['Personal Details', 'Education & Documents', 'Professional Experience'];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveStep(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
        return;
      }
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleFileRemove = (fieldName) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (activeStep === 1) {
      if (!uploadedFiles.tenthCertificate) newErrors.tenthCertificate = '10th certificate is required';
      if (!uploadedFiles.interCertificate) newErrors.interCertificate = '12th certificate is required';
      if (!uploadedFiles.btechCertificate) newErrors.btechCertificate = 'B.Tech certificate is required';
      if (!uploadedFiles.resume) newErrors.resume = 'Resume is required';
    } else if (activeStep === 2 && activeTab === 1) {
      if (!formData.previousCompany) newErrors.previousCompany = 'Previous company is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
      if (!formData.experienceYears) newErrors.experienceYears = 'Experience years is required';
      if (!formData.currentCTC) newErrors.currentCTC = 'Current CTC is required';
      if (!formData.expectedCTC) newErrors.expectedCTC = 'Expected CTC is required';
      if (!formData.noticePeriod) newErrors.noticePeriod = 'Notice period is required';
      if (!uploadedFiles.payslip1) newErrors.payslip1 = 'Payslip 1 is required';
      if (!uploadedFiles.payslip2) newErrors.payslip2 = 'Payslip 2 is required';
      if (!uploadedFiles.payslip3) newErrors.payslip3 = 'Payslip 3 is required';
      if (!uploadedFiles.experienceLetter) newErrors.experienceLetter = 'Experience letter is required';
      if (!uploadedFiles.relievingLetter) newErrors.relievingLetter = 'Relieving letter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form Data:', formData);
      console.log('Candidate Type:', activeTab === 0 ? 'Fresher' : 'Experienced');
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const calculateProgress = () => {
    return ((activeStep + 1) / steps.length) * 100;
  };

  const FileUploadField = ({ label, fieldName, icon: Icon, required = false }) => (
    <Card variant="outlined" sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Typography variant="subtitle2" className="mb-3 font-semibold flex items-center gap-2 text-gray-700">
          {Icon && <Icon fontSize="small" color="primary" />}
          {label}
          {required && <Chip label="Required" size="small" color="error" sx={{ height: 20 }} />}
        </Typography>
        <Box className="flex flex-col gap-2">
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
            sx={{
              py: 1.5,
              borderStyle: 'dashed',
              '&:hover': { borderStyle: 'solid' }
            }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(fieldName, e)}
            />
          </Button>
          {uploadedFiles[fieldName] && (
            <Box className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle fontSize="small" className="text-green-600" />
              <Typography variant="body2" className="truncate flex-1 text-green-700">
                {uploadedFiles[fieldName].name}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleFileRemove(fieldName)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
          {errors[fieldName] && (
            <Typography variant="caption" color="error">
              {errors[fieldName]}
            </Typography>
          )}
          <Typography variant="caption" className="text-gray-500">
            PDF, JPG, PNG (Max 5MB)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <>
          <Typography variant="h6" className="mb-4 flex items-center gap-2 text-gray-800">
            <Person className="text-blue-600" /> Personal Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <Email className="mr-2 text-gray-400" fontSize="small" />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: <Phone className="mr-2 text-gray-400" fontSize="small" />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: <Home className="mr-2 text-gray-400 self-start mt-3" fontSize="small" />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
                {errors.gender && (
                  <Typography variant="caption" color="error">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </>
      );
    } else if (activeStep === 1) {
      return (
        <>
          <Typography variant="h6" className="mb-4 flex items-center gap-2 text-gray-800">
            <School className="text-blue-600" /> Educational Documents
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FileUploadField
                label="10th Certificate"
                fieldName="tenthCertificate"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadField
                label="12th/Inter Certificate"
                fieldName="interCertificate"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadField
                label="B.Tech Certificate"
                fieldName="btechCertificate"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadField
                label="Resume/CV"
                fieldName="resume"
                icon={AttachFile}
                required
              />
            </Grid>
          </Grid>
        </>
      );
    } else if (activeStep === 2 && activeTab === 1) {
      return (
        <>
          <Typography variant="h6" className="mb-4 flex items-center gap-2 text-gray-800">
            <Work className="text-blue-600" /> Professional Experience
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Previous Company"
                name="previousCompany"
                value={formData.previousCompany}
                onChange={handleInputChange}
                error={!!errors.previousCompany}
                helperText={errors.previousCompany}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                error={!!errors.designation}
                helperText={errors.designation}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Experience (Years)"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                error={!!errors.experienceYears}
                helperText={errors.experienceYears}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Experience (Months)"
                name="experienceMonths"
                value={formData.experienceMonths}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Current CTC (LPA)"
                name="currentCTC"
                value={formData.currentCTC}
                onChange={handleInputChange}
                error={!!errors.currentCTC}
                helperText={errors.currentCTC}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Expected CTC (LPA)"
                name="expectedCTC"
                value={formData.expectedCTC}
                onChange={handleInputChange}
                error={!!errors.expectedCTC}
                helperText={errors.expectedCTC}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.noticePeriod}>
                <InputLabel>Notice Period</InputLabel>
                <Select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  label="Notice Period"
                >
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="15days">15 Days</MenuItem>
                  <MenuItem value="1month">1 Month</MenuItem>
                  <MenuItem value="2months">2 Months</MenuItem>
                  <MenuItem value="3months">3 Months</MenuItem>
                </Select>
                {errors.noticePeriod && (
                  <Typography variant="caption" color="error">
                    {errors.noticePeriod}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Divider className="my-6" />

          <Typography variant="h6" className="mb-4 flex items-center gap-2 text-gray-800">
            <AttachFile className="text-blue-600" /> Experience Documents
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FileUploadField
                label="Payslip 1 (Recent)"
                fieldName="payslip1"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FileUploadField
                label="Payslip 2"
                fieldName="payslip2"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FileUploadField
                label="Payslip 3"
                fieldName="payslip3"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FileUploadField
                label="Experience Letter"
                fieldName="experienceLetter"
                icon={AttachFile}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FileUploadField
                label="Relieving Letter"
                fieldName="relievingLetter"
                icon={AttachFile}
                required
              />
            </Grid>
          </Grid>
        </>
      );
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8">
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <Box className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-8">
            <Typography variant="h3" component="h1" className="font-bold mb-2">
              Join Our Team
            </Typography>
            <Typography variant="body1" className="opacity-90">
              We're excited to learn more about you. Please complete the application form below.
            </Typography>
          </Box>

          <Box className="border-b bg-white">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 2.5,
                },
              }}
            >
              <Tab label="Fresher Application" />
              <Tab label="Experienced Professional" />
            </Tabs>
          </Box>

          <Box className="p-6 md:p-8 bg-white">
            <Box className="mb-6">
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  }
                }}
              />
              <Typography variant="caption" className="text-gray-500 mt-2 block text-right">
                Step {activeStep + 1} of {steps.length} - {Math.round(calculateProgress())}% Complete
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {submitStatus === 'success' && (
              <Alert
                severity="success"
                className="mb-6"
                icon={<CheckCircle />}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  Application Submitted Successfully!
                </Typography>
                <Typography variant="body2">
                  Thank you for applying. We'll review your application and get back to you soon.
                </Typography>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box className="mb-8">
                {renderStepContent()}
              </Box>

              <Divider className="my-6" />

              <Box className="flex gap-3 justify-between">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                  sx={{ minWidth: 120 }}
                >
                  Back
                </Button>

                <Box className="flex gap-3">
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      endIcon={<Send />}
                      sx={{
                        minWidth: 200,
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                        }
                      }}
                    >
                      Submit Application
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        minWidth: 120,
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RecruitmentForm;
