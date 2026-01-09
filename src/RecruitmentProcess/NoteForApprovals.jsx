import React, { useState, useEffect, useContext, useMemo } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Paper,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem, Grid, Chip, Typography
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import {
  Search,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { ContextData } from "../Context/ContextData";
import CandidateStackDetailsModal from "./CandidateStackDetailsModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


/* ===================================================== */

const NoteForApprovals = () => {
  /* -------------------- STATE -------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [modalOpen,     setModalOpen     ] = useState(false);
  const [selectedUser,  setSelectedUser  ] = useState(null);
  const [noteAprvlData, setNoteAprvlData ] = useState([]);
  const [approveModalOpen ,setApproveModalOpen]=useState(false);
  const [approveRow,setApproveRow]=useState(null);
  const [approveOpen, setApproveOpen] = useState(false);


  const { personalData } = useContext(ContextData);

  const [token] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo ? userInfo : null;
  });
  /* ---------------------------------------API CALL -------------------------------------*/
  const noteFrAprvlData = async () => {
    try {
      const res = await axios.get(
        "http://172.20.0.9/laravel/myhomedashboardMRF/api/getNt-aprvl-data",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token?.token}`,
          },
        }
      );

      console.log("NOTE FOR APPROVAL API DATA:", res.data.VerifyData);
      setNoteAprvlData(res.data.VerifyData || []);
    } catch (err) {
      console.error("Error fetching approval data", err);
    }
  };

/*-----------------------------ApprovalS---------------------------------------------*/
const handleNtFrApprove = async (row) => {
  try {
    // 🔵 Before API call (Loading alert)
    Swal.fire({
      title: "Processing...",
      text: "Please wait while approving",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await axios.post(
      "http://172.20.0.9/laravel/myhomedashboardMRF/api/Note-For-AprvlUpdt",
      { caseId: row.CHILD_CASEID },
      {
        headers: 
        {
          Accept: "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      }
    );
    // 🟢 After success
    Swal.fire({
      icon: "success",
      title: "Approved Successfully",
      text: response.data?.message || "Note for approval updated successfully",
      confirmButtonColor: "#2563eb",
    });
    setApproveModalOpen(false);
    noteFrAprvlData();
  } catch (err) {
    console.error("Error In Update Note For Aprvl", err);
    // 🔴 On error
    Swal.fire({
      icon: "error",
      title: "Approval Failed",
      text: err.response?.data?.message || "Something went wrong. Please try again.",
      confirmButtonColor: "#dc2626",
    });
  }
};

/*-------------------------------ApprovalE--------------------------------------------------*/

  
  /* -------------------- USE EFFECT -------------------- */
  useEffect(() => 
  {
    if (token?.token) {
      noteFrAprvlData();
    }
  }, [token]);
/**------------------------SHIFING CURRENT POSITIONS------------------------------------ */
const assignApprover = async (row, role) => {
  try {
    const payload = {
      child_case_id: row.CHILD_CASEID,
      verification_id: row.id,
      approver_role: role,
    };
    console.log("Assign Approver Payload:", payload);
    await axios.post(
      "http://172.20.0.9/laravel/myhomedashboardMRF/api/assign-approver",
      payload,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.token}`,
        },
      }
    );
    alert(`${role} assigned successfully`);
    noteFrAprvlData(); // refresh list
  } catch (err) {
    console.error("Approver Assign Error", err);
    alert("Failed to assign approver");
  }
};

  /* -------------------- FILTERED DATA -------------------- */
  const filteredData = useMemo(() => {
    if (!Array.isArray(noteAprvlData)) return [];
    let result = [...noteAprvlData];
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.CHILD_CASEID?.includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter(
        (item) => item.status?.toLowerCase() === statusFilter
      );
    }
    return result.map((item, index) => ({
      id: item.verification_id, // REQUIRED BY DATAGRID
      SNO: index + 1,
      CHILD_CASEID: item.CHILD_CASEID,
      PLANT: item.PLANT,
      NAME: item.NAME,
      EMAIL: item.EMAIL,
      PHONE_NUMBER: item.PHONE_NUMBER,
      DEPT: item.DEPT,
      CURRENT_CTC: item.CURRENT_CTC,
      EXP_CTC: item.EXP_CTC,
      OFFER_CTC: item.OFFER_CTC,
      HR: item.HR,
      DIRECTOR: item.DIRECTOR,
      EVC: item.EVC,
      STATUS: item.status,
      SUBMITTED_DATE: item.created_at,
    }));
  }, [noteAprvlData, searchTerm, statusFilter]);

  /* -------------------- STATUS CHIP -------------------- */
  const getStatusChip = (status) => 
  {
    const statusValue = status?.toLowerCase();
    const config = {
      verified: { color: "#10b981", icon: <CheckCircle fontSize="small" /> },
      pending:  { color: "#f59e0b",  icon:  <Refresh fontSize="small" /> },
      rejected: { color: "#ef4444", icon: <Cancel fontSize="small" /> },
    };
    const { color, icon } = config[statusValue] || config.pending;
    return (
      <Box
        sx={{
          backgroundColor: color,
          color: "#fff",
          px: 1.5,
          py: 0.5,
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {icon}
        {statusValue || "pending"}
      </Box>
    );
  };

  /* ------------------------- COLUMNS -------------------- */
  const columns = [
    { field: "SNO", headerName: "S.NO", width: 80 },
    {
        field: "APPROVE_ACTION",
        headerName: "Approve",
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              setApproveRow(params.row);
              setApproveModalOpen(true);
            }}
          >
            Approve
          </Button>
        ),
      },
    { field: "CHILD_CASEID", headerName: "Case ID", minWidth: 160 },

    { field: "PLANT", headerName: "Plant", minWidth: 220 },

    { field: "NAME", headerName: "Candidate Name", minWidth: 180 },

    { field: "EMAIL", headerName: "Email", minWidth: 220 },

     { field: "HR", headerName: "HR", minWidth: 220 },

    { field: "DIRECTOR", headerName: "DIRECTOR", minWidth: 180 },

    { field: "EVC", headerName: "EVC", minWidth: 220 },

    { field: "PHONE_NUMBER", headerName: "Phone", minWidth: 140 },

    {
      field: "CURRENT_CTC",
      headerName: "Current CTC",
      width: 130,
      renderCell: (p) => `₹${p.value ?? 0}`,
    },

    {
      field: "EXP_CTC",
      headerName: "Expected CTC",
      width: 130,
      renderCell: (p) => `₹${p.value ?? 0}`,
    },

    {
      field: "OFFER_CTC",
      headerName: "Offer CTC",
      width: 130,
      renderCell: (p) => `₹${p.value ?? 0}`,
    },

    {
      field: "STATUS",
      headerName: "Overall Status",
      width: 150,
      renderCell: (p) => getStatusChip(p.value),
    },

    {
      field: "View",
      headerName: "View",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedUser(params.row);
              setModalOpen(true);
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
   {
  field: "APPROVER",
  headerName: "Send For Approval",
  width: 220,
  sortable: false,
  renderCell: (params) => (
    <TextField
      select
      size="small"
      fullWidth
      value={params.row.APPROVER ?? ""}
      onChange={(e) => assignApprover(params.row, e.target.value)}
      SelectProps={{
        displayEmpty: true,   // ✅ REQUIRED for placeholder
      }}
    >
      {/* ✅ PLACEHOLDER */}
      <MenuItem value="" disabled>
        <em>Select Approver</em>
      </MenuItem>

      <MenuItem value="HOD">HR / HOD</MenuItem>
      <MenuItem value="DIRECTOR">Director</MenuItem>
      <MenuItem value="EVC">EVC</MenuItem>
    </TextField>
  ),
}

  ];

  /* -------------------- JSX -------------------- */
  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={filteredData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          autoHeight
        />
      </Paper>

      {/**--------------------------------------------ApprovalModal Here --------------------------------------**/}
      <Dialog
  open={approveModalOpen}
  onClose={() => setApproveModalOpen(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
    }
  }}
>
  <DialogTitle sx={{ pb: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 28 }} />
      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
        Approve Candidate
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent dividers sx={{ py: 3 }}>
    {/* Candidate Information Card */}
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 1.5,
        p: 2,
        mb: 3,
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Case ID
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
            {approveRow?.CHILD_CASEID}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Candidate Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
            {approveRow?.NAME}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Current Status
          </Typography>
          <Chip
            label={approveRow?.STATUS}
            size="small"
            sx={{
              mt: 0.5,
              fontWeight: 500,
              bgcolor: 'info.lighter',
              color: 'info.dark'
            }}
          />
        </Grid>
      </Grid>
    </Box>

    {/* Remarks Input */}
    <TextField
      label="Approval Remarks"
      placeholder="Enter your approval comments or notes..."
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'success.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'success.main',
          }
        }
      }}
    />

    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
      * These remarks will be recorded with the approval
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
    <Button
      onClick={() => setApproveModalOpen(false)}
      variant="outlined"
      color="inherit"
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        borderColor: 'grey.300',
        '&:hover': {
          borderColor: 'grey.400',
          bgcolor: 'grey.50'
        }
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      color="success"
      onClick={() => handleNtFrApprove(approveRow)}
      startIcon={<CheckIcon />}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      Confirm Approval
    </Button>
  </DialogActions>
</Dialog>
     {/**-----------------------------------------------End ApprovalModal Here --------------------------------------------------**/}
      <CandidateStackDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedUser}
      />
    </Box>
  );
};

export default NoteForApprovals;
