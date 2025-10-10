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
import VerificationDetailsModal from './VerificationDetailsModal';
import SalaryStackDetailsModal from './SalaryStackDetailsModal';
import { CirclePlus, View } from 'lucide-react';
import CandidateStackDetailsModal from './CandidateStackDetailsModal';
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
  
  const { personalData } = useContext(ContextData);
  const { HrData } = useContext(ContextData);

  const handleJoiningDateChange = (caseId, date) => {
    setJoiningDates(prev => ({
      ...prev,
      [caseId]: date
    }));
  };

  const handleViewOfferLetter = (user) => {
    const joiningDate = joiningDates[user.CASEID];
    if (joiningDate) {
      setSelectedCandidate({
        ...user,
        joiningDate: joiningDate
      });
      setOfferLetterOpen(true);
    } else {
      alert('Please enter Date of Joining first');
    }
  };

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
      OFFER_CTC: item.OFFER_CTC || 'N/A',
      NOTICE_PERIOD: item.NOTICE_PERIOD || 'N/A',
      PREVIOUS_COMPANY: item.PREVIOUS_COMPANY || 'N/A',
      DURATION: item.DURATION || 'N/A',
      PLANT: item.PLANT || 'Head Office',
      DESIGNATION: item.DESIGNATION || 'Developers - IT SAP',
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
          onChange={(e) => handleJoiningDateChange(params.row.CASEID, e.target.value)}
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
  ], [joiningDates]);

  const OfferLetterPopup = ({ open, onClose, candidate }) => {
    if (!candidate) return null;

    const handleDownloadPDF = () => {
      window.print();
    };

    const formatIndianDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      
      const getOrdinal = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };

      return `${day}${getOrdinal(day)} ${month} ${year}`;
    };

    const getAcceptanceDeadline = (joiningDate) => {
      const date = new Date(joiningDate);
      date.setDate(date.getDate() - 1);
      return formatIndianDate(date);
    };

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }} id="offer-letter-content">
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #e5e7eb', pb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                Tellapur Technology Private Limited
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                (An Initiative by My Home Group & Prathima)
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                Regd. Office: #1-123, 8° Floor, 3° Block, My Home Hub, Hi-tech City, Madhapur, Hyderabad - 500 081, Telangana, India.
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                CIN: U45400TG2007PTC053720 | Email ID: info@ttplhyd.com | Web: www.ttplhyd.com | Ph: 040-6639 8686
              </Typography>
            </Box>

            {/* Reference and Date */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Ref No: TTPL/HR/F8/August - 01/2025-2026
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                {formatIndianDate(new Date())}
              </Typography>
            </Box>

            {/* Candidate Address */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {candidate.NAME}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151', whiteSpace: 'pre-line' }}>
                {candidate.ADDRESS}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Phone No: {candidate.PHONE_NUMBER}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                E-mail: {candidate.EMAIL}
              </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 3 }} />

            {/* Offer Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                textAlign: 'center', 
                mb: 3,
                color: '#1f2937'
              }}
            >
              Offer of Employment
            </Typography>

            {/* Salutation */}
            <Typography variant="body1" sx={{ mb: 2 }}>
              Dear <strong>Mr. {candidate.NAME},</strong>
            </Typography>

            {/* Main Content */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              This has reference to your application and subsequent interview you had with us, we are pleased to inform you that you have been selected for the position of <strong>"{candidate.DESIGNATION}"</strong> at our <strong>{candidate.PLANT}</strong>. Your CTC is as mutually agreed during final interview. Your appointment will be applicable subject to joining the duties on <strong>{formatIndianDate(candidate.joiningDate)}</strong>.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              Detailed appointment letter mentioning other terms and conditions of your employment will be issued upon joining with us.
            </Typography>

            {/* Documents List */}
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              You are requested to bring the following photocopies at the time of joining:
            </Typography>

            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Educational testimonials.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Experience certificates of the last 2 Companies.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Relieving letter from the last company & TDS Particulars.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>PAN, Aadhar and UAN Card (Color Photo Copies).</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Bank Statement for 2 months.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Passport size color photographs 8 Nos.</Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>Latest Medical reports i.e. CBP & CJE, ABO Typing.</Typography>
            </Box>

            {/* Acceptance Deadline */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              We request you to send the signed copy of the offer as a token of your acceptance on or before <strong>{getAcceptanceDeadline(candidate.joiningDate)}</strong>.
            </Typography>

            {/* Signatures */}
            <Box sx={{ mt: 6 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  For Tellapur Technology Pvt. Ltd.
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>Sudeep Kumar K</Typography>
                <Typography variant="body1">AVP - HR</Typography>
              </Box>

              <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 2, mt: 4 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  I have read this letter and understood the terms of employment. I accept the same without any reservations.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Date:</Typography>
                  <Typography variant="body2">Signature:</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={onClose} sx={{ color: '#6b7280' }}>
            Close
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            variant="contained"
            startIcon={<Download />}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb'
              }
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    );
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

      <OfferLetterPopup
        open={offerLetterOpen}
        onClose={() => setOfferLetterOpen(false)}
        candidate={selectedCandidate}
      />
    </Box>
  );
};

export default OfferLetter;