import React, { useState } from 'react';

// VerificationDetailsModal Component
const VerificationDetailsModal = ({ open, onClose, data, onStatusChange }) => {
  const [remarks, setRemarks] = useState(data?.remarks || '');

  if (!open) return null;

  const handleSubmit = (status) => {
    if (onStatusChange) {
      onStatusChange({
        id: data.id,
        status: status,
        remarks: remarks
      });
    }
    onClose();
  };

  const InfoRow = ({ icon, label, value, valueColor = 'text-gray-700' }) => (
    <div className="flex items-start mb-3">
      <div className="flex items-center min-w-[180px] text-gray-600 font-medium">
        {icon && <span className="mr-2 text-blue-500">{icon}</span>}
        <span>{label}:</span>
      </div>
      <div className={`flex-1 font-medium ${valueColor}`}>
        {value || 'N/A'}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      verified: { color: 'bg-green-500', label: 'Verified' },
      pending: { color: 'bg-amber-500', label: 'Pending' },
      rejected: { color: 'bg-red-500', label: 'Rejected' },
      uploaded: { color: 'bg-blue-500', label: 'Uploaded' },
      'not uploaded': { color: 'bg-gray-500', label: 'Not Uploaded' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold inline-block`}>
        {config.label}
      </span>
    );
  };

  const educationData = [
    {
      qualification: 'SSC',
      score: data?.SSC_SCORE,
      document: data?.TENTH_MARKSHEET,
      status: data?.TENTH_MARKSHEET
    },
    {
      qualification: 'Intermediate',
      score: data?.INTER_SCORE,
      document: data?.INTER_MARKSHEET,
      status: data?.INTER_MARKSHEET
    },
    {
      qualification: 'B.Tech/Degree',
      score: data?.BTECH_SCORE,
      document: data?.BTECH_MARKSHEET,
      status: data?.BTECH_MARKSHEET
    },
    {
      qualification: 'Post Graduation',
      score: data?.POST_GRADUCTION,
      document: 'PG Marksheet',
      status: 'pending'
    }
  ];

  const experienceDocuments = [
    { name: 'Payslips', status: data?.PAYSLIPS },
    { name: 'Experience Letter', status: data?.EXP_LETTER },
    { name: 'Relieving Letter', status: data?.RELIEVING_LETTER }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex justify-between items-center text-white p-6 flex justify-between">
          <h2 className="text-2xl font-bold">Verification Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 bg-gray-50">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <InfoRow label="Name" value={data?.NAME} />
                <InfoRow label="Email" value={data?.EMAIL} />
                <InfoRow label="Phone Number" value={data?.PHONE_NUMBER} />
              </div>
              <div>
                <InfoRow label="Case ID" value={data?.CASEID} valueColor="text-purple-600" />
                <InfoRow label="Date of Birth" value={data?.DOB} />
                <InfoRow label="Submitted Date" value={data?.submitted_date} />
              </div>
              <div className="col-span-2">
                <InfoRow label="Address" value={data?.ADDRESS} />
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Identity Documents</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InfoRow label="Aadhar Number" value={data?.AADHAR_NUM} />
              <InfoRow label="PAN Number" value={data?.PAN_NUM} />
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Education Details</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Qualification</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Score/Percentage</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Document</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {educationData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{row.qualification}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {row.score !== 'N/A' ? `${row.score}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.document}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Professional Experience</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InfoRow label="Previous Company" value={data?.PREVIOUS_COMPANY} />
              <InfoRow label="Duration" value={data?.DURATION ? `${data.DURATION} months` : 'N/A'} />
              <InfoRow label="Notice Period" value={data?.NOTICE_PERIOD ? `${data.NOTICE_PERIOD} days` : 'N/A'} />
              <InfoRow label="Current CTC" value={data?.CURRENT_CTC ? `₹${data.CURRENT_CTC}` : 'N/A'} valueColor="text-green-600" />
              <InfoRow label="Expected CTC" value={data?.EXP_CTC ? `₹${data.EXP_CTC}` : 'N/A'} valueColor="text-red-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Document Type</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {experienceDocuments.map((doc, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{doc.name}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={doc.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Status & Remarks */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Verification Status</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="flex items-center mb-4">
              <span className="font-semibold text-gray-600 mr-3">Current Status:</span>
              <StatusBadge status={data?.STATUS} />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Remarks:
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your remarks here..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit('rejected')}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
          >
            Reject
          </button>
          <button
            onClick={() => handleSubmit('verified')}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 transition-all"
          >
            Verify & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetailsModal;