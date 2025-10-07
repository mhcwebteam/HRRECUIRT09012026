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
} from '@mui/icons-material';

function RecruitmentForm() {
  const [activeTab, setActiveTab] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };







  const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Candidate Type:', activeTab === 0 ? 'Fresher' : 'Experienced');
    setSubmitStatus('success');
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const FileUploadField = ({ label, fieldName, icon: Icon }) => (
    <Box className="mb-4">
      <Typography variant="body2" className="mb-2 font-medium flex items-center gap-2">
        {Icon && <Icon fontSize="small" />}
        {label}
      </Typography>
      <Box className="flex items-center gap-2">
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          className="normal-case"
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
          <Box className="flex items-center gap-2 flex-1">
            <Typography variant="body2" className="truncate">
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
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" className="py-8">
      <Paper elevation={3} className="overflow-hidden">
        <Box className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <Typography variant="h4" component="h1" className="font-bold">
            Recruitment Application Form
          </Typography>
          <Typography variant="body2" className="mt-2 opacity-90">
            Please fill in all the required details to complete your application
          </Typography>
        </Box>

        <Box className="border-b">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Fresher" className="font-semibold" />
            <Tab label="Experienced" className="font-semibold" />
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box className="p-6">
            {submitStatus === 'success' && (
              <Alert severity="success" className="mb-4">
                Application submitted successfully!
              </Alert>
            )}

            <Typography variant="h6" className="mb-4 flex items-center gap-2">
              <Person /> Personal Information
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
                  InputProps={{
                    startAdornment: <Email className="mr-2 text-gray-400" />,
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
                  InputProps={{
                    startAdornment: <Phone className="mr-2 text-gray-400" />,
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
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <Home className="mr-2 text-gray-400 self-start mt-3" />,
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
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
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
                </FormControl>
              </Grid>
            </Grid>

            <Divider className="my-6" />

            <Typography variant="h6" className="mb-4 flex items-center gap-2">
              <School /> Educational Documents
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FileUploadField
                  label="10th Certificate *"
                  fieldName="tenthCertificate"
                  icon={AttachFile}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FileUploadField
                  label="12th/Inter Certificate *"
                  fieldName="interCertificate"
                  icon={AttachFile}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FileUploadField
                  label="B.Tech Certificate *"
                  fieldName="btechCertificate"
                  icon={AttachFile}
                />
              </Grid>

              <Grid item xs={12}>
                <FileUploadField
                  label="Resume/CV *"
                  fieldName="resume"
                  icon={AttachFile}
                />
              </Grid>
            </Grid>

            {activeTab === 1 && (
              <>
                <Divider className="my-6" />

                <Typography variant="h6" className="mb-4 flex items-center gap-2">
                  <Work /> Professional Experience
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
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
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider className="my-6" />

                <Typography variant="h6" className="mb-4 flex items-center gap-2">
                  <AttachFile /> Experience Documents
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FileUploadField
                      label="Last 3 Months Payslip 1 *"
                      fieldName="payslip1"
                      icon={AttachFile}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FileUploadField
                      label="Last 3 Months Payslip 2 *"
                      fieldName="payslip2"
                      icon={AttachFile}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FileUploadField
                      label="Last 3 Months Payslip 3 *"
                      fieldName="payslip3"
                      icon={AttachFile}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUploadField
                      label="Experience Letter *"
                      fieldName="experienceLetter"
                      icon={AttachFile}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FileUploadField
                      label="Relieving Letter *"
                      fieldName="relievingLetter"
                      icon={AttachFile}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <Divider className="my-6" />

            <Box className="flex gap-3 justify-end">
              <Button variant="outlined" size="large" type="reset">
                Reset
              </Button>
              <Button
                variant="contained"
                size="large"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 normal-case px-8"
              >
                Submit Application
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default RecruitmentForm;
