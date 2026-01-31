





import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, TrendingUp, Users, FileText, ChevronLeft, ChevronRight, Filter, Download, RefreshCw } from 'lucide-react';
import {API_BASE_URL} from '../Config/Config';
import { useNavigate } from 'react-router-dom';

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

       console.log("ajiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",data);
      setHrData(data?.HrAprvlData || []);
    } catch (err) {
      console.error('Error fetching HR approvals', err);
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
    if (!stage)          return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md hover:scale-105';
    if (stage === 'HR')  return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-300 shadow-sm hover:shadow-md hover:scale-105';
    if (stage === 'FIN') return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm hover:shadow-md hover:scale-105';
    return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-300 shadow-sm hover:shadow-md hover:scale-105';
  };

  const getStageLabel = (stage) => 
  {
    if (!stage)          return 'Pending';
    if (stage === 'HR')  return 'HR Review';
    if (stage === 'FIN') return 'Finance';
    return stage;
  };
// Add this helper function after the getStageLabel function
const getProcessStyle = (process) => 
{
  if (!process) return 'bg-gray-100 text-gray-700 border border-gray-200';
  
  const processLower = process.toLowerCase();
  
  if (processLower.includes('candidate approval')) {
    return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-300';
  }
  if (processLower.includes('salary stack') || processLower.includes('salary')) {
    return 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border border-pink-300';
  }
  if (processLower.includes('onboarding')) {
    return 'bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 border border-cyan-300';
  }
  if (processLower.includes('interview')) {
    return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-300';
  }
  if (processLower.includes('offer')) {
    return 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-300';
  }
  if (processLower.includes('background')) {
    return 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 border border-indigo-300';
  }
  
  // Default color for other processes
  return 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-300';
};
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section - Compressed */}
        <div className="mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
                HR Approval Inbox
              </h1>
              <p className="text-sm text-gray-600">
                Manage and track recruitment approvals efficiently
              </p>
            </div>
            {/* <div className="flex gap-2">
              <button
                onClick={hrAprvlFetchData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg transition-all duration-200 text-xs font-medium text-gray-700 hover:text-blue-600 group"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 text-xs font-medium transform hover:-translate-y-0.5 hover:scale-105">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div> */}
          </div>
        </div>

        {/* Stats Cards - Enhanced */}
       
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
  <StatCard
    title="Total Approvals"
    value={stats.total}
    icon={<Users className="w-5 h-5" />}
    color="blue"
    trend="+12% from last month"
  />
  <StatCard
    title="HR Stage"
    value={stats.hrCount}
    icon={<TrendingUp className="w-5 h-5" />}
    color="purple"
    trend="Active reviews"
  />
  <StatCard
    title="Finance Stage"
    value={stats.finCount}
    icon={<FileText className="w-5 h-5" />}
    color="emerald"
    trend="Pending approval"
  />
</div>

        {/* Main Table Card - Enhanced */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300">
          {/* Filters Bar - Enhanced */}
          <div className="px-4 py-3 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Case ID or Recruitment Process..."
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs hover:border-blue-300 hover:shadow-md bg-white"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative group">
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-8 pr-7 py-2 border-2 border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer text-xs font-medium hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <option value="all">All Stages</option>
                    <option value="HR">HR Review</option>
                    <option value="FIN">Finance</option>
                  </select>
                </div>

                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-blue-700">
                    {filteredRows.length} {filteredRows.length === 1 ? 'Result' : 'Results'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Content - Enhanced */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-600 text-sm font-medium">Loading approvals...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-base mb-0.5">No results found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 border-b-2 border-gray-300">
                      {[
                        { key: 'sno',     label: 'S.No',   width: 'w-12'  },
                        { key: 'caseId',  label: 'Case ID', width: 'w-32' },
                        { key: 'process', label: 'Recruitment Process', width: 'w-48' },
                        { key: 'created', label: 'Created', width: 'w-32' },
                        { key: 'updated', label: 'Updated', width: 'w-32' },
                        { key: 'actions', label: 'Actions', width: 'w-24' },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className={`${col.width} px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedRows.map((row, index) => (
                      <tr
                        key={row.all_apprvls_hr_Id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-blue-50 transition-all duration-200 group hover:shadow-md"
                      >
                        <td className="px-3 py-2 text-xs text-gray-600 font-medium">
                          {currentPage * pageSize + index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {row.Child_CaseId || 'N/A'}
                          </span>
                        </td>
                       <td className="px-3 py-2">
  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 ${getProcessStyle(row.Recruit_Process)}`}>
    {row.Recruit_Process || 'N/A'}
  </span>
</td>
                        <td className="px-3 py-2 text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                          {row.updated_at
                            ? new Date(row.updated_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleViewDetails(row)}
                            className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-600 hover:to-indigo-600 text-blue-600 hover:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:scale-110"
                            title="View Details">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Enhanced */}
              <div className="px-4 py-3 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-700">
                      Showing{' '}
                      <span className="font-semibold text-blue-600">{currentPage * pageSize + 1}</span>
                      {' '}-{' '}
                      <span className="font-semibold text-blue-600">
                        {Math.min((currentPage + 1) * pageSize, filteredRows.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-semibold text-blue-600">{filteredRows.length}</span>
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0);
                      }}
                      className="px-2.5 py-1 border-2 border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-blue-300 hover:shadow-md transition-all bg-white"
                    >
                      <option value={5} > 5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <span className="text-xs text-gray-700 font-semibold px-2">
                      Page {currentPage + 1} of {safeTotalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(safeTotalPages - 1, p + 1))
                      }
                      disabled={currentPage >= safeTotalPages - 1}
                      className="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
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
      bgGradient: 'from-blue-50 via-blue-100 to-blue-50',
      text: 'text-blue-600',
      iconBg: 'from-blue-100 to-blue-200',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-blue-200/50'
    },
    purple: {
      bgGradient: 'from-purple-50 via-purple-100 to-purple-50',
      text: 'text-purple-600',
      iconBg: 'from-purple-100 to-purple-200',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      hoverShadow: 'hover:shadow-purple-200/50'
    },
    emerald: {
      bgGradient: 'from-emerald-50 via-emerald-100 to-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'from-emerald-100 to-emerald-200',
      border: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-emerald-200/50'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-gradient-to-br ${colors.bgGradient} rounded-xl p-4 border-2 ${colors.border} ${colors.hoverBorder} shadow-md hover:shadow-xl ${colors.hoverShadow} transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 mb-0.5 group-hover:text-gray-700 transition-colors">{title}</p>
          <p className={`text-2xl font-bold ${colors.text} mb-1 group-hover:scale-110 transition-transform duration-300 origin-left`}>
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium group-hover:text-gray-600 transition-colors">{trend}</p>
        </div>
        <div className={`bg-gradient-to-br ${colors.iconBg} rounded-xl p-2.5 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <div className={colors.text}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default HrInbox;









