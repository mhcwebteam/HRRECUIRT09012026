
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Modal, IconButton, Typography, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TextField, InputAdornment } from '@mui/material';
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




ChartJS.register(ArcElement, ChartTooltip, ChartLegend);
const Participant = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [manpowerOpen, setManPowerOpen] = useState('');
  const [processCaseId, setProcessAndCaseIdData] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [flowLoading, setFlowLoading] = useState(false);
  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/participants`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken.token}`
          }
        });
        const data = response.data.participantData;
        setData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching participant data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!userToken.token) navigate('/');
  }, [navigate, userToken?.token]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  // Fetch flow data based on case ID
  const fetchFlowData = async (caseId, processname, type) => {
    if (processname == "Manpower") {
      setProcessAndCaseIdData({ processname, caseId, type });
      setManPowerOpen(true);
      setModalOpen(false);
    }
    setFlowLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/stationary/${caseId}/${processname}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken.token}`
        }
      });
      setFlowData(response.data);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch case flow data',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setFlowLoading(false);
    }
  };

  // Handle modal open
  const handleOpenModal = async (rowData, type) => {
    setSelectedRowData(rowData);
    if (rowData.PROCESSNAME == "Stationary") {
      setModalOpen(true);
      setManPowerOpen(false);
    } else {
      setModalOpen(false);
      setManPowerOpen(true);
    }
    if (rowData.CASEID) {
      await fetchFlowData(rowData.CASEID, rowData.PROCESSNAME, type);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRowData(null);
    setFlowData(null);
    setManPowerOpen(false);
  };

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter(row => {
      const search = searchText.toLowerCase();
      return (
        (row.CASEID && row.CASEID.toLowerCase().includes(search)) ||
        (row.PROCESSNAME && row.PROCESSNAME.toLowerCase().includes(search)) ||
        (row.RAISER && row.RAISER.toLowerCase().includes(search)) ||
        (row.raiser_date && row.raiser_date.toLowerCase().includes(search)) ||
        (row.CURRENT_USER && row.CURRENT_USER.toLowerCase().includes(search)) ||
        (row.ACTION_STATUS && row.ACTION_STATUS.toLowerCase().includes(search))
      );
    });
  }, [data, searchText]);

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
      field: 'details',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal(params.row, "view1")}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '10px',
                padding: '4px 12px',
                borderRadius: '6px',
                textTransform: 'capitalize',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                }
              }}
            >
              View
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal(params.row, "view")}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                fontSize: '10px',
                padding: '4px 12px',
                borderRadius: '6px',
                textTransform: 'capitalize',
                boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3d8bfe 0%, #00d4fe 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                }
              }}
            >
              Open
            </Button>
          </Box>
        );
      },
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
      field: 'PROCESSNAME',
      headerName: 'Process',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <Box
            sx={{

              color: params.value === 'Stationary' ? '#1e40af' : '#92400e',
              padding: '0px 1px 2px 3px',
              borderRadius: '12px',

              fontWeight: 600,
            }}
          >
            {params.value}
          </Box>
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
      field: 'RECEIVED_DATE',
      headerName: 'Received Date',
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
      field: 'CURRENT_USER',
      headerName: 'Current User',
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
      field: 'TASK_COUNT',
      headerName: 'Task Count',
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
            // backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            minWidth: '30px',
            textAlign: 'center',
          }}>
            {params.value || '0'}
          </Box>
        </Box>
      ),
    },
    {
      field: 'ACTION_STATUS',
      headerName: 'Status',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => {
        const status = params.value?.toLowerCase();
        // let backgroundColor = '#f3f4f6';
        let color = '#374151';

        if (status === 'completed') {

          color = '#326858ff';
        } else if (status === 'pending' || status === 'to_do') {
          // backgroundColor = '#fef3c7';
          color = '#91542eff';
        } else if (status === 'rejected') {
          // backgroundColor = '#fee2e2';
          color = '#a34948b7';
        }

        return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}>
            <Box sx={{
              // backgroundColor,
              color,
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {params.value}
            </Box>
          </Box>
        );
      }
    },
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return '#10b981';
    if (statusLower === 'pending' || statusLower === 'to_do') return '#f59e0b';
    if (statusLower === 'reject') return '#ef4444';
    if (statusLower === 'approved' || statusLower === 'approve') return '#10b981';
    return 'inherit';
  };

  // Enhanced renderFlowData function
  const renderFlowData = () => {
    if (flowLoading) {
      return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          borderRadius: '8px'
        }}>
          <CircularProgress sx={{ color: '#667eea' }} />
          <Typography sx={{ ml: 2, color: '#64748b' }}>Loading flow data...</Typography>
        </Box>
      );
    }

    if (!flowData || !flowData.data) {
      return (
        <Box sx={{
          textAlign: 'center',
          py: 4,
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            No flow data available
          </Typography>
        </Box>
      );
    }

    const data = flowData.data;

    // Helper function to filter items by approval level
    const getItemsForLevel = (level) => {
      if (!data.stationary_items) return { approved: [], rejected: [] };
      return {
        approved: data.stationary_items.filter(item => {
          const subStatus = item.sub_status?.toLowerCase();
          const storesheadStatus = item.storeshead_status?.toLowerCase();
          if (level === 'hod') {
            return (subStatus === 'approved' || subStatus === 'approve') &&
              (!storesheadStatus || storesheadStatus === 'approved' || storesheadStatus === 'approve');
          } else if (level === 'stores') {
            return storesheadStatus === 'approved' || storesheadStatus === 'approve';
          }
          return [];
        }),
        rejected: data.stationary_items.filter(item => {
          const subStatus = item.sub_status?.toLowerCase();
          const storesheadStatus = item.storeshead_status?.toLowerCase();
          if (level === 'hod') {
            return subStatus === 'rejected' || subStatus === 'reject';
          } else if (level === 'stores') {
            return storesheadStatus === 'rejected' || storesheadStatus === 'reject';
          }
          return [];
        })
      };
    };

    const renderApprovalStep = (name, task, status, approvalDate, levelItems) => (
      <Box sx={{
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        p: 2,
        mb: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', gap: 2, minHeight: '120px' }}>
          {/* Left Box - Approval Details */}
          <Box sx={{
            flex: 0.6,
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            p: 1.5,
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}>
            <Typography variant="body2" sx={{
              mb: 1,
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151'
            }}>
              {name} {task ? `- ${task}` : ''}
            </Typography>
            <Box sx={{
              backgroundColor: status?.toLowerCase() === 'completed' ? '#d1fae5' :
                status?.toLowerCase() === 'pending' ? '#fef3c7' : '#fee2e2',
              color: status?.toLowerCase() === 'completed' ? '#065f46' :
                status?.toLowerCase() === 'pending' ? '#92400e' : '#991b1b',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
              mb: 1,
              textAlign: 'center',
            }}>
              Status: {status}
            </Box>
            {approvalDate && (
              <Typography variant="body2" sx={{
                color: '#6b7280',
                fontSize: '10px',
                textAlign: 'center'
              }}>
                Date: {new Date(approvalDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>

          {/* Right Box - Items */}
          <Box sx={{
            flex: 1,
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            p: 1,
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Table Header */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 40px 60px',
              gap: '4px',
              mb: 1,
              borderBottom: '2px solid #e5e7eb',
              pb: 0.5
            }}>
              <Typography variant="body2" sx={{
                fontSize: '10px',
                color: '#374151',
                fontWeight: 600
              }}>
                Item
              </Typography>
              <Typography variant="body2" sx={{
                fontSize: '10px',
                color: '#374151',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Qty
              </Typography>
              <Typography variant="body2" sx={{
                fontSize: '10px',
                color: '#374151',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Status
              </Typography>
            </Box>

            {/* Table Rows */}
            <Box sx={{
              maxHeight: '80px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { backgroundColor: '#f3f4f6', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#9ca3af',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#6b7280' }
              }
            }}>
              {/* Approved Items */}
              {levelItems.approved.map((item, index) => (
                <Box key={`approved-${index}`} sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 40px 60px',
                  gap: '4px',
                  py: 0.5,
                  borderBottom: '1px solid #f3f4f6',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f9fafb' }
                }}>
                  <Typography variant="body2" sx={{
                    fontSize: '9px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#374151'
                  }}>
                    {item.stationary}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontSize: '9px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    {item.approved_quantity ?? item.Quantity ?? item.quantity}
                  </Typography>
                  <Box sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '7px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                    APPROVED
                  </Box>
                </Box>
              ))}

              {/* Rejected Items */}
              {levelItems.rejected.map((item, index) => (
                <Box key={`rejected-${index}`} sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 40px 60px',
                  gap: '4px',
                  py: 0.5,
                  borderBottom: '1px solid #f3f4f6',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f9fafb' }
                }}>
                  <Typography variant="body2" sx={{
                    fontSize: '9px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#374151'
                  }}>
                    {item.stationary}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontSize: '9px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    {item.Quantity ?? item.quantity}
                  </Typography>
                  <Box sx={{
            
                    color: 'white',
                    fontSize: '7px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                    REJECTED
                  </Box>
                </Box>
              ))}

              {/* If no items in either category */}
              {levelItems.approved.length === 0 && levelItems.rejected.length === 0 && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '50px'
                }}>
                  <Typography variant="body2" sx={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    fontSize: '9px',
                    textAlign: 'center'
                  }}>
                    No items processed
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.name && (
          <Box sx={{
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            p: 2,
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{
              color: '#1e40af',
              mb: 0.5,
              fontWeight: 600
            }}>
              Request Raised By: {data.name}
            </Typography>
            {data.raiser_date && (
              <Typography variant="body2" sx={{
                color: '#3730a3',
                fontSize: '11px'
              }}>
                Date: {new Date(data.raiser_date).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Down Arrow */}
        <Typography sx={{
          fontSize: 24,
          textAlign: 'center',
          color: '#3b82f6',
          my: 0.5
        }}>
          ↓
        </Typography>

        {data.hod_name && renderApprovalStep(
          data.hod_name,
          'HOD',
          data.hod_status || 'Pending',
          data.hod_aprvl_date,
          getItemsForLevel('hod')
        )}

        {/* Down Arrow */}
        {data.stores_name && (
          <Typography sx={{
            fontSize: 24,
            textAlign: 'center',
            color: '#3b82f6',
            my: 0.5
          }}>
            ↓
          </Typography>
        )}

        {/* Stores Approval Step */}
        {data.stores_name && renderApprovalStep(
          data.stores_name,
          'Store',
          data.stores_status || 'Pending',
          data.stores_aprvl_date,
          getItemsForLevel('stores')
        )}

        {/* Current Status */}
        {(data.current_user || data.current_status) && (
          <>
            <Typography sx={{
              fontSize: 24,
              textAlign: 'center',
              color: '#3b82f6',
              my: 0.5
            }}>
              ↓
            </Typography>
            <Box sx={{
              border: '2px solid #10b981',
              borderRadius: '12px',
              p: 2,
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              textAlign: 'center'
            }}>
              {data.current_user && (
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  color: '#065f46'
                }}>
                  Current User: {data.current_user} {data.current_task ? `- ${data.current_task}` : ''}
                </Typography>
              )}
              {data.current_status && (
                <Typography variant="body2" sx={{
                  mt: 0.5,
                  color: getStatusColor(data.current_status),
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  Status: {data.current_status === "Approve" ? "Completed" :
                    data.current_status?.toLowerCase() === "reject" || data.current_status?.toLowerCase() === "rejected" ? "Closed" :
                      data.current_status}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    );
  };

  // Enhanced modal styles
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: 600,
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
        minHeight: "100vh",
        maxWidth: "1280px", // ~7xl
        margin: "0 auto",
        padding: "20px",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        border: "1px solid #d1d5db", // gray-300
        background: "linear-gradient(to bottom right, #fce7f3, #f9fafb, #f3f4f6)", // pink-100 → gray-50 → gray-100
      }}
    >
      <div className="flex items-center bg-white rounded-2xl shadow-lg px-8 py-6 border border-gray-100 ">
        {/* Left Accent Icon */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md mr-4">
          <BriefcaseIcon className="w-6 h-6" />
        </div>

        {/* Title + Subtitle */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Over All Participants
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Cumulative participants engaged in the workflow.
          </p>
        </div>

        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                          text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                          hover:from-blue-600 hover:to-blue-700 font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </motion.button>
      </div>
      {/* Enhanced Dashboard tiles section */}
      <Box sx={{
        height: "200px",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        gap: "16px",
        marginBottom: "20px",
      }}>
        {[...Array(7)].map((_, index) => {
          const tileStyle = {
            flex: "1 1 13%",
            minWidth: "140px",
            height: "160px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
            padding: "16px",
            boxSizing: "border-box",
            borderRadius: "20px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
            transition: "all 0.3s ease",
            ...(index === 3 && {
              background: "linear-gradient(135deg, #8398f6ff 0%, #ae76e7ff 100%)",
              color: "white",
            }),
            ...(index === 4 && {
              background: "linear-gradient(135deg, #24cd95ff 0%, #1be0a1ff 100%)",
              color: "white",
            }),
            ...(index === 5 && {
              background: "linear-gradient(135deg, #f3ae37ff 0%, #e99d45ff 100%)",
              color: "white",
            }),
            ...(index === 6 && {
              background: "linear-gradient(135deg, #f34747c2 0%, #f35b5bff 100%)",
              color: "white",
            }),
          };

          return (


            <Box
              key={index}
              sx={tileStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
              }}
            >
              {index === 0 ? (
                <Box sx={{ height: '120px', width: '120px' }}>
                  <Doughnut data={donutData} options={donutOptions} />
                </Box>
              ) : index === 1 ? (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{
                    background: "linear-gradient(135deg, #7b8ee2ff 0%, #7d5d9cff 100%)",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "9px",
                    marginBottom: "8px",
                    textAlign: "center",
                    fontWeight: 600,
                  }}>
                    TOTAL: {statusCounts.total}
                  </Box>
                  <Box sx={{
                    background: "linear-gradient(135deg, #518675ff 0%, #377662ff 100%)",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "9px",
                    marginBottom: "8px",
                    textAlign: "center",
                    fontWeight: 600,
                  }}>
                    COMPLETED: {statusCounts.completed}
                  </Box>
                  <Box sx={{
                    background: "linear-gradient(135deg, #a5844bff 0%, #8d602cff 100%)",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "9px",
                    textAlign: "center",
                    fontWeight: 600,
                  }}>
                    PENDING: {statusCounts.pending}
                  </Box>
                </Box>
              ) : index === 2 ? (
                <BarChart width={50} height={150} data={stackedBarData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                </BarChart>
              ) : index === 3 ? (
                <Box sx={{ textAlign: "center" }}>
                  <FaChartPie size={32} />
                  <Typography variant="h6" sx={{ fontWeight: "600", marginTop: "12px" }}>
                    Total
                  </Typography>
                  <Box sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    marginTop: "8px",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}>
                    {statusCounts.total}
                  </Box>
                </Box>
              ) : index === 4 ? (
                <Box sx={{ textAlign: "center" }}>
                  <FaCheckCircle size={32} />
                  <Typography variant="h6" sx={{ fontWeight: "600", marginTop: "12px" }}>
                    Completed
                  </Typography>
                  <Box sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    marginTop: "8px",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}>
                    {statusCounts.completed}
                  </Box>
                </Box>
              ) : index === 5 ? (
                <Box sx={{ textAlign: "center" }}>
                  <FaExclamationCircle size={32} />
                  <Typography variant="h6" sx={{ fontWeight: "600", marginTop: "12px" }}>
                    Pending
                  </Typography>
                  <Box sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    marginTop: "8px",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}>
                    {statusCounts.pending}
                  </Box>
                </Box>
              ) : index === 6 ? (
                <Box sx={{ textAlign: "center" }}>
                  <FaTimesCircle size={32} />
                  <Typography variant="h6" sx={{ fontWeight: "600", marginTop: "12px" }}>
                    Rejected
                  </Typography>
                  <Box sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    marginTop: "8px",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}>
                    {statusCounts.rejected}
                  </Box>
                </Box>
              ) : null}
            </Box>

          );
        })}
      </Box>

      {/* Enhanced DataGrid section */}
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
              border="2px solid gray"
              placeholder="Search cases, processes, users..."
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
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.08)", // ✅ soft shadow
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
            {filteredData.length} of {data.length} records
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #dfe5f1ff", // light gray border
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // soft shadow
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.SNO}
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
                borderRight: "1px solid #e2e8f0", // 🔹 vertical line between headers
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e2e8f0",
                borderRight: "1px solid #e2e8f0", // 🔹 vertical line between cells
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
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Modal Header */}
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

          {/* Modal Content */}
          <Box sx={{
            padding: '20px',
            maxHeight: 'calc(80vh - 80px)',
            overflowY: 'auto',
            backgroundColor: '#f8fafc',
          }}>
            {renderFlowData()}
          </Box>
        </Box>
      </Modal>

      {/* Enhanced Modal for Manpower */}
      {processCaseId.type === "view" ? (
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
              <DataFlow
                processname={processCaseId.processname ?? ""}
                caseId={processCaseId.caseId ?? ""}
                mode={processCaseId.type ?? ""}
              />
            </Box>
          </Box>
        </Modal>
      ) : (
        <Modal open={manpowerOpen} onClose={handleCloseModal}>
          <Box sx={{
            ...modalStyle,
            width: '90%',
            maxWidth: '1200px',
          }}>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#64748b',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{
              padding: '20px',
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
            }}>
              <ManPowerView caseId={processCaseId.caseId ?? ""} />
            </Box>
          </Box>
        </Modal>
      )}
    </Box>


  );
};

export default Participant;
