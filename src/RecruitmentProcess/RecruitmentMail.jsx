



import React, { useState, useMemo, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Modal, IconButton, Typography, Button, CircularProgress, TextField, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'sweetalert2/dist/sweetalert2.min.css';
import SearchIcon from '@mui/icons-material/Search';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartPie } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, } from 'chart.js';
import DataFlow from "../Components/DataFlow.jsx"
import ManPowerView from '../ManpowerComponent/ManPowerView.jsx';
import { ArrowLeftIcon, BriefcaseIcon, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../Config/Config.jsx';
import { ContextData } from '../Context/ContextData.jsx';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const RecruitmentMail = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Separate state for filtered data
  const [manpowerOpen, setManPowerOpen] = useState(false);
  const [processCaseId, setProcessAndCaseIdData] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {})
  const [emailInputs, setEmailInputs] = useState({});
  const [submitting, setSubmitting] = useState({});

 const { HrData  } = useContext(ContextData);


  useEffect(() => {
    
    if (HrData && Array.isArray(HrData)) {
      
      
      const shortlistedData = HrData.filter(row => {
        const status = row.ACTION_STATUS?.toLowerCase() || 
                      row.STATUS?.toLowerCase() || 
                      row.CURRENT_STATUS?.toLowerCase();
        return status === 'shortlisted';
      });
      const rowsWithId = shortlistedData.map((row, index) => ({
        ...row,
        id: row.CHILD_CASEID || row.CASEID || `row_${index}`
      }));
      
      setData(rowsWithId);
      setFilteredData(rowsWithId);
      setLoading(false);
    } else {
      console.log("HrData is empty or not an array");
      setData([]);
      setFilteredData([]);
      setLoading(false);
    }
  }, [HrData]);




  useEffect(() => {
    if (!userToken.token) navigate('/');
  }, [navigate, userToken?.token]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    setPaginationModel(prev => ({ ...prev, page: 0 }));

    if (!searchValue) {
      setFilteredData(data);
      return;
    }

    console.log('row', row)
    console.log('row1',row.PLANT)

    const filtered = data.filter(row => {
      const search = searchValue.toLowerCase();
      return (
        (row.CASEID && row.CASEID.toLowerCase().includes(search)) ||
        (row.PROCESSNAME && row.PROCESSNAME.toLowerCase().includes(search)) ||
        (row.RAISER && row.RAISER.toLowerCase().includes(search)) ||
        (row.RAISER_DATE && row.RAISER_DATE.toLowerCase().includes(search)) ||
        (row.CURRENT_USER && row.CURRENT_USER.toLowerCase().includes(search)) ||
        (row.ACTION_STATUS && row.ACTION_STATUS.toLowerCase().includes(search)) ||
        (row.PLANT && row.PLANT.toLowerCase().includes(search)) ||
        (row.DEPT && row.DEPT.toLowerCase().includes(search)) ||
        (row.MANPOWER_DESG && row.MANPOWER_DESG.toLowerCase().includes(search))
      );
    });
    
    setFilteredData(filtered);
  };

  // Handle email input change
  const handleEmailChange = (caseId, email) => {
    setEmailInputs(prev => ({
      ...prev,
      [caseId]: email
    }));
  };

const handleSubmitEmail = async (caseId, rowData) => {

  const email = emailInputs[caseId];
  
  if (!email) {
    Swal.fire('Error', 'Please enter email', 'error');
    return;
  }

  setSubmitting(prev => ({ ...prev, [caseId]: true }));

  try {
    const response = await axios.post(
      `${API_BASE_URL}/send-onboarding-link`,
      {
        case_id: caseId,
        employee_email: email,
        employee_name: rowData.RAISER,
        designation: rowData.MANPOWER_DESG,
        department: rowData.DEPT,
        plant: rowData.PLANT,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data.success) {
      Swal.fire({
        title: 'Success!',
        text: 'Onboarding form link sent to employee email!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Clear email input
      setEmailInputs(prev => ({ ...prev, [caseId]: '' }));
    }
  } catch (error) {
    console.error('Email send error:', error);
    Swal.fire('Error', 'Failed to send email', 'error');
  } finally {
    setSubmitting(prev => ({ ...prev, [caseId]: false }));
  }
};


  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle manpower view open
  const handleOpenManpower = async (rowData, type) => {
    setSelectedRowData(rowData);
    setProcessAndCaseIdData({ 
      processname: rowData.PROCESSNAME, 
      caseId: rowData.CASEID, 
      type: type 
    });
    setManPowerOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setManPowerOpen(false);
    setSelectedRowData(null);
  };

  // Calculate counts based on actual data
  const statusCounts = useMemo(() => {
    const counts = {
      total: filteredData.length,
      completed: 0,
      pending: 0,
      rejected: 0
    };
    filteredData.forEach(row => {
      const status = row.ACTION_STATUS?.toLowerCase();
      if (status === 'completed') {
        counts.completed++;
      } else if (status === 'pending' || status === 'to_do') {
        counts.pending++;
      } else if (status === 'rejected') {
        counts.rejected++;
      }
    });
    return counts;
  }, [filteredData]);

  const donutData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [statusCounts.completed, statusCounts.pending],
      backgroundColor: ['#65a590ff', '#f0b248ff'],
      hoverBackgroundColor: ['#389477ff', '#cf8939ff'],
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  const donutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10 },
          padding: 10,
          color: '#374151',
        },
      },
      tooltip: {
        titleFont: { size: 11 },
        bodyFont: { size: 10 },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const stackedBarData = [
    { name: 'Data', completed: statusCounts.completed, pending: statusCounts.pending },
  ];

  const columns = [
    {
      field: 'SNO',
      headerName: 'S.NO',
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{
          fontWeight: 600,
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.api.getAllRowIds().indexOf(params.id) + 1}
        </Box>
      ),
    },
    {
      field: 'CASEID',
      headerName: 'Case ID',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          fontWeight: 500,
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'RAISER',
      headerName: 'Raiser',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'RAISER_DATE',
      headerName: 'Raiser Date',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value ? new Date(params.value).toLocaleDateString('en-GB') : ''}
        </Box>
      ),
    },
    {
      field: 'PLANT',
      headerName: 'Plant',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'DEPT',
      headerName: 'Department',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'MANPOWER_DESG',
      headerName: 'Designation',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Box sx={{
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            minWidth: '30px',
            textAlign: 'center',
          }}>
            {params.value || 'N/A'}
          </Box>
        </Box>
      ),
    },
    {
      field: 'ACTION_STATUS',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Box sx={{
            color: '#ffffff',
            backgroundColor: '#10b981',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {params.value || 'Shortlisted'}
          </Box>
        </Box>
      ),
    },
    {
      field: 'USER_EMAIL',
      headerName: 'User Email',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <TextField
          size="small"
          type="email"
          placeholder="Enter email address"
          value={emailInputs[params.row.CASEID] || ''}
          onChange={(e) => handleEmailChange(params.row.CASEID, e.target.value)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              fontSize: '12px',
              height: '35px',
              marginTop:'8px',
              '& fieldset': {
                borderColor: '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
              },
            },
          }}
        />
      ),
    },
    {
      field: 'ACTIONS',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isSubmitting = submitting[params.row.CASEID] || false;
        const email = emailInputs[params.row.CASEID] || '';
        
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSubmitEmail(params.row.CASEID, params.row)}
              disabled={isSubmitting || !email}
              sx={{
                background: isSubmitting 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '10px',
                padding: '4px 12px',
                borderRadius: '6px',
                textTransform: 'capitalize',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: isSubmitting 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: isSubmitting ? 'none' : 'translateY(-1px)',
                  boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)',
                },
                '&:disabled': {
                  background: '#9ca3af',
                  color: '#e5e7eb',
                }
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CircularProgress size={12} sx={{ color: 'white' }} />
                  Sending...
                </Box>
              ) : (
                'Send Email'
              )}
            </Button>
          </Box>
        );
      },
    },
  ];

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1200px',
    bgcolor: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 0,
    maxHeight: '80vh',
    overflow: 'hidden'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        border: "1px solid #d1d5db",
        background: "linear-gradient(to bottom right, #fce7f3, #f9fafb, #f3f4f6)",
      }}
    >
      <Paper sx={{
        width: '100%',
        padding: 3,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
      }}>
        {/* Enhanced Search bar */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1, maxWidth: '400px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search shortlisted candidates..."
              value={searchText}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                  }
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#cedef2ff",
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.08)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d1d6ebff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{
            color: '#64748b',
            minWidth: 'fit-content',
            fontWeight: 500
          }}>
            {filteredData.length} shortlisted candidates
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #dfe5f1ff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.id} // Use the id we created
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            rowHeight={50}
            columnHeaderHeight={50}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #e2e8f0",
              },
              "& .MuiDataGrid-columnHeader": {
                fontWeight: 600,
                fontSize: "14px",
                color: "#1e293b",
                backgroundColor: "rgba(188, 198, 238, 0.5)",
                borderRight: "1px solid #e2e8f0",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e2e8f0",
                borderRight: "1px solid #e2e8f0",
                fontSize: "13px",
                color: "#374151",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0f9ff",
                cursor: "pointer",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f0f7fa",
              },
            }}
          />
        </Box>
      </Paper>

      {/* Manpower Modal */}
      <Modal open={manpowerOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              fontSize: '16px',
              flex: 1,
              textAlign: 'center',
            }}>
              Case ID: {selectedRowData?.CASEID} | Process: {selectedRowData?.PROCESSNAME}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                ml: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{
            padding: '20px',
            maxHeight: 'calc(80vh - 80px)',
            overflowY: 'auto',
            backgroundColor: '#f8fafc',
          }}>
            {processCaseId.type === "view" ? (
              <DataFlow
                processname={processCaseId.processname ?? ""}
                caseId={processCaseId.caseId ?? ""}
                mode={processCaseId.type ?? ""}
              />
            ) : (
              <ManPowerView caseId={processCaseId.caseId ?? ""} />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default RecruitmentMail;