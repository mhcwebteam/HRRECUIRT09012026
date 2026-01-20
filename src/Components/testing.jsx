import React, { useState, useEffect, useContext, useMemo } from 'react';
import {API_BASE_URL} from '../Config/Config.jsx';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { ContextData } from '../Context/ContextData';
import VerificationDetailsModal from './VerificationDetailsModal';
import SalaryStackDetailsModal from './SalaryStackDetailsModal';
import { CirclePlus } from 'lucide-react';

const Salarystackup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const { personalData  } = useContext(ContextData);
  // Change from string to object to store offer CTC for each row
  const [offerCtcValues, setOfferCtcValues] = useState({});

  const [token,setToken]=useState(()=>{
    const userInfo=localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo):null;
  });
  
  // Initialize offerCtcValues from personalData when component mounts
  useEffect(() => {
    if (personalData && personalData.length > 0) {
      const initialOfferCtc = {};
      personalData.forEach((item, index) => {
        const rowId = item.id || `row-${index}`;
        initialOfferCtc[rowId] = item.offer_ctc || '';
      });
      setOfferCtcValues(initialOfferCtc);
    }
  }, [personalData]);

  const filteredData = useMemo(() => 
  {
    if (!personalData || personalData.length === 0) return [];
    let result = [...personalData];
    
    if (searchTerm) {
        result = result.filter(user =>
        (user.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    return result.map((item, index) => ({
      id: item.id || `row-${index}`,
      SNO: index + 1,
      verification_id: item.Verification_Id,
      CHILD_CASEID: item.child_caseid || 'N/A',
      PLANT: item.plant || 'N/A', 
      NAME: item.name || 'N/A',
      EMAIL: item.email || 'N/A',
      ADDRESS: item.address || 'N/A',
      PHONE_NUMBER: item.phone_number || 'N/A',
      DOB: item.dob || 'N/A',
      DEPT: item.DEPT || 'N/A',
      AADHAR_NUM: item.aadhar_number || 'N/A',
      PAN_NUM: item.pan_number || 'N/A',
      SSC_MARKS: item.ssc_marks || 'N/A',
      INTER_MARKS: item.inter_marks || 'N/A',
      BTECH_MARKS: item.btech_marks || 'N/A',
      PG_MARKS: item.pg_marks || 'N/A',
      CURRENT_CTC: item.current_ctc || 'N/A',
      EXP_CTC: item.expected_ctc || 'N/A',
      OFFER_CTC: item.offer_ctc || 'N/A',
      NOTICE_PERIOD: item.notice_period || 'N/A',
      PREVIOUS_COMPANY: item.previous_company || 'N/A',
      DURATION: item.duration || 'N/A',
      STATUS: item.status || 'pending',
      remarks: item.remarks || 'No remarks',
      submitted_date: item.created_at || 'N/A',
      documents: item.documents || {}
    }));
  }, [personalData, searchTerm, statusFilter]);

  const getStatusChip = (status) => 
  {
    const statusValue = status?.toLowerCase();
    const config = {
      verified: { color: '#10b981'  },
      pending:  { color: '#f59e0b'  },
      rejected: { color: '#ef4444'  },
      uploaded: { color: '#3b82f6'  },
      'not uploaded': { color: '#6b7280' }
    };
    const { color, icon } = config[statusValue] || config.pending;
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Box sx={{
          color: '#ffffff',
          backgroundColor: color,
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '10px',
          height: '25px',
          fontWeight: 600,
          textTransform: 'capitalize',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {icon}
          {statusValue?.charAt(0).toUpperCase() + statusValue?.slice(1) || 'Pending'}
        </Box>
      </Box>
    );
  };
  
  const handleSendEmail = async (row) => 
  {
    try {
      const response = await axios.post(`${API_BASE_URL}/cand-aprvl-email`,
        {
          case_id : row.CHILD_CASEID,
          email   : row.EMAIL,
          name    : row.NAME,
        },
        {
          headers:
          {
               "Accept":"application/json",
               Authorization:`Bearer ${token.token}`
          }
        }
      );
      console.log('CandApprovalMail',response);
      if (response.data.success) 
      {
        alert('Email sent successfully');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error(error);
      alert('Error while sending email');
    }
  };
  
  const handleViewDetails = (user) => {
    console.log('user',user)
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleStatusChange = (updateData) => {
    console.log('Status updated:', updateData);
  };

  // Handle Offer CTC change for specific row
  const handleOfferCtcChange = (rowId, value) => {
    setOfferCtcValues(prev => ({
      ...prev,
      [rowId]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const formatNumber = (value) => {
    if (!value || value === 'N/A') return 'N/A';
    return value.toString();
  };

  const columns = useMemo(() => [
    {
      field: 'SNO',
      headerName: 'S.NO',
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ fontWeight: 600, color: '#374151' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'CHILD_CASEID',
      headerName: 'Case ID',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ fontWeight: 500, color: '#1f2937' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'PLANT',
      headerName: 'Plant Name',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Box sx={{ color: '#374151' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'NAME',
      headerName: 'Name',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ fontWeight: 600, color: '#1f2937' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'EMAIL',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ color: '#374151', fontSize: '12px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'PHONE_NUMBER',
      headerName: 'Phone Number',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ color: '#374151', fontWeight: 500 }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'DEPT',
      headerName: 'Department',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ color: '#374151', fontWeight: 500 }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'CURRENT_CTC',
      headerName: 'Current CTC',
      width: 110,
      renderCell: (params) => {
        const formattedValue = params.value
          ? Number(params.value).toLocaleString('en-IN')
          : '0';
        return (
          <Box sx={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>
            ₹{formattedValue}
          </Box>
        );
      },
    },
    {
      field: 'EXP_CTC',
      headerName: 'Expected CTC',
      width: 120,
      renderCell: (params) => {
        const formattedValue = params.value
          ? Number(params.value).toLocaleString('en-IN')
          : '0';
        return (
          <Box sx={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>
            ₹{formattedValue}
          </Box>
        );
      },
    },
    {
      field: 'OFFER_CTC',
      headerName: 'Offer CTC',
      width: 120,
      renderCell: (params) => (
        <TextField
          size="small"
          type="number"
          placeholder="Enter CTC"
          value={offerCtcValues[params.row.id] || ''}
          onChange={(e) => handleOfferCtcChange(params.row.id, e.target.value)}
          onBlur={() => {
            console.log(`Offer CTC for ${params.row.NAME}:`, offerCtcValues[params.row.id]);
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
          inputProps={{
            min: 0,
            step: 1000,
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              fontSize: '12px',
              height: '35px',
              '& fieldset': {
                borderColor: '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
              },
              '& input': {
                textAlign: 'right',
              },
            },
          }}
        />
      ),
    },
    {
      field: 'STATUS',
      headerName: 'Overall Status',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'submitted_date',
      headerName: 'Submitted Date',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ color: '#6b7280', fontSize: '11px' }}>
          {formatDate(params.value)}
        </Box>
      ),
    },
    {
      field: 'create',
      headerName: 'Create',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Create">
          <IconButton
            size="small"
            onClick={() => handleViewDetails(params.row)}
            sx={{
              color: '#3b82f6',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
            }}
          >
            <CirclePlus fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'ACTIONS',
      headerName: 'Actions',
      flex: 1,
      minWidth: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => 
      {
        const isSubmitting = submitting[params.row.CASEID] || false;
        return (
          <Button
            variant="contained"
            size="small"
            onClick={()=>handleSendEmail(params.row)}
            disabled={isSubmitting}
            sx={{
              background: isSubmitting 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '10px',
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'capitalize',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
              minWidth: '90px',
              '&:hover': {
                background: isSubmitting 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: isSubmitting ? 'none' : 'translateY(-1px)',
                boxShadow: isSubmitting ? 'none' : '0 4px 10px rgba(16, 185, 129, 0.4)',
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
        );
      },
    },
  ], [offerCtcValues, submitting]);

  // Function to save all offer CTC values
  const handleSaveAllOfferCtc = async () => {
    try {
      const offersToSave = Object.entries(offerCtcValues).map(([id, value]) => ({
        id,
        offer_ctc: value
      }));
      
      console.log('Saving offer CTC values:', offersToSave);
      // Add your API call here to save the data
      // await axios.post(`${API_BASE_URL}/save-offer-ctc`, { offers: offersToSave });
      
      alert('Offer CTC values saved successfully!');
    } catch (error) {
      console.error('Error saving offer CTC:', error);
      alert('Failed to save offer CTC values');
    }
  };

  return (
    <Box sx={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "12px",
    }}>
      <Paper sx={{
        width: '100%',
        padding: 2,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
      }}>
        
        {/* Header with Save Button */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Salary Stackup
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleSaveAllOfferCtc}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 500,
              padding: '6px 16px',
              borderRadius: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }
            }}
          >
            Save All Offer CTC
          </Button>
        </Box>
        
        {/* Compact Search bar matching RecruitmentMail */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1, maxWidth: '400px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#667eea', fontSize: '20px' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  height: '38px',
                  fontSize: '13px',
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
          
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                height: '38px',
                fontSize: '13px',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#cedef2ff",
                },
                "&:hover fieldset": {
                  borderColor: "#d1d6ebff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
          
          <Typography variant="body2" sx={{
            color: '#64748b',
            minWidth: 'fit-content',
            fontWeight: 500,
            fontSize: '13px'
          }}>
            {filteredData.length} salary records
          </Typography>
        </Box>

        <Box sx={{
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #dfe5f1ff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            rowHeight={42}
            columnHeaderHeight={44}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #e2e8f0",
              },
              "& .MuiDataGrid-columnHeader": {
                fontWeight: 600,
                fontSize: "13px",
                color: "#1e293b",
                backgroundColor: "rgba(188, 198, 238, 0.5)",
                borderRight: "1px solid #e2e8f0",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f5f9",
                borderRight: "1px solid #f1f5f9",
                fontSize: "12px",
                color: "#374151",
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0f9ff",
                cursor: "pointer",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                minHeight: "48px",
              },
            }}
          />
        </Box>
      </Paper>
      
      <SalaryStackDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedUser}
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
};

export default Salarystackup;