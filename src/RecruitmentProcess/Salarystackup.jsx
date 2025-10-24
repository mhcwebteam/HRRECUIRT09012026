import React, { useState, useEffect, useContext, useMemo } from 'react';
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

console.log("prersonalllllllllllllllllll", personalData);
  const filteredData = useMemo(() => {
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
      
      // Include documents for modal
      documents: item.documents || {}
    }));
  }, [personalData, searchTerm, statusFilter]);

  const getStatusChip = (status) => {
    const statusValue = status?.toLowerCase();
    const config = {
      verified: { color: '#10b981', icon: <CheckCircle className="w-4 h-4" /> },
      pending: { color: '#f59e0b', icon: <Refresh className="w-4 h-4" /> },
      rejected: { color: '#ef4444', icon: <Cancel className="w-4 h-4" /> },
      uploaded: { color: '#3b82f6', icon: <CheckCircle className="w-4 h-4" /> },
      'not uploaded': { color: '#6b7280', icon: <Cancel className="w-4 h-4" /> }
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
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
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


 const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

   const handleStatusChange = (updateData) => {
    console.log('Status updated:', updateData);
  
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
      width: 80,
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
          {params.value}
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
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 500
        }}>
          {params.value}
        </Box>
      ),
    },


    {
      field: 'PLANT',
      headerName: 'Plant Name',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 500
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'NAME',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{
          fontWeight: 600,
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
      field: 'EMAIL',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontSize: '13px'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'PHONE_NUMBER',
      headerName: 'Phone Number',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 500
        }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },
 {
      field: 'DEPT',
      headerName: 'Department',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 500
        }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },

    {
      field: 'CURRENT_CTC',
      headerName: 'Current CTC',
      width: 120,
      renderCell: (params) => {
    const formattedValue = params.value
      ? Number(params.value).toLocaleString('en-IN')
      : '0';

    return (
      <Box
        sx={{
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600,
        }}
      >
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
      <Box
        sx={{
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600,
        }}
      >
        ₹{formattedValue}
      </Box>
    );
  },
},

{
  field: 'OFFER_CTC',
  headerName: 'Offer CTC',
  width: 120,
  renderCell: (params) => {
    const formattedValue = params.value
      ? Number(params.value).toLocaleString('en-IN')
      : '0';
      
    return (
      <Box
        sx={{
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600,
        }}
      >
        ₹{formattedValue}
      </Box>
    );
  },
},

  

    {
      field: 'STATUS',
      headerName: 'Overall Status',
      width: 140,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'submitted_date',
      headerName: 'Submitted Date',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontSize: '12px'
        }}>
          {formatDate(params.value)}
        </Box>
      ),
    },
   {
       field: 'create',
       headerName: 'Create',
       width: 100,
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
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isSubmitting = submitting[params.row.CASEID] || false;
        // const email = emailInputs[params.row.CASEID] || '';
        
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Button
              variant="contained"
              size="small"
           
              sx={{
                background: isSubmitting 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #535756ff 0%, #121313ff 100%)',
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
  ], []);

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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#6b7280' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
            
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Box>
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