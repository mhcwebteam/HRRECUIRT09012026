import React ,{useState,useEffect} from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import {API_BASE_URL} from '../Config/Config.jsx';

const JoiningReportList = () => {
    const [joiningData, setJoiningData] = useState([]);
    const [Token,useToken]=useState(()=>{
        const userToken=JSON.parse(localStorage.getItem('userInfo'));
        return userToken?userToken:null;
    })
//----------------------------JoiningDataStart------------------------//
const joinData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/verify-getData`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${Token.token}`,
        },
      }
    );
   const apiData = response.data.data;
   console.log("API DATA:", apiData);
   const formattedRows = apiData
  // ✅ FILTER FIRST
  .filter(item => item.joiningDate && item.joiningDate !== '')
  // ✅ THEN MAP
  .map((item, index) => ({
    id            : item.verification_id || index,
    CHILD_CASEID  :item.CHILD_CASEID,
    employee_name : item.NAME,
    email         : item.EMAIL,
    phone         : item.PHONE_NUMBER,
    department    : item.DEPT,
    location      : item.PLANT,
    joining_date  : item.joiningDate,
    current_ctc   : item.CURRENT_CTC,
    expected_ctc  : item.EXP_CTC,
    offered_ctc   : item.OFFER_CTC ?? 'Pending',
    joining_status: 'Joined', // always joined because filtered
    offer_letter  : item.OfferLetterFlag ?? 'Pending',
    bgv_status: item.verification_status ?? 'Pending',
    documents_status:item.overallDocments_aprvl === '1' ? 'Complete' : 'Pending',
    current_stage: item.CURRENT_TASK,
    hr_owner: item.CURRENT_USER,
    created_at: item.created_at,
  }));
    console.log("formattedRows:", formattedRows);
    setJoiningData(formattedRows);
  } catch (error) {
    console.error("Error in fetching joining data", error);
  }
};

//----------------------------JoiningDataEnd---------------------------//



//------------------------------useEffect------------------------------//
useEffect(()=>{
    if(Token.token){
        joinData();
    }
},[Token.token]);

  const columns = [
  { field: 'CHILD_CASEID',  headerName: 'CHILD_CASEID', width: 200   },
  { field: 'employee_name', headerName: 'Employee Name', width: 200 },
  { field: 'email',         headerName: 'Email', width: 220 },
  { field: 'phone',         headerName: 'Phone', width: 140 },
  { field: 'department',    headerName: 'Department', width: 160 },
  { field: 'location',      headerName: 'Location', width: 220 },
  { field: 'joining_date',  headerName: 'Joining Date', width: 150 },
  {
    field: 'joining_status',
    headerName: 'Joining Status',
    width: 150,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={params.value === 'Joined' ? 'success' : 'error'}
      />
    ),
  },
  { field: 'current_ctc', headerName: 'Current CTC', width: 120 },
  { field: 'expected_ctc', headerName: 'Expected CTC', width: 120 },
  { field: 'offered_ctc', headerName: 'Offered CTC', width: 120 },
  {
    field: 'offer_letter',
    headerName: 'Offer Letter',
    width: 140,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={params.value === 'Sent' ? 'success' : 'warning'}
      />
    ),
  },
  {
    field: 'bgv_status',
    headerName: 'BGV Status',
    width: 140,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={
          params.value === 'Approved'
            ? 'success'
            : params.value === 'Pending'
            ? 'warning'
            : 'default'
        }
      />
    ),
  },
  {
    field: 'documents_status',
    headerName: 'Docs Status',
    width: 140,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={params.value === 'Complete' ? 'success' : 'warning'}
      />
    ),
  },
  { field: 'current_stage', headerName: 'Current Stage', width: 160 },
  { field: 'hr_owner', headerName: 'HR Owner', width: 160 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 160,
    sortable: false,
    renderCell: () => (
      <Box className="flex gap-2">
        <Button size="small" variant="outlined" startIcon={<VisibilityIcon />}>
          View
        </Button>
        <Button size="small" variant="contained" startIcon={<EditIcon />}>
          Edit
        </Button>
      </Box>
    ),
  },
];
  return (
    <Paper elevation={2} className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-semibold text-gray-800">
          Joining Report
        </Typography>
        <Button variant="contained" color="primary">
          + Add Joining
        </Button>
      </Box>
      <Box sx={{ height: 520, width: '100%' }}>
       <DataGrid
            rows={joiningData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            />
      </Box>
    </Paper>
  );
};
export default JoiningReportList;
