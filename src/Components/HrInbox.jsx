// import { useState, useEffect, useMemo } from 'react';
// import {
//   Paper,
//   Box,
//   Typography,
//   IconButton,
//   Tooltip,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   CircularProgress
// } from '@mui/material';
// import { Search, Visibility } from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid';
// import axios from 'axios';
// import { API_BASE_URL } from '../Config/Config';

// const HrInbox = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
//   const [loading, setLoading] = useState(false);
//   const [hrData, setHrData] = useState([]);
//   console.log("hrDatahrData",hrData);

//   const token = useMemo(() => {
//     const info = JSON.parse(localStorage.getItem('userInfo'));
//     return info?.token;
//   }, []);

//   /* ---------------------------API CALL----------------------------- */
//   const hrAprvlFetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/hr-Aprvl-Data`, {
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setHrData(res.data.HrAprvlData || []);
//     } catch (err) {
//       console.error('Error fetching HR approvals', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) hrAprvlFetchData();
//   }, [token]);

//   /* ---------------- HANDLERS ---------------- */

//   const handleViewDetails = (row) => {
//     console.log('View details:', row);
//     // 👉 open modal / navigate
//   };

//   /* ---------------- ROWS ---------------- */

//   const rows = useMemo(() => {
//     return hrData.map((item, index) => ({
//       id: item.all_apprvls_hr_Id,
//       SNO: index + 1,
//       ALL_APPRVL_ID: item.all_apprvls_hr_Id,
//       CHILD_CASEID: item.Child_CaseId || 'N/A',
//       RECRUIT_PROCESS: item.Recruit_Process || 'N/A',
//       STAGES: item.Stages || 'N/A',
//       CREATED_AT: item.created_at
//         ? new Date(item.created_at).toLocaleDateString('en-IN')
//         : 'N/A',
//       UPDATED_AT: item.updated_at
//         ? new Date(item.updated_at).toLocaleDateString('en-IN')
//         : 'N/A',
//     }));
//   }, [hrData]);

//   /* ---------------- FILTER ---------------- */

//   const filteredRows = useMemo(() => {
//     let data = [...rows];

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       data = data.filter(row =>
//         row.CHILD_CASEID.toLowerCase().includes(term) ||
//         row.RECRUIT_PROCESS.toLowerCase().includes(term)
//       );
//     }

//     if (statusFilter !== 'all') {
//       data = data.filter(row => row.STAGES === statusFilter);
//     }

//     return data;
//   }, [rows, searchTerm, statusFilter]);

//   /* ---------------- COLUMNS ---------------- */
//   const columns = [
//     { field: 'SNO', headerName: 'S.No', width: 80 },
//     { field: 'Child_CaseId', headerName: 'Case ID', flex: 1, minWidth: 160 },
//     { field: 'Recruit_Process', headerName: 'Recruit Process', flex: 1, minWidth: 180 },
//     {
//       field: 'STAGES',
//       headerName: 'Stages',
//       width: 120,
//       renderCell: (p) => (
//         <Box
//           sx={{
//             px: 1.5,
//             py: 0.5,
//             borderRadius: 1,
//             fontSize: 12,
//             fontWeight: 600,
//             backgroundColor:
//               p.value === 'HR'
//                 ? '#dbeafe'
//                 : p.value === 'FIN'
//                 ? '#dcfce7'
//                 : '#fef3c7',
//           }}
//         >
//           {p.value}
//         </Box>
//       ),
//     },
//     { field: 'created_at', headerName: 'Created', width: 130 },
//     { field: 'updated_at', headerName: 'Updated', width: 130 },
//     {
//       field: 'actions',
//       headerName: 'Action',
//       width: 90,
//       sortable: false,
//       renderCell: (p) => (
//         <Tooltip title="View">
//           <IconButton onClick={() => handleViewDetails(p.row)}>
//             <Visibility fontSize="small" />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//   ];

//   /* ---------------- UI ---------------- */

//   return (
//     <Box sx={{ maxWidth: 1280, mx: 'auto', p: 3 }}>
//       <Paper sx={{ p: 3, borderRadius: 3 }}>
//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <TextField
//             size="small"
//             placeholder="Search Case / Process"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <TextField
//             select
//             size="small"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             sx={{ minWidth: 150 }}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="HR">HR</MenuItem>
//             <MenuItem value="FIN">FIN</MenuItem>
//           </TextField>
//         </Box>

//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <DataGrid
//             rows={hrData}
//             columns={columns}
//              getRowId={(row) => row.all_apprvls_hr_Id}
//             paginationModel={paginationModel}
//             onPaginationModelChange={setPaginationModel}
//             pageSizeOptions={[5, 10, 20]}
//             autoHeight
//           />
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default HrInbox;

import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, TrendingUp, Users, FileText, ChevronLeft, ChevronRight, Filter, Download, RefreshCw } from 'lucide-react';
import {API_BASE_URL} from '../Config/Config';
import { useNavigate } from 'react-router-dom';

// Mock API for demo - replace with your actual API

const HrInbox = () => {
  const [searchTerm,   setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage,  setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading,  setLoading] = useState(false);
  const [hrData,   setHrData] = useState([]);
  const navigate = useNavigate();

  const token = useMemo(() => 
  {
    const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return info?.token;
   }, []);
  const hrAprvlFetchData = async () => 
  {
    if (!token) {
      console.warn('No token found');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/hr-Aprvl-Data`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setHrData(data?.HrAprvlData || []);
    } catch (err) {
      console.error('Error fetching HR approvals', err);
      // Keep mock data on error for demo purposes
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => 
  {
    if (token) 
    {
      hrAprvlFetchData();
    }
  }, [token]);

  useEffect(() => 
  {
    setCurrentPage(0);
  }, [searchTerm, statusFilter]);

  const handleViewDetails = (row) => 
  {
    if (!row?.Recruit_Process) return;
    navigate(`/RecruitmentProcess?process=${row.Recruit_Process}`);
  };
  const filteredRows = useMemo(() => 
  {
    let data = [...hrData];
    if (searchTerm) 
    {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          (row.Child_CaseId || '').toLowerCase().includes(term) ||
          (row.Recruit_Process || '').toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') 
    {
      data = data.filter((row) => row.Stages === statusFilter);
    }
    return data;
  }, [hrData, searchTerm, statusFilter]);

  const stats = useMemo(() => 
  {
    return {
      total   : hrData.length,
      hrCount : hrData.filter((i) => i.Stages === 'HR').length,
      finCount: hrData.filter((i) => i.Stages === 'FIN').length,
    };
  }, [hrData]);

  const paginatedRows = useMemo(() => 
  {
    const start = currentPage * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const safeTotalPages = Math.max(1, totalPages);

  const getStageStyle = (stage) => 
  {
    if (!stage)          return 'bg-gray-100 text-gray-700';
    if (stage === 'HR')  return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (stage === 'FIN') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  const getStageLabel = (stage) => 
  {
    if (!stage)          return 'Pending';
    if (stage === 'HR')  return 'HR Review';
    if (stage === 'FIN') return 'Finance';
    return stage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                HR Approval Inbox
              </h1>
              <p className="text-gray-600">
                Manage and track recruitment approvals efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={hrAprvlFetchData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Approvals"
            value={stats.total}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            trend="+12% from last month"
          />
          <StatCard
            title="HR Stage"
            value={stats.hrCount}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
            trend="Active reviews"
          />
          <StatCard
            title="Finance Stage"
            value={stats.finCount}
            icon={<FileText className="w-6 h-6" />}
            color="emerald"
            trend="Pending approval"
          />
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters Bar */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Case ID or Recruitment Process..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-sm font-medium"
                  >
                    <option value="all">All Stages</option>
                    <option value="HR">HR Review</option>
                    <option value="FIN">Finance</option>
                  </select>
                </div>

                <div className="flex items-center px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm font-semibold text-blue-700">
                    {filteredRows.length} {filteredRows.length === 1 ? 'Result' : 'Results'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading approvals...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">No results found</p>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[
                        { key: 'sno',     label: 'S.No',   width: 'w-20'  },
                        { key: 'caseId',  label: 'Case ID', width: 'w-32' },
                        { key: 'process', label: 'Recruitment Process', width: 'flex-1' },
                        { key: 'stage',   label: 'Stage',   width: 'w-32' },
                        { key: 'created', label: 'Created', width: 'w-32' },
                        { key: 'updated', label: 'Updated', width: 'w-32' },
                        { key: 'actions', label: 'Actions', width: 'w-24' },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className={`${col.width} px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedRows.map((row, index) => (
                      <tr
                        key={row.all_apprvls_hr_Id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {currentPage * pageSize + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {row.Child_CaseId || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {row.Recruit_Process || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStageStyle(
                              row.Stages
                            )}`}
                          >
                            {getStageLabel(row.Stages)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {row.updated_at
                            ? new Date(row.updated_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(row)}
                            className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all duration-200 group"
                            title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-semibold">{currentPage * pageSize + 1}</span>
                      {' '}-{' '}
                      <span className="font-semibold">
                        {Math.min((currentPage + 1) * pageSize, filteredRows.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-semibold">{filteredRows.length}</span>
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value={5} > 5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <span className="text-sm text-gray-700 font-medium px-2">
                      Page {currentPage + 1} of {safeTotalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(safeTotalPages - 1, p + 1))
                      }
                      disabled={currentPage >= safeTotalPages - 1}
                      className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
     text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>
            {value}
          </p>
          <p className="text-xs text-gray-500">{trend}</p>
       </div>
        <div className={`${colors.iconBg} rounded-xl p-3`}>
          <div className={colors.iconText}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default HrInbox;
