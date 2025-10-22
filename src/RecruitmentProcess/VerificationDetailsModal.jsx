


import React, { useState } from 'react';
import { X, Eye, Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../Config/Config';
import axios from 'axios';
import Swal from 'sweetalert2';

const VerificationDetailsModal = ({ open, onClose, data, onStatusChange }) => {

  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});

  const [remarks, setRemarks] = useState(data?.remarks || '');
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingDocName, setViewingDocName] = useState('');

  if (!open) return null;




const handleSubmit = async () => {
  try {
    const payload = {
      child_caseId: data.CHILD_CASEID,
      remarks,
    };

    const response = await axios.post(`${API_BASE_URL}/verify-update`, payload, {
      headers: {
        Authorization: `Bearer ${userToken.token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('resp', response);

    if (response.data) {
      await Swal.fire({
        title: 'Success!',
        text: 'Verification updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setRemarks('');
      onClose();
    }
  } catch (error) {
    console.error('Error submitting form:', error);

    Swal.fire({
      title: 'Error!',
      text: 'Failed to update verification. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};


  const handleViewDocument = (url, name) => {


    if (url && url !== 'N/A') {

      setViewingDoc(url);
      setViewingDocName(name);
    }
  };

  const InfoRow = ({ icon, label, value, valueColor = 'text-gray-700' }) => (
    <div className="flex items-start mb-3">
      <div className="flex items-center min-w-[180px] text-gray-600 font-medium text-sm">
        {icon && <span className="mr-2 text-blue-500">{icon}</span>}
        <span>{label}:</span>
      </div>
      <div className={`flex-1 font-medium text-sm ${valueColor}`}>
        {value || 'N/A'}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      verified: { color: 'bg-green-500', label: 'Verified', icon: CheckCircle },
      pending: { color: 'bg-amber-500', label: 'Pending', icon: Clock },
      rejected: { color: 'bg-red-500', label: 'Rejected', icon: XCircle },
      uploaded: { color: 'bg-blue-500', label: 'Uploaded', icon: CheckCircle },
      'not uploaded': { color: 'bg-gray-500', label: 'Not Uploaded', icon: XCircle }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };




  const DocumentViewer = ({ url, name, onClose }) => {
    if (!url) return null;

    const isPDF = url.toLowerCase().endsWith('.pdf');
    const fullUrl = url.startsWith('http')
      ? url
      : `http://127.0.0.1:8000${url}`;

    console.log('Full URL:', fullUrl);

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(fullUrl, '_blank')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Open in new tab"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            {isPDF ? (
              <iframe
                src={fullUrl}
                className="w-full h-full min-h-[600px] border-0 rounded-lg bg-white"
                title={name}
              />
            ) : (
              <img
                src={fullUrl}
                alt={name}
                className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    );
  };


  // Document card component
  const DocumentCard = ({ title, documentPath }) => {
    const hasDocument = documentPath && documentPath !== null;

    return (
      <div className={`p-4 rounded-xl border-2 transition-all ${hasDocument
          ? 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:shadow-md'
          : 'border-gray-200 bg-gray-50'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <FileText className={`w-5 h-5 ${hasDocument ? 'text-blue-600' : 'text-gray-400'}`} />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {hasDocument ? 'Document available' : 'Not uploaded'}
              </p>
            </div>
          </div>
          {hasDocument ? (
            <button
              onClick={() => handleViewDocument(documentPath, title)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          ) : (
            <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium">
              N/A
            </span>
          )}
        </div>
      </div>
    );
  };

  // Education data from backend
  const educationDocuments = [
    { title: '10th Certificate', path: data?.documents?.['10th_certi'], marks: data?.SSC_MARKS },
    { title: 'Intermediate Certificate', path: data?.documents?.Inter_certi, marks: data?.INTER_MARKS },
    { title: 'B.Tech/Degree Certificate ', path: data?.documents?.Gradu_certi, marks: data?.BTECH_MARKS },
    { title: 'PG Certificate', path: data?.documents?.Pg_certi, marks: data?.PG_MARKS },
  ];

  // Identity documents
  const identityDocuments = [
    { title: 'Aadhar Card', path: data?.documents?.Aadhar_certi },
    { title: 'PAN Card', path: data?.documents?.Pan_certi },
  ];

  // Professional documents
  const professionalDocuments = [
    { title: 'Payslip', path: data?.documents?.Payslip },
    { title: 'Experience Letter', path: data?.documents?.Exp_Letter },
    { title: 'Relieving Letter', path: data?.documents?.Relieving_Letter },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{data?.NAME || 'N/A'}</h2>
              <p className="text-blue-100 text-sm mt-1">{data?.EMAIL || 'N/A'}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 bg-gray-50">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Personal Information
              </h3>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InfoRow label="Case ID" value={data?.CHILD_CASEID} valueColor="text-purple-600" />
                <InfoRow label="Phone Number" value={data?.PHONE_NUMBER} />
                <InfoRow label="Date of Birth" value={data?.DOB} />
                <InfoRow label="Address" value={data?.ADDRESS} />
                <InfoRow label="Submitted Date" value={data?.submitted_date} />
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium text-sm">Status:</span>
                  <StatusBadge status={data?.STATUS} />
                </div>
              </div>
            </div>

            {/* Identity Documents */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                Identity Documents
              </h3>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-4">
                <InfoRow label="Aadhar Number" value={data?.AADHAR_NUM} />
                <InfoRow label="PAN Number" value={data?.PAN_NUM} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identityDocuments.map((doc, index) => (
                  <DocumentCard key={index} title={doc.title} documentPath={doc.path} />
                ))}
              </div>
            </div>

            {/* Education Details */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                Education Details & Documents
              </h3>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationDocuments.map((doc, index) => (
                  <div key={index} className="space-y-2">
                    <DocumentCard title={doc.title} documentPath={doc.path} />
                    {doc.marks && doc.marks !== 'N/A' && (
                      <div className="text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Marks: {doc.marks}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                Professional Experience
              </h3>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <InfoRow label="Previous Company" value={data?.PREVIOUS_COMPANY} />
                <InfoRow label="Duration" value={data?.DURATION ? `${data.DURATION} months` : 'N/A'} />
                <InfoRow label="Notice Period" value={data?.NOTICE_PERIOD ? `${data.NOTICE_PERIOD} days` : 'N/A'} />
                <InfoRow label="Current CTC" value={data?.CURRENT_CTC ? `₹${data.CURRENT_CTC} LPA` : 'N/A'} valueColor="text-green-600" />
                <InfoRow label="Expected CTC" value={data?.EXP_CTC ? `₹${data.EXP_CTC} LPA` : 'N/A'} valueColor="text-orange-600" />
                <InfoRow label="Offer CTC" value={data?.OFFER_CTC ? `₹${data.OFFER_CTC} LPA` : 'N/A'} valueColor="text-purple-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professionalDocuments.map((doc, index) => (
                  <DocumentCard key={index} title={doc.title} documentPath={doc.path} />
                ))}
              </div>
            </div>

            {/* Verification Status & Remarks */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                Verification Status & Remarks
              </h3>
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
              onClick={() => handleSubmit()}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
            >
              Reject
            </button>
            <button
              onClick={() => handleSubmit()}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 transition-all"
            >
              Verify & Submit
            </button>
          </div>
        </div>
      </div>


      {viewingDoc && (
        <DocumentViewer
          url={viewingDoc}
          name={viewingDocName}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </>
  );
};

export default VerificationDetailsModal;