import React, { useState, useEffect, useContext, useMemo } from 'react';
//import OfferLetterModal from './OfferLetterModal.jsx'
import axios from "axios";
import Swal from 'sweetalert2';
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
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
  Download
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { ContextData } from '../Context/ContextData';
import {API_BASE_URL} from '../Config/Config.jsx';
import OfferLetterModal from './OfferLetterModal';

const OfferLetter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [joiningDates, setJoiningDates] = useState({});
  const [offerLetterOpen, setOfferLetterOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [ofrList,setOfferLetterData]=useState(null);
  const [Token,setToken]=useState(()=>{
    const authToken=JSON.parse(localStorage.getItem("userInfo"));
    return authToken?authToken:null;
  })
  
  const { personalData } = useContext(ContextData);
  const { HrData } = useContext(ContextData);

  const handleJoiningDateChange = (caseId, date) => {
    alert(date);
    alert(caseId);
    setJoiningDates(prev => ({
      ...prev,
      [caseId]: date
    }));
  };
  //----------------handleOfferLterEmail-----------------//
const handleOfferLterEmail=async(rowData)=>
{
  try
  {
    const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You want to Send this Mail",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Send",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",
      });
      if (!confirm.isConfirmed) return;
      const  payload =
      {
        "CHILD_CASEID":rowData.CHILD_CASEID,
        "EMail"       :rowData.EMAIL
      }
    const ofrMailSend = await axios.post(`${API_BASE_URL}/ofr-ltr-issue-mail`,payload,
      {
      headers:
      {
         "Content-Type" :"application/json",
         "Accept"       :"application/json",
         "Authorization":`Bearer ${Token.token}`
       }})
    if (ofrMailSend.data.success) 
      {
         await Swal.fire({
           title: "Success",
           text: "Mail Sent successfully",
           icon: "success",
         });
         resetForm();
       } else {
         await Swal.fire("Failed", response.data.message, "error");
       }
     } catch (error) {
       console.error(error);
       await Swal.fire(
         "Error",
         error.response?.data?.message || "Something went wrong",
         "error"
       );
     }
}
  //---------------Fetch the Offer Letter from Api--------------//
  const fetchOfrData = async()=>
    {
    try
    {
      const ofrdata = await axios.get(`${API_BASE_URL}/offer-issue-list`,
      {
        headers:
        {
            "Accept"       : "application/json",
            "Authorization": `Bearer ${Token.token}`,
        }
      })
      setOfferLetterData(ofrdata.data.evcVerifiedData);
    }
    catch(err)
    {
      console.error("Error In Fetching Offer List");
    }
  }
//useEffect Calling here ----
  useEffect(()=>
  {
    if(Token.token)
    {
      fetchOfrData();
    }
  },[]);

  //console.log("OFFFerList Data:::",ofrList);
  //---------------------View the Offer Letter from Backend--------------------//
  const handleViewOfferLetter = (user) => 
  {
    setOfferLetterOpen(true);
     setSelectedCandidate({
        ...user,
      });
  };


  const getStatusChip = (status) => {
    const statusValue = status?.toLowerCase();
    const config = {
      verified: { color: '#10b981', icon: <CheckCircle className="w-4 h-4" />  },
      pending:  { color: '#f59e0b', icon: <Refresh className="w-4 h-4"    />   },
      rejected: { color: '#ef4444', icon: <Cancel className="w-4 h-4"    />       },
      uploaded: { color: '#3b82f6', icon: <CheckCircle className="w-4 h-4" />  },
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
      field: 'ADDRESS',
      headerName: 'ADDRESS',
      flex: 1,
      minWidth: 120,
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
      field: 'DESIGNATION',
      headerName: 'Designation',
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
          <Box sx={{
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            fontWeight: 600,
          }}>
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
          <Box sx={{
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            fontWeight: 600,
          }}>
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
          <Box sx={{
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            fontWeight: 600,
          }}>
            ₹{formattedValue}
          </Box>
        );
      },
    },
    {
      field: 'HR',
      headerName: 'HR',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'DIRECTOR',
      headerName: 'DIRECTOR',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'EVC',
      headerName: 'EVC',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'STATUS',
      headerName: 'Overall Status',
      width: 140,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'Date of Joining',
      headerName: 'Date of Joining',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <TextField
          size="small"
          type="date"
          placeholder="Enter Date"
          value={joiningDates[params.row.CASEID] || ''}
          onChange={(e) => handleJoiningDateChange(params.row.CHILD_CASEID, e.target.value)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              fontSize: '12px',
              height: '35px',
              marginTop: '8px',
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
      field: 'View',
      headerName: 'View Offer',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Offer Letter">
          <IconButton
            size="small"
            onClick={() => handleViewOfferLetter(params.row)}
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
         field: 'actions',
         headerName: 'Actions',
         width: 80,
         sortable: false,
         renderCell: (params) => (
           <Tooltip title="View Details">
             <IconButton
               size="small"
               onClick={() => handleOfferLterEmail(params.row)}
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
       }
  ], [joiningDates]);
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
            rows={ofrList}
            columns={columns}
            paginationModel={paginationModel}
            getRowId={(row) => row.CHILD_CASEID}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            rowHeight={50}
            columnHeaderHeight={50}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": 
              {
                borderBottom: "2px solid #e2e8f0",
              },
              "& .MuiDataGrid-columnHeader": 
              {
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

      <OfferLetterModal
        open={offerLetterOpen}
        onClose={() => setOfferLetterOpen(false)}
        candidate={selectedCandidate}
      />
    </Box>
  );
};

export default OfferLetter;