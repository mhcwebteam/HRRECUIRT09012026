import  { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../Config/Config.jsx';
import CandidateApprovalFileModal from './CandidateApprovalFileModal.jsx';
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
import CandidateStackDetailsModal from './CandidateStackDetailsModal';

const CandidateApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const { personalData  } = useContext(ContextData);
  const [candidgetData,setCandidAprvlData]=useState([]);
  const [token ,userToken]=useState(()=>{
    const authToken=JSON.parse(localStorage.getItem("userInfo"));
    return authToken?authToken:null
  })
const [fileModalOpen, setFileModalOpen] = useState(false);
const [selectedFileUrl, setSelectedFileUrl] = useState(null);

// Get the Candidate Approval Data
console.log("candidgetData:::::",candidgetData);
const candidAprvlGetData = async () => {
  try {
    const candidData = await axios.get(
      `${API_BASE_URL}/get-cand-aprvl`,
      {
        headers: 
        {
          Accept: "application/json",
          Authorization: `Bearer ${token?.token}`,
        },
      }
    );
   const apiData = candidData?.data?.candidVerifiedData;
  // 🔥 normalize to array
  setCandidAprvlData(
    Array.isArray(apiData) ? apiData : [apiData]
  );
  } catch (err) {
    console.error(
      "Error In Getting Candid Approval Data:",
      err.response?.data || err.message
    );
  }
};
//------------------UseEffect----------------------//
useEffect(() => {
  //alert(123);
  if (token?.token) {
    candidAprvlGetData();
  }
}, [token]);
  const filteredData = useMemo(() => {
    if (!candidgetData || candidgetData?.length === 0) return [];
    // console.log("candidgetData",candidgetData);
   // let result = [...candidgetData];
    if (searchTerm) {
      result = candidgetData.filter(user =>
        (user.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }

    if (statusFilter !== 'all') {
      result = result.filter(user => user.CANDID_APPROVAL_STATUS === statusFilter);
    }
    return result.map((item, index) => (
    {
      SNO         : item.SNO || index + 1,
      CHILD_CASEID: item.CHILD_CASEID || 'N/A',
      PLANT       : item.PLANT || 'N/A',
      NAME        : item.NAME || 'N/A',
      EMAIL       : item.EMAIL || 'N/A',
      STATUS      : item.CANDID_APPROVAL_STATUS || 'pending',
      REMARKS     : item.CANDID_REMARKS || 'No remarks',
    }));
  }, [personalData, searchTerm, statusFilter]);

  console.log('Filtered Data....',filteredData);
  const getStatusChip = (status) => {
    const statusValue = status?.toLowerCase();
    const config = {
      verified:       { color: '#10b981', icon: <CheckCircle className="w-4 h-4" /> },
      pending:        { color: '#f59e0b', icon: <Refresh className="w-4 h-4" /> },
      rejected:       { color: '#ef4444', icon: <Cancel className="w-4 h-4" /> },
      uploaded:       { color: '#3b82f6', icon: <CheckCircle className="w-4 h-4" /> },
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

const handleViewDetails = (user) => 
{
  if (!user.cand_aprvl_file) 
  {
    alert("No file uploaded");
    return;
  }
  setSelectedFileUrl(user.cand_aprvl_file);
  setFileModalOpen(true);
 };
   const handleStatusChange = (updateData) => 
  {
    console.log('Status updated:', updateData);
  };
  const formatDate = (dateString) => 
  {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };
  const formatNumber = (value) => 
  {
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
      field: 'CHILD_CASEID',
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
      field: 'DEPT',
      headerName: 'Department',
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
      field: 'CANDID_APPROVAL_STATUS',
      headerName: 'Overall Status',
      width: 140,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'CANDID_REMARKS',
      headerName: 'Remarks',
      width: 140,
      renderCell: (params) => getStatusChip(params.value),
    },
   {
    field: 'View',
    headerName: 'View Details',
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
    {
      field: 'ACTIONS',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isSubmitting = submitting[params.row.CASEID] || false;  
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
              }}>
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
            rows={candidgetData}
            columns={columns}
            paginationModel={paginationModel}
            getRowId={(row) => row.CHILD_CASEID}
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
      <CandidateApprovalFileModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        fileUrl={selectedFileUrl}
      />

      
       <CandidateStackDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedUser}
        onStatusChange={handleStatusChange}
      />
      
    </Box>
  );
};

export default CandidateApproval;