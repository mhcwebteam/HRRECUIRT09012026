import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem
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

const Verification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
  const { personalData,  } = useContext(ContextData);
   const { HrData  } = useContext(ContextData);

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
      id: item.id || item.SNO || `row-${index}`,
      SNO: item.SNO || index + 1,
      CASEID: item.caseId || item.CASEID || 'N/A',
      NAME: item.name || item.NAME || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A',
      EMAIL: item.email || item.EMAIL || 'N/A',
      ADDRESS: item.address || item.ADDRESS || 'N/A',
      PHONE_NUMBER: item.phoneNumber || item.phone || item.PHONE_NUMBER || 'N/A',
      DOB: item.dob || item.DOB || item.dateOfBirth || 'N/A',
      AADHAR_NUM: item.AADHAR_NUM || 'N/A',
      PAN_NUM: item.PAN_NUM || 'N/A',
      SSC_SCORE: item.SSC_SCORE || 'N/A',
      INTER_SCORE: item.INTER_SCORE || 'N/A',
      BTECH_SCORE: item.BTECH_SCORE || 'N/A',
      POST_GRADUCTION: item.POST_GRADUCTION || 'N/A',
      CURRENT_CTC: item.CURRENT_CTC || 'N/A',
      EXP_CTC: item.EXP_CTC || 'N/A',
      NOTICE_PERIOD: item.NOTICE_PERIOD || 'N/A',
      PREVIOUS_COMPANY: item.PREVIOUS_COMPANY || 'N/A',
      DURATION: item.DURATION || 'N/A',

      STATUS: item.status || item.STATUS || 'pending',
      remarks: item.remarks || 'No remarks',
      submitted_date: item.submitted_date || item.created_at || 'N/A'
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
      field: 'DOB',
      headerName: 'Date of Birth',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {formatDate(params.value)}
        </Box>
      ),
    },
    {
      field: 'AADHAR_NUM',
      headerName: 'Aadhar Number',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontFamily: 'monospace'
        }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'PAN_NUM',
      headerName: 'PAN Number',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontFamily: 'monospace'
        }}>
          {formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'SSC_SCORE',
      headerName: 'SSC Score',
      width: 100,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600
        }}>
          {params.value}%
        </Box>
      ),
    },
    {
      field: 'INTER_SCORE',
      headerName: 'Inter Score',
      width: 100,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600
        }}>
          {params.value}%
        </Box>
      ),
    },
    {
      field: 'BTECH_SCORE',
      headerName: 'BTech Score',
      width: 100,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600
        }}>
          {params.value}%
        </Box>
      ),
    },
    {
      field: 'POST_GRADUCTION',
      headerName: 'Post Graduation',
      width: 130,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value}%
        </Box>
      ),
    },
    {
      field: 'CURRENT_CTC',
      headerName: 'Current CTC',
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600
        }}>
          ₹{formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'EXP_CTC',
      headerName: 'Expected CTC',
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: 600
        }}>
          ₹{formatNumber(params.value)}
        </Box>
      ),
    },
    {
      field: 'NOTICE_PERIOD',
      headerName: 'Notice Period',
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value} days
        </Box>
      ),
    },
    {
      field: 'PREVIOUS_COMPANY',
      headerName: 'Current Company',
      flex: 1,
      minWidth: 150,
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
      field: 'DURATION',
      headerName: 'Duration',
      width: 100,
      renderCell: (params) => (
        <Box sx={{
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          {params.value} months
        </Box>
      ),
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
       field: 'actions',
       headerName: 'Actions',
       width: 100,
       sortable: false,
       renderCell: (params) => (
         <Tooltip title="View Details">
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
             <Visibility fontSize="small" />
           </IconButton>
         </Tooltip>
       ),
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
       <VerificationDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedUser}
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
};

export default Verification;