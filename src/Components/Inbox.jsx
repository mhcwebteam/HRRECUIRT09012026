import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartPie } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, } from 'chart.js';
import { ArrowLeftIcon, BriefcaseIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../Config/Config';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);



const Inbox = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});

  const fetchData = async () => 
  {
    setLoading(true);
    try 
    {
      const response = await axios.get(`${API_BASE_URL}/getData`, {
        headers: 
        {
          "Content-Type": "application/json",
          Accept: 'application/json',
          Authorization: `Bearer ${userToken.token}`
        }
      });
      const responseData = response.data.allAprvls || [];
      console.log(responseData);
      setData(responseData);
    } 
    catch (error) 
    {
      console.error("Error fetching data. Using mock:", error);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => 
  {
    setTimeout(() => 
    {
      fetchData();
    }, 1000);
  }, []);

  useEffect(() => 
  {
    if (location.state?.refresh) fetchData();
  }, [location]);

  useEffect(() => {
    if (!userToken.token) navigate('/');
  }, [navigate, userToken?.token]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

const handleButtonClick = (case_id,processname) => {
    try 
    {
      if(processname=='Manpower')
      {
        navigate(`/manapp/${case_id}`);
      }
      else if(processname=='Stationary')
      {
        navigate(`/StationaryApprover/${case_id}`);
      }
    }
     catch (err) 
     {
        console.error("Error In The Getting the Data")
     }
  }

  const filteredData = useMemo(() => 
    {
    if (!searchText) return data;
    return data.filter(row => {
  
      const search = searchText.toLowerCase();
  
      return Object.entries(row).some(([key, value]) => {
    
        return typeof value === 'string' && value.toLowerCase().includes(search);
      });
    });
  }, [data, searchText]);


  const statusCounts = useMemo(() => 
  {
    const counts = 
    {
      total: data.length,
      completed: 0,
      pending: data.length,
      rejected: 0,
    };

    data.forEach(item => {
      const status = item.Status?.toLowerCase();
      if (status === 'completed') counts.completed += 1;
      else if (status === 'rejected') counts.rejected += 1;
    });

    return counts;
  }, [data]);

  const donutData = {
    labels: ['completed', 'pending'],
    datasets: [
      {
        data: [statusCounts.completed, statusCounts.pending],
        backgroundColor: ['#67AE6E', '#F5C45E'],
        hoverBackgroundColor: ['#328E6E', '#E78B48'],
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        titleFont:{ size: 10 },
        bodyFont: { size: 10 },
      },

      datalabels: 
      {
        color: 'white',
        font: {
          size: 12,  
          weight: 'bold',
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value}`;
        },
      },
    },
    maintainAspectRatio: false,
  };


  const stackedBarData = [
    { name: 'Data', completed: statusCounts.completed, pending: statusCounts.pending },
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };


  const columns = [
  {
    field: 'SNO',
    headerName: 'S.NO',
    flex: 0.5,
    minWidth: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
      const pageSize = paginationModel.pageSize;
      const page = paginationModel.page;
      const serialNumber = page * pageSize + index + 1;
      return serialNumber;
    }
  },
  {
    field: 'btn',
    headerName: 'BUTTON',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const { CASEID, PROCESSNAME } = params.row;
      const handleClick = () => handleButtonClick(CASEID, PROCESSNAME);
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          width: '100%',
        }}>
          <Box sx={{
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: 'bold',
            width: '80px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
            '&:focus': 
            {
              outline: 'none',
            }
          }} onClick={handleClick}>
            Open
          </Box>
        </Box>
      );
    }
  },
  { field: 'CASEID', headerName: 'CASE ID', flex: 1, minWidth: 120 },
  { field: 'PROCESSNAME', headerName: 'PROCESS', flex: 1, minWidth: 120 },
  {
    field: 'RAISER',
    headerName: 'RAISER',
    flex: 1.2,
    minWidth: 140,
    renderCell: (params) => {
      return  params.row.RAISER || '';
    }
  },
  {
    field: 'RAISER_DATE',
    headerName: 'RAISER DATE',
    flex: 1.2,
    minWidth: 140,
    renderCell: (params) => 
    {
      const date = params.row.RAISER_DATE;
      return formatDate(date);
    }
  },
  {
    field: 'RECEIVED_DATE',
    headerName: 'RECEIVED DATE',
    flex: 1.2,
    minWidth: 140,
    renderCell: (params) => 
    {
      const date =  params.row.RECEIVED_DATE;
      return formatDate(date);
    }
  },
  { field: 'CUR_USR', headerName: 'CUR USER', flex: 1.2, minWidth: 140 },
  { field: 'PREV_USR', headerName: 'PREV USER', flex: 1, minWidth: 120 },
];


  const handleBack = () => {
    navigate('/');
  };
  return (
    <>
    
        <Box
          sx={{
            minHeight: "100vh",
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            border: "1px solid #d1d5db",
                  background: "linear-gradient(to bottom right, #fce7f3, #f9fafb, #f3f4f6)", 
          
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
                 Over All indexes
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                 Cumulative indexes engaged in the workflow.
               </p>
             </div>
    
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

    </Box>
    
    </>



  );
};

export default Inbox;