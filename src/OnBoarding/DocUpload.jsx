import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Building2, MapPin, CheckCircle2, Download, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL, API_BASE_URLss } from '../Config/Config';
const DocUpload = ({ rowData, onClose }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    empId: '',
    designation: '',
    doj: '',
    department: '',
    siteLocation: ''
  });

  // Map API document keys to checklist items
  const [documentChecklist, setDocumentChecklist] = useState([
    { 
      id: 1, 
      name: 'RESUME DULY SIGNED', 
      apiKey: 'resume', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 2, 
      name: 'CANDIDATE APPLICATION FORM', 
      apiKey: 'application_form', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 3, 
      name: 'INTERVIEW EVALUATION SHEET', 
      apiKey: 'interview_sheet', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 4, 
      name: 'EDUCATIONALS TESTIMONIALS', 
      type: 'multiple',
      subItems: [
        { 
          id: '4a', 
          name: 'SSC (10th Certificate)', 
          apiKey: '10th_certi', 
          statusKey: 'Tenth_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '4b', 
          name: 'INTERMEDIATE / ITI / DIPLOMA', 
          apiKey: 'Inter_certi', 
          statusKey: 'Inter_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '4c', 
          name: 'GRADUATION', 
          apiKey: 'Gradu_certi', 
          statusKey: 'Grad_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '4d', 
          name: 'POST GRADUATION', 
          apiKey: 'Pg_certi', 
          statusKey: 'Pg_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '4e', 
          name: 'ANY OTHER CERTIFICATES (Please specify)', 
          apiKey: null,
          statusKey: null,
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        }
      ]
    },
    { 
      id: 5, 
      name: 'DULY SIGNED OFFER LETTER', 
      apiKey: 'offer_letter', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 6, 
      name: 'DULY SIGNED APPOINTMENT LETTER', 
      apiKey: 'appointment_letter', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 7, 
      name: 'EXPERIENCE / RELIEVING LETTERS', 
      type: 'multiple',
      subItems: [
        { 
          id: '7a', 
          name: 'EXPERIENCE LETTER', 
          apiKey: 'Exp_Letter', 
          statusKey: 'Exp_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '7b', 
          name: 'RELIEVING LETTER', 
          apiKey: 'Relieving_Letter', 
          statusKey: null,
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        }
      ]
    },
    { 
      id: 8, 
      name: 'LAST 3 MONTHS PAYSLIPS & BANK STATMENT', 
      apiKey: 'Payslip', 
      statusKey: 'PaySlip_Status',
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 9, 
      name: 'LATEST PASSPORT SIZE COLOUR PHOTOGRAPHS (8 Nos.)', 
      apiKey: 'photos', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 10, 
      name: 'ID & ADDRESS PROOF (PAN & AADHAR CARD)', 
      type: 'multiple',
      subItems: [
        { 
          id: '10a', 
          name: 'PAN CARD', 
          apiKey: 'Pan_certi', 
          statusKey: 'Pan_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        },
        { 
          id: '10b', 
          name: 'AADHAR CARD', 
          apiKey: 'Aadhar_certi', 
          statusKey: 'Aadhr_Status',
          approved: false, 
          fileName: '', 
          filePath: '',
          type: 'single' 
        }
      ]
    },
    { 
      id: 11, 
      name: 'JOINING REPORT', 
      apiKey: 'joining_report', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 12, 
      name: 'CODE OF CONDUCT WITH ATTESTATION', 
      apiKey: 'code_of_conduct', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 13, 
      name: 'PAYMENT OF GRATUITY FORM', 
      apiKey: 'gratuity_form', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 14, 
      name: 'MEDICAL ENROLMENT FORM', 
      apiKey: 'medical_form', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 15, 
      name: 'FORM-16 (IF APPLICABLE)', 
      apiKey: 'form_16', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 16, 
      name: 'NOMINATION AND DECLARATION FORM -2 (EPFO) / ESIC FORM -1', 
      apiKey: 'epfo_form', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 17, 
      name: 'DATA PROTECTION AND PRIVACY POLICY', 
      apiKey: 'privacy_policy', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 18, 
      name: 'EPFO COMPOSITE DECLARATION FORM 11', 
      apiKey: 'epfo_form_11', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 19, 
      name: 'IT DECLARATION FILLED FORM (IF APPLICABLE)', 
      apiKey: 'it_declaration', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    },
    { 
      id: 20, 
      name: 'MEDICAL REPORTS (CBP, CUE & ABO Typing)', 
      apiKey: 'medical_reports', 
      statusKey: null,
      approved: false, 
      fileName: '', 
      filePath: '',
      type: 'single' 
    }
  ]);

  const [viewingPdf, setViewingPdf] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    if (rowData && rowData.fullData) {
      const employeeData = rowData.fullData;

      console.log(employeeData,"emmmmmmmmmmmmmmmmmm");
      
      // Populate form data
      setFormData({
        employeeName: employeeData.name || rowData.employee_name || '',
        empId: employeeData.child_caseid || rowData.CHILD_CASEID || '',
        designation: employeeData.designation || employeeData.DEPT || rowData.department || '',
        doj: employeeData.joiningDate || rowData.joining_date || '',
        department: employeeData.DEPT || rowData.department || '',
        siteLocation: employeeData.location || rowData.location || ''
      });

      console.log(documentChecklist,"ffffffffff666666666666666");


      const normalizeFileUrl = (path) => {
  if (!path || typeof path !== 'string') return '';

  // Already full backend URL
  if (path.startsWith('http')) return path;

  // Relative storage path
  return `${API_BASE_URLss}${path}`;
};


      // Populate document checklist with API data
      if (employeeData.documents) {
        const updatedChecklist = documentChecklist.map(item => {
          // Handle main items
          if (item.type === 'single') {
            const apiDoc = employeeData.documents[item.apiKey];

            console.log(apiDoc,"ttttttttttttttttttttttttttttttttt");
            const status = item.statusKey ? employeeData.documents[item.statusKey] : null;


            
      if (apiDoc && typeof apiDoc === 'string' && apiDoc.includes('/storage/')) {
  const filePath = normalizeFileUrl(apiDoc);


  const fileName = filePath.split('/').pop() || 'Document';



  return {
    ...item,
    fileName,
    filePath,
    approved: status === '1',
    status
  };
}

            return item;
          }
          
          // Handle items with subItems
       if (item.subItems && Array.isArray(item.subItems)) {
  const updatedSubItems = item.subItems.map(subItem => {
    const apiDoc = employeeData?.documents?.[subItem.apiKey];
    const status = subItem.statusKey
      ? employeeData?.documents?.[subItem.statusKey]
      : null;

    if (
      apiDoc &&
      typeof apiDoc === 'string' &&
      apiDoc.includes('/storage/')
    ) {
      const filePath = `${API_BASE_URLss}${apiDoc}`;
      const fileName = apiDoc.split('/').pop() || 'Document';

      return {
        ...subItem,
        fileName,
        filePath,
        approved: status === '1',
        status
      };
    }

    return subItem;
  });

  return {
    ...item,
    subItems: updatedSubItems
  };
}

return item;

          
          return item;
        });

        setDocumentChecklist(updatedChecklist);
      }
    }
  }, [rowData]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    if (status === '1') {
      return (
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-medium">Verified</span>
        </div>
      );
    } else if (status === '0') {
      return (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-700 font-medium">Pending</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 font-medium">Not Uploaded</span>
        </div>
      );
    }
  };

  const handleFileUpload = (itemId, file, subItemId = null) => {
    if (file) {
      const updatedChecklist = documentChecklist.map(item => {
        if (item.id === itemId) {
          if (subItemId && item.subItems) {
            const updatedSubItems = item.subItems.map(subItem => 
              subItem.id === subItemId 
                ? { 
                    ...subItem, 
                    fileName: file.name, 
                    filePath: URL.createObjectURL(file),
                    approved: true 
                  }
                : subItem
            );
            return { ...item, subItems: updatedSubItems };
          }
          return { 
            ...item, 
            fileName: file.name, 
            filePath: URL.createObjectURL(file),
            approved: true 
          };
        }
        return item;
      });
      
      setDocumentChecklist(updatedChecklist);
      
      const fileKey = subItemId ? `${itemId}-${subItemId}` : itemId;
      setUploadedFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  const handleViewDocument = (filePath) => {
    if (filePath) {
      window.open(filePath, '_blank');
    }
  };

  const handleViewPdfInline = (filePath, fileName) => {
    if (filePath) {
      setViewingPdf({ filePath, fileName });
    }
  };

  const handleClosePdfViewer = () => {
    setViewingPdf(null);
  };

  const handleDownloadDocument = (filePath, fileName) => {
    if (filePath) {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  console.log("fffffffffffffff",documentChecklist);
  const handleSaveChanges = async () => {
    // Save logic here
  };

  // PDF Viewer Component
  const PdfViewer = ({ document, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{document.fileName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 p-4">
          <iframe
            src={document.filePath}
            title={document.fileName}
            className="w-full h-full border-0"
          />
        </div>
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={() => handleDownloadDocument(document.filePath, document.fileName)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <div>
              <h2 className="text-xl font-bold">MY HOME CONSTRUCTIONS PVT. LTD.</h2>
              <p className="text-blue-100 text-xs mt-0.5">Employee Documents - {formData.empId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Employee Information */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h3 className="font-bold text-blue-900 text-base mb-3">
              EMPLOYEE INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} />
                  EMPLOYEE NAME:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.employeeName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EMP ID:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.empId}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  DESIGNATION:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.designation}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  DOJ:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.doj ? new Date(formData.doj).toLocaleDateString() : 'Not Set'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  DEPARTMENT:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.department}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  SITE/LOCATION:
                </label>
                <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {formData.siteLocation || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-300 w-16">S.No</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-300">DOCUMENT TYPE</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-300">STATUS</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-300">FILE NAME</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-300">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {documentChecklist.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {/* Main Item Row */}
                      <tr className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 font-semibold text-gray-700 text-sm">{item.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 text-sm">
                          <div className="flex items-center gap-2">
                            {item.name}
                            {item.status === '1' && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3">
                          {item.fileName ? (
                            <span className="text-sm text-gray-600 truncate max-w-[200px] inline-block" title={item.fileName}>
                              {item.fileName}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No file uploaded</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.filePath && item.status === '1' || item.status === '0' ? (
                              <>
                                <button
                                  onClick={() => handleViewDocument(item.filePath)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                                >
                                  <Eye size={14} />
                                  View
                                </button>
                                <button
                                  onClick={() => handleViewPdfInline(item.filePath, item.fileName)}
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs font-medium transition-colors"
                                >
                                  <FileText size={14} />
                                  Preview
                                </button>
                                <button
                                  onClick={() => handleDownloadDocument(item.filePath, item.fileName)}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
                                >
                                  <Download size={14} />
                                  Download
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id={`file-${item.id}`}
                                  onChange={(e) => handleFileUpload(item.id, e.target.files[0])}
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label
                                  htmlFor={`file-${item.id}`}
                                  className="cursor-pointer px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                                >
                                  Upload
                                </label>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Sub Items Rows */}
                      {item.subItems && item.subItems.map((subItem) => (
                        <tr key={subItem.id} className="border-b hover:bg-blue-50 transition-colors bg-blue-50 bg-opacity-30">
                          <td className="px-4 py-2"></td>
                          <td className="px-8 py-2 text-xs text-gray-700">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{subItem.id.slice(-1)})</span> 
                              {subItem.name}
                              {subItem.status === '1' && (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <StatusBadge status={subItem.status} />
                          </td>
                          <td className="px-4 py-2">
                            {subItem.fileName ? (
                              <span className="text-xs text-gray-600 truncate max-w-[200px] inline-block" title={subItem.fileName}>
                                {subItem.fileName}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">No file uploaded</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              {subItem.filePath && subItem.status === '1' ? (
                                <>
                                  <button
                                    onClick={() => handleViewDocument(subItem.filePath)}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                                  >
                                    <Eye size={12} />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleViewPdfInline(subItem.filePath, subItem.fileName)}
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs font-medium transition-colors"
                                  >
                                    <FileText size={12} />
                                    Preview
                                  </button>
                                  <button
                                    onClick={() => handleDownloadDocument(subItem.filePath, subItem.fileName)}
                                    className="flex items-center gap-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
                                  >
                                    <Download size={12} />
                                    Download
                                  </button>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="file"
                                    id={`file-${subItem.id}`}
                                    onChange={(e) => handleFileUpload(item.id, e.target.files[0], subItem.id)}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                  <label
                                    htmlFor={`file-${subItem.id}`}
                                    className="cursor-pointer px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                                  >
                                    Upload
                                  </label>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PdfViewer document={viewingPdf} onClose={handleClosePdfViewer} />
      )}
    </>
  );
};

export default DocUpload;