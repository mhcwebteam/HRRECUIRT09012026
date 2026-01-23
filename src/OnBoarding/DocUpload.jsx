


// import React, { useState, useEffect } from 'react';
// import { X, FileText, Calendar, User, Building2, MapPin, CheckCircle2 } from 'lucide-react';
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { API_BASE_URL } from '../Config/Config';

// const DocUpload = ({ rowData, onClose }) => {
//   // Remove the isOpen state and always show the modal when component is rendered
//   const [formData, setFormData] = useState({
//     employeeName: '',
//     empId: '',
//     designation: '',
//     doj: '',
//     department: '',
//     siteLocation: ''
//   });


//    const [Token, useToken] = useState(() => {
//     const userToken = JSON.parse(localStorage.getItem('userInfo'));
//     return userToken ? userToken : null;
//   })


//   const [checklist, setChecklist] = useState([
//     { id: 1, name: 'RESUME DULY SIGNED', approved: false, fileName: '', type: 'single' },
//     { id: 2, name: 'CANDIDATE APPLICATION FORM', approved: false, fileName: '', type: 'single' },
//     { id: 3, name: 'INTERVIEW EVALUATION SHEET', approved: false, fileName: '', type: 'single' },
//     { 
//       id: 4, 
//       name: 'EDUCATIONALS TESTIMONIALS', 
//       type: 'multiple',
//       subItems: [
//         { id: '4a', name: 'SSC', approved: false, fileName: '' },
//         { id: '4b', name: 'INTERMEDIATE / ITI / DIPLOMA', approved: false, fileName: '' },
//         { id: '4c', name: 'GRADUATION', approved: false, fileName: '' },
//         { id: '4d', name: 'POST GRADUATION', approved: false, fileName: '' },
//         { id: '4e', name: 'ANY OTHER CERTIFICATES (Please specify)', approved: false, fileName: '' }
//       ]
//     },
//     { id: 5, name: 'DULY SIGNED OFFER LETTER', approved: false, fileName: '', type: 'single' },
//     { id: 6, name: 'DULY SIGNED APPOINTMENT LETTER', approved: false, fileName: '', type: 'single' },
//     { id: 7, name: 'EXPERIENCE / RELIEVING LETTERS', approved: false, fileName: '', type: 'single' },
//     { id: 8, name: 'LAST 3 MONTHS PAYSLIPS & BANK STATMENT', approved: false, fileName: '', type: 'single' },
//     { id: 9, name: 'LATEST PASSPORT SIZE COLOUR PHOTOGRAPHS (8 Nos.)', approved: false, fileName: '', type: 'single' },
//     { id: 10, name: 'ID & ADDRESS PROOF (PAN & AADHAR CARD)', approved: false, fileName: '', type: 'single' },
//     { id: 11, name: 'JOINING REPORT', approved: false, fileName: '', type: 'single' },
//     { id: 12, name: 'CODE OF CONDUCT WITH ATTESTATION', approved: false, fileName: '', type: 'single' },
//     { id: 13, name: 'PAYMENT OF GRATUITY FORM', approved: false, fileName: '', type: 'single' },
//     { id: 14, name: 'MEDICAL ENROLMENT FORM', approved: false, fileName: '', type: 'single' },
//     { id: 15, name: 'FORM-16 (IF APPLICABLE)', approved: false, fileName: '', type: 'single' },
//     { id: 16, name: 'NOMINATION AND DECLARATION FORM -2 (EPFO) / ESIC FORM -1', approved: false, fileName: '', type: 'single' },
//     { id: 17, name: 'DATA PROTECTION AND PRIVACY POLICY', approved: false, fileName: '', type: 'single' },
//     { id: 18, name: 'EPFO COMPOSITE DECLARATION FORM 11', approved: false, fileName: '', type: 'single' },
//     { id: 19, name: 'IT DECLARATION FILLED FORM (IF APPLICABLE)', approved: false, fileName: '', type: 'single' },
//     { id: 20, name: 'MEDICAL REPORTS (CBP, CUE & ABO Typing)', approved: false, fileName: '', type: 'single' }
//   ]);

//   // Populate form data when rowData prop changes
//   useEffect(() => {
//     if (rowData) {
//       setFormData({
//         employeeName: rowData.employee_name || '',
//         empId: rowData.CHILD_CASEID || '',
//         designation: rowData.department || '',
//         doj: rowData.joining_date || '',
//         department: rowData.department || '',
//         siteLocation: rowData.location || ''
//       });
//     }
//   }, [rowData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };


//     const joinData = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/emp-verify-data`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": `Bearer ${Token.token}`,
//           },
//         }
//       );

//       console.log(response,"ressssssssssssssssssss12222222222222");
//       const apiData = response.data.data;

//     } catch (error) {
//       console.error("Error in fetching joining data", error);
//     }
//   };

//  useEffect(() => {
//     if (Token.token) {
//       joinData();
//     }
//   }, [Token.token]);




//   const toggleApproval = (itemId, subItemId = null) => {
//     setChecklist(prev => prev.map(item => {
//       if (item.id === itemId) {
//         if (subItemId && item.subItems) {
//           return {
//             ...item,
//             subItems: item.subItems.map(sub => 
//               sub.id === subItemId 
//                 ? { ...sub, approved: !sub.approved }
//                 : sub
//             )
//           };
//         }
//         return {
//           ...item,
//           approved: !item.approved
//         };
//       }
//       return item;
//     }));
//   };

//   const handleRemarksChange = (itemId, value, subItemId = null) => {
//     setChecklist(prev => prev.map(item => {
//       if (item.id === itemId) {
//         if (subItemId && item.subItems) {
//           return {
//             ...item,
//             subItems: item.subItems.map(sub => 
//               sub.id === subItemId 
//                 ? { ...sub, fileName: value, approved: value !== '' }
//                 : sub
//             )
//           };
//         }
//         return {
//           ...item,
//           fileName: value,
//           approved: value !== ''
//         };
//       }
//       return item;
//     }));
//   };

//   const handleFileUpload = (itemId, file, subItemId = null) => {
//     if (file) {
//       handleRemarksChange(itemId, file.name, subItemId);
//     }
//   };

//   const handleSaveChanges = () => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you want to save the changes?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#2563eb',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, save it!',
//       cancelButtonText: 'Cancel'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: 'Saved!',
//           text: 'Changes saved successfully!',
//           icon: 'success',
//           confirmButtonColor: '#2563eb'
//         });
//         // Optionally close the modal after saving
//         // if (onClose) onClose();
//       }
//     });
//   };

//   const handleClose = () => {
//     if (onClose) onClose();
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Modal - Always shown when component is rendered */}
//       <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Building2 size={24} />
//             <div>
//               <h2 className="text-xl font-bold">MY HOME CONSTRUCTIONS PVT. LTD.</h2>
//               <p className="text-blue-100 text-xs mt-0.5">
//                 Employee: {formData.employeeName} | ID: {formData.empId} | Dept: {formData.department}
//               </p>
//               <p className="text-blue-100 text-xs">Employee Checklist - Dir No. ASQPL-HR-F11 | Date: 01st Nov, 2019 | Rev. Version 02</p>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="overflow-y-auto flex-1 p-6">
//           <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
//             <h3 className="font-bold text-blue-900 text-base mb-3">
//               CHECKLIST OF THE DOCUMENTS TO BE MAINTAINED IN THE EMPLOYEE PERSONAL FILE
//             </h3>

//             {/* Employee Information Form */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <User size={16} />
//                   EMPLOYEE NAME:
//                 </label>
//                 <input
//                   type="text"
//                   name="employeeName"
//                   value={formData.employeeName}
//                   onChange={handleInputChange}
//                   placeholder="As per record"
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   EMP ID:
//                 </label>
//                 <input
//                   type="text"
//                   name="empId"
//                   value={formData.empId}
//                   onChange={handleInputChange}
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   DESIGNATION:
//                 </label>
//                 <input
//                   type="text"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleInputChange}
//                   placeholder="As per offer letter"
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <Calendar size={16} />
//                   DOJ:
//                 </label>
//                 <input
//                   type="date"
//                   name="doj"
//                   value={formData.doj}
//                   onChange={handleInputChange}
//                   placeholder="Joining Date"
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   DEPARTMENT:
//                 </label>
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleInputChange}
//                   placeholder="As per offer letter"
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <MapPin size={16} />
//                   SITE/LOCATION:
//                 </label>
//                 <input
//                   type="text"
//                   name="siteLocation"
//                   value={formData.siteLocation}
//                   onChange={handleInputChange}
//                   placeholder="As per offer letter"
//                   className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Documents Checklist Table */}
//           <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
//                     <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300 w-10">S.No</th>
//                     <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300">DOCUMENTS LIST</th>
//                     <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300">UPLOAD FILE</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {checklist.map((item, index) => (
//                     <React.Fragment key={item.id}>
//                       <tr className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                         <td className="px-2 py-1.5 font-semibold text-gray-700 text-xs">{item.id}</td>
//                         <td className="px-2 py-1.5 font-medium text-gray-800 text-xs">{item.name}</td>
//                         <td className="px-2 py-1.5">
//                           {item.type === 'single' && (
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="file"
//                                 id={`file-${item.id}`}
//                                 onChange={(e) => handleFileUpload(item.id, e.target.files[0])}
//                                 className="hidden"
//                               />
//                               <label
//                                 htmlFor={`file-${item.id}`}
//                                 className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
//                               >
//                                 Choose File
//                               </label>
//                               {item.fileName && (
//                                 <span className="text-xs text-gray-600 truncate max-w-[150px]" title={item.fileName}>
//                                   {item.fileName}
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                       {item.subItems && item.subItems.map((subItem) => (
//                         <tr key={subItem.id} className="border-b hover:bg-blue-50 transition-colors bg-blue-50 bg-opacity-30">
//                           <td className="px-2 py-1"></td>
//                           <td className="px-4 py-1 text-xs text-gray-700">
//                             <span className="font-semibold">{subItem.id.slice(-1)})</span> {subItem.name}
//                           </td>
//                           <td className="px-2 py-1">
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="file"
//                                 id={`file-${subItem.id}`}
//                                 onChange={(e) => handleFileUpload(item.id, e.target.files[0], subItem.id)}
//                                 className="hidden"
//                               />
//                               <label
//                                 htmlFor={`file-${subItem.id}`}
//                                 className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
//                               >
//                                 Choose File
//                               </label>
//                               {subItem.fileName && (
//                                 <span className="text-xs text-gray-600 truncate max-w-[150px]" title={subItem.fileName}>
//                                   {subItem.fileName}
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
//           <button
//             onClick={handleClose}
//             className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//           >
//             Close
//           </button>
//           <button
//             onClick={handleSaveChanges}
//             className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
//           >
//             <CheckCircle2 size={18} />
//             Save Checklist
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocUpload;



import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const DocUpload = ({ rowData, onClose }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    empId: '',
    designation: '',
    doj: '',
    department: '',
    siteLocation: ''
  });

  const [checklist, setChecklist] = useState([
    { id: 1, name: 'RESUME DULY SIGNED', approved: false, fileName: '', type: 'single' },
    { id: 2, name: 'CANDIDATE APPLICATION FORM', approved: false, fileName: '', type: 'single' },
    { id: 3, name: 'INTERVIEW EVALUATION SHEET', approved: false, fileName: '', type: 'single' },
    { 
      id: 4, 
      name: 'EDUCATIONALS TESTIMONIALS', 
      type: 'multiple',
      subItems: [
        { id: '4a', name: 'SSC', approved: false, fileName: '' },
        { id: '4b', name: 'INTERMEDIATE / ITI / DIPLOMA', approved: false, fileName: '' },
        { id: '4c', name: 'GRADUATION', approved: false, fileName: '' },
        { id: '4d', name: 'POST GRADUATION', approved: false, fileName: '' },
        { id: '4e', name: 'ANY OTHER CERTIFICATES (Please specify)', approved: false, fileName: '' }
      ]
    },
    { id: 5, name: 'DULY SIGNED OFFER LETTER', approved: false, fileName: '', type: 'single' },
    { id: 6, name: 'DULY SIGNED APPOINTMENT LETTER', approved: false, fileName: '', type: 'single' },
    { id: 7, name: 'EXPERIENCE / RELIEVING LETTERS', approved: false, fileName: '', type: 'single' },
    { id: 8, name: 'LAST 3 MONTHS PAYSLIPS & BANK STATMENT', approved: false, fileName: '', type: 'single' },
    { id: 9, name: 'LATEST PASSPORT SIZE COLOUR PHOTOGRAPHS (8 Nos.)', approved: false, fileName: '', type: 'single' },
    { id: 10, name: 'ID & ADDRESS PROOF (PAN & AADHAR CARD)', approved: false, fileName: '', type: 'single' },
    { id: 11, name: 'JOINING REPORT', approved: false, fileName: '', type: 'single' },
    { id: 12, name: 'CODE OF CONDUCT WITH ATTESTATION', approved: false, fileName: '', type: 'single' },
    { id: 13, name: 'PAYMENT OF GRATUITY FORM', approved: false, fileName: '', type: 'single' },
    { id: 14, name: 'MEDICAL ENROLMENT FORM', approved: false, fileName: '', type: 'single' },
    { id: 15, name: 'FORM-16 (IF APPLICABLE)', approved: false, fileName: '', type: 'single' },
    { id: 16, name: 'NOMINATION AND DECLARATION FORM -2 (EPFO) / ESIC FORM -1', approved: false, fileName: '', type: 'single' },
    { id: 17, name: 'DATA PROTECTION AND PRIVACY POLICY', approved: false, fileName: '', type: 'single' },
    { id: 18, name: 'EPFO COMPOSITE DECLARATION FORM 11', approved: false, fileName: '', type: 'single' },
    { id: 19, name: 'IT DECLARATION FILLED FORM (IF APPLICABLE)', approved: false, fileName: '', type: 'single' },
    { id: 20, name: 'MEDICAL REPORTS (CBP, CUE & ABO Typing)', approved: false, fileName: '', type: 'single' }
  ]);

  // Populate form data from row data when component mounts
  useEffect(() => {
    if (rowData) {
      setFormData({
        employeeName: rowData.employee_name || '',
        empId: rowData.CHILD_CASEID || '',
        designation: rowData.department|| '',
        doj: rowData.joining_date || '',
        department: rowData.department || '',
        siteLocation: rowData.location || ''
      });
    }
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemarksChange = (itemId, value, subItemId = null) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) {
        if (subItemId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.map(sub => 
              sub.id === subItemId 
                ? { ...sub, fileName: value, approved: value !== '' }
                : sub
            )
          };
        }
        return {
          ...item,
          fileName: value,
          approved: value !== ''
        };
      }
      return item;
    }));
  };

  const handleFileUpload = (itemId, file, subItemId = null) => {
    if (file) {
      handleRemarksChange(itemId, file.name, subItemId);
    }
  };

  const handleSaveChanges = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save the changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal-high-z-index'
      },
      didOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          swalContainer.style.zIndex = '10000';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you can add your API call to save the data
        
        Swal.fire({
          title: 'Saved!',
          text: 'Changes saved successfully!',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          didOpen: () => {
            const swalContainer = document.querySelector('.swal2-container');
            if (swalContainer) {
              swalContainer.style.zIndex = '10000';
            }
          }
        }).then(() => {
          // Close modal after successful save
          if (onClose) {
            onClose();
          }
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Building2 size={24} />
          <div>
            <h2 className="text-xl font-bold">MY HOME CONSTRUCTIONS PVT. LTD.</h2>
            <p className="text-blue-100 text-xs mt-0.5">Employee Checklist - Dir No. ASQPL-HR-F11 | Date: 01st Nov, 2019 | Rev. Version 02</p>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="overflow-y-auto flex-1 p-6">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <h3 className="font-bold text-blue-900 text-base mb-3">
            CHECKLIST OF THE DOCUMENTS TO BE MAINTAINED IN THE EMPLOYEE PERSONAL FILE
          </h3>

          {/* Employee Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                EMPLOYEE NAME:
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="As per record"
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                EMP ID:
              </label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DESIGNATION:
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="As per offer letter"
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                DOJ:
              </label>
              <input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleInputChange}
                placeholder="Joining Date"
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DEPARTMENT:
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="As per offer letter"
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                SITE/LOCATION:
              </label>
              <input
                type="text"
                name="siteLocation"
                value={formData.siteLocation}
                onChange={handleInputChange}
                placeholder="As per offer letter"
                className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Documents Checklist Table */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300 w-10">S.No</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300">DOCUMENTS LIST</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-700 border-b-2 border-gray-300">UPLOAD FILE</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-2 py-1.5 font-semibold text-gray-700 text-xs">{item.id}</td>
                      <td className="px-2 py-1.5 font-medium text-gray-800 text-xs">{item.name}</td>
                      <td className="px-2 py-1.5">
                        {item.type === 'single' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id={`file-${item.id}`}
                              onChange={(e) => handleFileUpload(item.id, e.target.files[0])}
                              className="hidden"
                            />
                            <label
                              htmlFor={`file-${item.id}`}
                              className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Choose File
                            </label>
                            {item.fileName && (
                              <span className="text-xs text-gray-600 truncate max-w-[150px]" title={item.fileName}>
                                {item.fileName}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    {item.subItems && item.subItems.map((subItem) => (
                      <tr key={subItem.id} className="border-b hover:bg-blue-50 transition-colors bg-blue-50 bg-opacity-30">
                        <td className="px-2 py-1"></td>
                        <td className="px-4 py-1 text-xs text-gray-700">
                          <span className="font-semibold">{subItem.id.slice(-1)})</span> {subItem.name}
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id={`file-${subItem.id}`}
                              onChange={(e) => handleFileUpload(item.id, e.target.files[0], subItem.id)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`file-${subItem.id}`}
                              className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Choose File
                            </label>
                            {subItem.fileName && (
                              <span className="text-xs text-gray-600 truncate max-w-[150px]" title={subItem.fileName}>
                                {subItem.fileName}
                              </span>
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
          Save Checklist
        </button>
      </div>
    </div>
  );
};

export default DocUpload;