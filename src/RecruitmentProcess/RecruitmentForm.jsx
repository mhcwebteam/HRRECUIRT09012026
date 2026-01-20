// import React, { useContext, useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import {
//   Upload,
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   BookOpen,
//   Award
// } from 'lucide-react';
// import axios from 'axios';
// import { API_BASE_URL } from "../Config/Config"
// import { ContextData } from '../Context/ContextData';
// import { useParams } from 'react-router-dom';

// const RecruitmentForm = () => {
//   const {case_Id} = useParams();
//  const  { HrData} = useContext(ContextData);
//   const [formData, setFormData] = useState({
//     CHILD_CASEID: "",
//     PLANT: "",
//     NAME: '',
//     EMAIL: '',
//     PHONE_NUMBER: '',
//     DOB: '',
//     DEPT: '',
//     ADDRESS: '',
//     AADHAR_NUM: '',
//     PAN_NUM: '',
//     SSC_MARKS: '',
//     INTER_MARKS: '',
//     BTECH_MARKS: '',
//     PG_MARKS: '',
//     CURRENT_CTC: '',
//     EXP_CTC: '',
//     OFFER_CTC: '',
//     NOTICE_PERIOD: '',
//     PREVIOUS_COMPANY: '',
//     DURATION: '',
    
//     AADHAR_PATH: null,
//     PAN_PATH: null,
//    '10TH_FILENAME': null,
//     INTER_FILENAME: null,
//     BTECH_FILENAME: null,
//     PG_FILENAME: null,
//     PHOTO: null,
//     EXP_LETTER: null,
//     RELIEVING_LETTER: '',
//     PAYSLIPS: ""
//   });

//   const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name,"nameddddddddd", value)
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   useEffect(() => {
//     if (HrData && HrData.length > 0 && case_Id) {
//       var hr = HrData.find((ele) => ele.CHILD_CASEID === case_Id);
//       if (hr) {
//         setFormData((prev) => ({
//           ...prev,
//           PLANT: hr.PLANT || "",
//           CHILD_CASEID: hr.CHILD_CASEID || case_Id,
//           DEPT: hr.DEPT 
//         }));
//       }
//     }
//   }, [HrData, case_Id]);

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === 'PAYSLIPS') {
//       setFormData(prev => ({
//         ...prev,
//         PAYSLIPS: [...files]
//       }));
//     } 
//    else 
//     {
//      setFormData(prev => ({
//         ...prev,
//         [name]: files[0]
//       }));
//    }
//   };
// //Validation Errors----
// const validateForm = () => {
//   const errors = {};
//   // ===== REQUIRED TEXT FIELDS =====
//   const requiredFields = [
//     "NAME",
//     "EMAIL",
//     "PHONE_NUMBER",
//     "DOB",
//     "ADDRESS",
//     "AADHAR_NUM",
//     "PAN_NUM",
//   ];

//   requiredFields.forEach((field) => {
//     if (!formData[field] || formData[field].toString().trim() === "") {
//       errors[field] = `${field.replace("_", " ")} is required`;
//     }
//   });

//   // ===== EMAIL =====
//   if (formData.EMAIL && !/^\S+@\S+\.\S+$/.test(formData.EMAIL)) {
//     errors.EMAIL = "Invalid email format";
//   }

//   // ===== PHONE =====
//   if (formData.PHONE_NUMBER && formData.PHONE_NUMBER.length !== 10) {
//     errors.PHONE_NUMBER = "Phone number must be 10 digits";
//   }

//   // ===== AADHAAR =====
//   if (formData.AADHAR_NUM && formData.AADHAR_NUM.length !== 12) {
//     errors.AADHAR_NUM = "Aadhaar must be 12 digits";
//   }

//   // ===== PAN =====
//   // if (
//   //   formData.PAN_NUM &&
//   //   !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.PAN_NUM)
//   // ) {
//   //   errors.PAN_NUM = "Invalid PAN format";
//   // }

//   // ===== NUMERIC FIELDS =====
//   const numericFields = [
//     "SSC_MARKS",
//     "INTER_MARKS",
//     "BTECH_MARKS",
//     "PG_MARKS",
//     "CURRENT_CTC",
//     "EXP_CTC",
//     "NOTICE_PERIOD",
//     "DURATION",
//   ];

//   numericFields.forEach((field) => {
//     if (formData[field] && isNaN(formData[field])) {
//       errors[field] = `${field.replace("_", " ")} must be numeric`;
//     }
//   });

//   // ===== REQUIRED FILES =====
//   const requiredFiles = ["AADHAR_PATH", "PAN_PATH", "PHOTO"];

//   requiredFiles.forEach((file) => {
//     if (!formData[file]) {
//       errors[file] = `${file.replace("_", " ")} is required`;
//     }
//   });

//   return errors;
// };


//   const handleSubmit = async (e) => {
//     //alert(e.target.value);
//     //console.log("FormData:::::",formData);
//   e.preventDefault();

//   // 🔥 TEST CHECK
//   console.log("Submit clicked");

//   //const errors = validateForm();

//   // ❌ STOP IF VALIDATION FAILS
//   // if (Object.keys(errors).length > 0) {
//   //   await Swal.fire({
//   //     title: "Validation Errors",
//   //     html: `<ul style="text-align:left">
//   //       ${Object.values(errors).map(err => `<li>• ${err}</li>`).join("")}
//   //     </ul>`,
//   //     icon: "error",
//   //   });
//   //   return;
//   // }

//   // ✅ CONFIRMATION
//   const confirm = await Swal.fire({
//     title: "Are you sure?",
//     text: "You want to submit this form",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, Submit",
//     cancelButtonText: "Cancel",
//     confirmButtonColor: "#2563eb",
//   });

//   if (!confirm.isConfirmed) return;

//   try {
//     const data = new FormData();

//     // ===== APPEND ALL FIELDS =====
//     Object.entries(formData).forEach(([key, value]) => {
//       if (!value) return;

//       if (value instanceof File) 
//       {
//         data.append(key, value);
//       } 
//       else if (Array.isArray(value)) {
//         value.forEach((file) => {
//           if (file instanceof File) {
//             data.append(key, file);
//           }
//         });
//       } 
//       else {
//         data.append(key, String(value));
//       }
//     });
//     console.log("Data::::::",data);
//     const response = await axios.post(
//       `${API_BASE_URL}/recruitStore`,
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken.token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     if (response.data.success) {
//       await Swal.fire({
//         title: "Success",
//         text: "Data saved successfully",
//         icon: "success",
//       });
//       resetForm();
//     } else {
//       await Swal.fire("Failed", response.data.message, "error");
//     }
//   } catch (error) {
//     console.error(error);
//     await Swal.fire(
//       "Error",
//       error.response?.data?.message || "Something went wrong",
//       "error"
//     );
//   }
// };



//   const resetForm = () => {
//     setFormData({
//       CHILD_CASEID: '',
//       PLANT: '',
//       NAME: '',
//       EMAIL: '',
//       PHONE_NUMBER: '',
//       DOB: '',
//       DEPT: '',
//       ADDRESS: '',
//       AADHAR_NUM: '',
//       PAN_NUM: '',
//       SSC_MARKS: '',
//       INTER_MARKS: '',
//       BTECH_MARKS: '',
//       PG_MARKS: '',
//       CURRENT_CTC: '',
//       EXP_CTC: '',
//       OFFER_CTC: '',
//       NOTICE_PERIOD: '',
//       PREVIOUS_COMPANY: '',
//       DURATION: '',
//       AADHAR_PATH: null,
//       PAN_PATH: null,
//       '10TH_FILENAME': null,
//       INTER_FILENAME: null,
//       BTECH_FILENAME: null,
//       PG_FILENAME: null,
//       PHOTO: null,
//       EXP_LETTER: null,
//       RELIEVING_LETTER: null,
//       PAYSLIPS: []
//     });
//   };

//   return (
//     <div className="max-w-7xl w-full mx-auto p-10 
//                 rounded-3xl shadow-2xl 
//                 border border-gray-300 
//                 bg-gradient-to-br from-pink-100 via-gray-50 to-gray-100">
//       <div className="max-w-6xl mx-auto">
//   <form onSubmit={handleSubmit} className="space-y-8">
//   {/* ================= BASIC INFORMATION ================= */}
//   <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
//     <h2 className="text-xl font-bold mb-6">Basic Information</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <InputField
//         label="Child Case ID"
//         name="CHILD_CASEID"
//         value={formData.CHILD_CASEID}
//         onChange={handleInputChange}
//         disabled
//       />

//       <InputField
//         label="Plant"
//         name="PLANT"
//         value={formData.PLANT}
//         onChange={handleInputChange}
//         disabled
//       />

//       <InputField
//         label="Department"
//         name="DEPT"
//         value={formData.DEPT}
//         onChange={handleInputChange}
//         disabled
//       />

//       <InputField
//         label="Full Name"
//         name="NAME"
//         value={formData.NAME}
//         onChange={handleInputChange}
//         required
//       />

//       <InputField
//         label="Email"
//         name="EMAIL"
//         type="email"
//         value={formData.EMAIL}
//         onChange={handleInputChange}
//         required
//       />

//       <InputField
//         label="Phone Number"
//         name="PHONE_NUMBER"
//         value={formData.PHONE_NUMBER}
//         maxLength={10}
//         onChange={(e) => {
//           const val = e.target.value.replace(/\D/g, "");
//           if (val.length <= 10) {
//             handleInputChange({
//               target: { name: "PHONE_NUMBER", value: val },
//             });
//           }
//         }}
//         required
//       />

//       <InputField
//         label="Date of Birth"
//         name="DOB"
//         type="date"
//         value={formData.DOB}
//         onChange={handleInputChange}
//         required
//       />

//       <InputField
//         label="Aadhaar Number"
//         name="AADHAR_NUM"
//         value={formData.AADHAR_NUM}
//         onChange={(e) => {
//           const val = e.target.value.replace(/\D/g, "");
//           if (val.length <= 12) {
//             handleInputChange({
//               target: { name: "AADHAR_NUM", value: val },
//             });
//           }
//         }}
//         required
//       />

//       <InputField
//         label="PAN Number"
//         name="PAN_NUM"
//         value={formData.PAN_NUM}
//         onChange={(e) => {
//           const val = e.target.value.toUpperCase();
//           if (val.length <= 10) {
//             handleInputChange({
//               target: { name: "PAN_NUM", value: val },
//             });
//           }
//         }}
//         required
//       />
//     </div>

//     <div className="mt-4">
//       <label className="text-sm font-medium">Address *</label>
//       <textarea
//         name="ADDRESS"
//         value={formData.ADDRESS}
//         onChange={handleInputChange}
//         rows={3}
//         className="w-full border rounded-md px-3 py-2"
//         required
//       />
//     </div>

//     <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//       <FileUpload label="Aadhaar Card" name="AADHAR_PATH" onChange={handleFileChange} />
//       <FileUpload label="PAN Card" name="PAN_PATH" onChange={handleFileChange} />
//       <FileUpload label="Photo" name="PHOTO" onChange={handleFileChange} />
//     </div>
//   </div>

//   {/* ================= EDUCATION DETAILS ================= */}
//   <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-500">
//     <h2 className="text-xl font-bold mb-6">Education Details</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       <InputField label="SSC Marks" name="SSC_MARKS" type="number" value={formData.SSC_MARKS} onChange={handleInputChange} />
//       <InputField label="Inter Marks" name="INTER_MARKS" type="number" value={formData.INTER_MARKS} onChange={handleInputChange} />
//       <InputField label="B.Tech Marks" name="BTECH_MARKS" type="number" value={formData.BTECH_MARKS} onChange={handleInputChange} />
//       <InputField label="PG Marks" name="PG_MARKS" type="number" value={formData.PG_MARKS} onChange={handleInputChange} />
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//       <FileUpload label="10th Marksheet" name="10TH_FILENAME" onChange={handleFileChange} />
//       <FileUpload label="Inter Marksheet" name="INTER_FILENAME" onChange={handleFileChange} />
//       <FileUpload label="Degree" name="BTECH_FILENAME" onChange={handleFileChange} />
//       <FileUpload label="PG Certificate" name="PG_FILENAME" onChange={handleFileChange} />
//     </div>
//   </div>

//   {/* ================= EXPERIENCE ================= */}
//   <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
//     <h2 className="text-xl font-bold mb-6">Experience & Salary</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <InputField label="Previous Company" name="PREVIOUS_COMPANY" value={formData.PREVIOUS_COMPANY} onChange={handleInputChange} />
//       <InputField label="Duration (Months)" name="DURATION" type="number" value={formData.DURATION} onChange={handleInputChange} />
//       <InputField label="Current CTC" name="CURRENT_CTC" type="number" value={formData.CURRENT_CTC} onChange={handleInputChange} />
//       <InputField label="Expected CTC" name="EXP_CTC" type="number" value={formData.EXP_CTC} onChange={handleInputChange} />
//       <InputField label="Notice Period (Days)" name="NOTICE_PERIOD" type="number" value={formData.NOTICE_PERIOD} onChange={handleInputChange} />
//     </div>

//     <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//       <FileUpload label="Experience Letter" name="EXP_LETTER" onChange={handleFileChange} />
//       <FileUpload label="Relieving Letter" name="RELIEVING_LETTER" onChange={handleFileChange} />
//       <FileUpload label="Payslips" name="PAYSLIPS" onChange={handleFileChange} />
//     </div>
//   </div>

//   {/* ================= ACTION BUTTONS ================= */}
//   <div className="flex justify-end gap-4">
//     <button
//       type="button"
//       onClick={resetForm}
//       className="px-6 py-3 bg-gray-200 rounded-md"
//     >
//       Reset
//     </button>

//     <button
//       type="submit"
//       className="px-8 py-3 bg-blue-600 text-white rounded-md"
//     >
//       Submit Form
//     </button>
//   </div>

// </form>

//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, name, type, value, onChange, required, disabled = false }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
//         }`}
//       required={required}
//     />
//   </div>
// );

// const FileUpload = ({ label, name, onChange, multiple = false }) => {
//   const [fileName, setFileName] = useState('No file chosen');

//   const handleChange = (e) => {
//     setFileName(e.target.files?.length > 0 ? `${e.target.files.length} file(s) selected` : 'No file chosen');
//     onChange(e);
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//       <label className="flex items-center gap-2 cursor-pointer">
//         <input
//           type="file"
//           name={name}
//           accept="application/pdf,image/*"
//           onChange={handleChange}
//           multiple={multiple}
//           className="hidden"
//         />
//         <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">
//           Choose File
//         </span>
//         <span className="text-gray-600">{fileName}</span>
//       </label>
//     </div>
//   );
// }

// export default RecruitmentForm;


import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Upload, User, Mail, Phone, Briefcase, BookOpen, Award } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../Config/Config"
import { ContextData } from '../Context/ContextData';
import { useParams } from 'react-router-dom';

const RecruitmentForm = () => {
  const { case_Id } = useParams();
  const { HrData } = useContext(ContextData);
  const [formData, setFormData] = useState({
    CHILD_CASEID: "",
    PLANT: "",
    NAME: '',
    EMAIL: '',
    PHONE_NUMBER: '',
    DOB: '',
    DEPT: '',
    ADDRESS: '',
    AADHAR_NUM: '',
    PAN_NUM: '',
    SSC_MARKS: '',
    INTER_MARKS: '',
    BTECH_MARKS: '',
    PG_MARKS: '',
    CURRENT_CTC: '',
    EXP_CTC: '',
    OFFER_CTC: '',
    NOTICE_PERIOD: '',
    PREVIOUS_COMPANY: '',
    DURATION: '',

    AADHAR_PATH: null,
    PAN_PATH: null,
    '10TH_FILENAME': null,
    INTER_FILENAME: null,
    BTECH_FILENAME: null,
    PG_FILENAME: null,
    PHOTO: null,
    EXP_LETTER: null,
    RELIEVING_LETTER: '',
    PAYSLIPS: ""
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "nameddddddddd", value)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (showErrors && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    if (HrData && HrData.length > 0 && case_Id) {
      var hr = HrData.find((ele) => ele.CHILD_CASEID === case_Id);
      if (hr) {
        setFormData((prev) => ({
          ...prev,
          PLANT: hr.PLANT || "",
          CHILD_CASEID: hr.CHILD_CASEID || case_Id,
          DEPT: hr.DEPT
        }));
      }
    }
  }, [HrData, case_Id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (showErrors && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    const maxSizeRegular = 2 * 1024 * 1024; // 2MB
    const maxSizePayslips = 4 * 1024 * 1024; // 4MB

    if (name === 'PAYSLIPS') {
      const validFiles = [];
      const invalidFiles = [];

      Array.from(files).forEach(file => {
        if (file.type !== 'application/pdf') {
          invalidFiles.push(`${file.name} - Only PDF files are allowed`);
          return;
        }

        if (file.size > maxSizePayslips) {
          invalidFiles.push(`${file.name} - File size must be less than 4MB`);
          return;
        }

        validFiles.push(file);
      });

      if (invalidFiles.length > 0) {
        Swal.fire({
          title: "Invalid Files",
          html: `<ul style="text-align:left">${invalidFiles.map(err => `<li>• ${err}</li>`).join("")}</ul>`,
          icon: "error",
        });
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        PAYSLIPS: validFiles
      }));
    } else {
      const file = files[0];

      if (!file) return;

      if (file.type !== 'application/pdf') {
        Swal.fire({
          title: "Invalid File Type",
          text: "Only PDF files are allowed",
          icon: "error",
        });
        e.target.value = '';
        return;
      }

      if (file.size > maxSizeRegular) {
        Swal.fire({
          title: "File Too Large",
          text: "File size must be less than 2MB",
          icon: "error",
        });
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NAME || formData.NAME.trim() === "") {
      newErrors.NAME = "Full Name is required";
    }

    if (!formData.EMAIL || formData.EMAIL.trim() === "") {
      newErrors.EMAIL = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.EMAIL)) {
      newErrors.EMAIL = "Invalid email format";
    }

    if (!formData.PHONE_NUMBER || formData.PHONE_NUMBER.trim() === "") {
      newErrors.PHONE_NUMBER = "Phone Number is required";
    } else if (formData.PHONE_NUMBER.length !== 10) {
      newErrors.PHONE_NUMBER = "Phone number must be 10 digits";
    }

    if (!formData.DOB || formData.DOB.trim() === "") {
      newErrors.DOB = "Date of Birth is required";
    }

    if (!formData.ADDRESS || formData.ADDRESS.trim() === "") {
      newErrors.ADDRESS = "Address is required";
    }

    if (!formData.AADHAR_NUM || formData.AADHAR_NUM.trim() === "") {
      newErrors.AADHAR_NUM = "Aadhaar Number is required";
    } else if (formData.AADHAR_NUM.length !== 12) {
      newErrors.AADHAR_NUM = "Aadhaar must be 12 digits";
    }

    if (!formData.PAN_NUM || formData.PAN_NUM.trim() === "") {
      newErrors.PAN_NUM = "PAN Number is required";
    }

    if (!formData.AADHAR_PATH) {
      newErrors.AADHAR_PATH = "Aadhaar Card is required";
    }
    if (!formData.PAN_PATH) {
      newErrors.PAN_PATH = "PAN Card is required";
    }
    if (!formData.PHOTO) {
      newErrors.PHOTO = "Photo is required";
    }

    if (!formData.SSC_MARKS || formData.SSC_MARKS.toString().trim() === "") {
      newErrors.SSC_MARKS = "SSC Marks is required";
    }
    if (!formData.INTER_MARKS || formData.INTER_MARKS.toString().trim() === "") {
      newErrors.INTER_MARKS = "Inter Marks is required";
    }
    if (!formData.BTECH_MARKS || formData.BTECH_MARKS.toString().trim() === "") {
      newErrors.BTECH_MARKS = "B.tech/Degree Marks is required";
    }

    if (!formData['10TH_FILENAME']) {
      newErrors['10TH_FILENAME'] = "10th Marksheet is required";
    }
    if (!formData.INTER_FILENAME) {
      newErrors.INTER_FILENAME = "Inter Marksheet is required";
    }
    if (!formData.BTECH_FILENAME) {
      newErrors.BTECH_FILENAME = "B.tech/Degree is required";
    }

    if (!formData.PREVIOUS_COMPANY || formData.PREVIOUS_COMPANY.trim() === "") {
      newErrors.PREVIOUS_COMPANY = "Previous Company is required";
    }
    if (!formData.DURATION || formData.DURATION.toString().trim() === "") {
      newErrors.DURATION = "Duration is required";
    }
    if (!formData.CURRENT_CTC || formData.CURRENT_CTC.toString().trim() === "") {
      newErrors.CURRENT_CTC = "Current CTC is required";
    }
    if (!formData.EXP_CTC || formData.EXP_CTC.toString().trim() === "") {
      newErrors.EXP_CTC = "Expected CTC is required";
    }
    if (!formData.NOTICE_PERIOD || formData.NOTICE_PERIOD.toString().trim() === "") {
      newErrors.NOTICE_PERIOD = "Notice Period is required";
    }

    if (!formData.EXP_LETTER) {
      newErrors.EXP_LETTER = "Experience Letter is required";
    }
    if (!formData.RELIEVING_LETTER) {
      newErrors.RELIEVING_LETTER = "Relieving Letter is required";
    }
    if (!formData.PAYSLIPS || (Array.isArray(formData.PAYSLIPS) && formData.PAYSLIPS.length === 0)) {
      newErrors.PAYSLIPS = "Pay Slips is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      await Swal.fire({
        title: "Validation Error",
        text: "Please fill all the required fields correctly",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });

      setShowErrors(true);
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to submit this form",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
    });

    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (!value) return;

        if (value instanceof File) {
          data.append(key, value);
        }
        else if (Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              data.append(key, file);
            }
          });
        }
        else {
          data.append(key, String(value));
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/recruitStore`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userToken.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Success",
          text: "Data saved successfully",
          icon: "success",
        });
        resetForm();
      } else {
        await Swal.fire("Failed", response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      await Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      CHILD_CASEID: '',
      PLANT: '',
      NAME: '',
      EMAIL: '',
      PHONE_NUMBER: '',
      DOB: '',
      DEPT: '',
      ADDRESS: '',
      AADHAR_NUM: '',
      PAN_NUM: '',
      SSC_MARKS: '',
      INTER_MARKS: '',
      BTECH_MARKS: '',
      PG_MARKS: '',
      CURRENT_CTC: '',
      EXP_CTC: '',
      OFFER_CTC: '',
      NOTICE_PERIOD: '',
      PREVIOUS_COMPANY: '',
      DURATION: '',
      AADHAR_PATH: null,
      PAN_PATH: null,
      '10TH_FILENAME': null,
      INTER_FILENAME: null,
      BTECH_FILENAME: null,
      PG_FILENAME: null,
      PHOTO: null,
      EXP_LETTER: null,
      RELIEVING_LETTER: null,
      PAYSLIPS: []
    });
    setErrors({});
    setShowErrors(false);
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-4 rounded-lg shadow-lg border border-gray-200 bg-gradient-to-br from-pink-50 via-gray-50 to-gray-50">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================= BASIC INFORMATION ================= */}
          <div className="bg-white rounded-md shadow p-4 border-l-4 border-blue-500">
            <h2 className="text-lg font-bold mb-3">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputField
                label="Child Case ID"
                name="CHILD_CASEID"
                value={formData.CHILD_CASEID}
                onChange={handleInputChange}
                disabled
              />

              <InputField
                label="Plant"
                name="PLANT"
                value={formData.PLANT}
                onChange={handleInputChange}
                disabled
              />

              <InputField
                label="Department"
                name="DEPT"
                value={formData.DEPT}
                onChange={handleInputChange}
                disabled
              />

              <InputField
                label={<>Full Name <span className="text-red-500">*</span></>}
                name="NAME"
                value={formData.NAME}
                onChange={handleInputChange}
                error={showErrors ? errors.NAME : ''}
              />

              <InputField
                label={<>Email <span className="text-red-500">*</span></>}
                name="EMAIL"
                type="email"
                value={formData.EMAIL}
                onChange={handleInputChange}
                error={showErrors ? errors.EMAIL : ''}
              />

              <InputField
                label={<>Phone Number <span className="text-red-500">*</span></>}
                name="PHONE_NUMBER"
                value={formData.PHONE_NUMBER}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    handleInputChange({
                      target: { name: "PHONE_NUMBER", value: val },
                    });
                  }
                }}
                error={showErrors ? errors.PHONE_NUMBER : ''}
              />

              <InputField
                label={<>Date of Birth <span className="text-red-500">*</span></>}
                name="DOB"
                type="date"
                value={formData.DOB}
                onChange={handleInputChange}
                error={showErrors ? errors.DOB : ''}
              />

              <InputField
                label={<>Aadhaar Number <span className="text-red-500">*</span></>}
                name="AADHAR_NUM"
                value={formData.AADHAR_NUM}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 12) {
                    handleInputChange({
                      target: { name: "AADHAR_NUM", value: val },
                    });
                  }
                }}
                error={showErrors ? errors.AADHAR_NUM : ''}
              />

              <InputField
                label={<>PAN Number <span className="text-red-500">*</span></>}
                name="PAN_NUM"
                value={formData.PAN_NUM}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (val.length <= 10) {
                    handleInputChange({
                      target: { name: "PAN_NUM", value: val },
                    });
                  }
                }}
                error={showErrors ? errors.PAN_NUM : ''}
              />

              {/* ✅ Address NEXT to PAN */}
              <div className="lg:col-span-2 md:col-span-2 col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="ADDRESS"
                  value={formData.ADDRESS}
                  onChange={handleInputChange}
                  rows={2}
                  className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${showErrors && errors.ADDRESS ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {showErrors && errors.ADDRESS && (
                  <p className="text-red-500 text-xs mt-1">{errors.ADDRESS}</p>
                )}
              </div>
            </div>


            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <FileUpload
                label={<>Aadhaar Card <span className="text-red-500">*</span></>}
                name="AADHAR_PATH"
                onChange={handleFileChange}
                error={showErrors ? errors.AADHAR_PATH : ''}
              />
              <FileUpload
                label={<>PAN Card <span className="text-red-500">*</span></>}
                name="PAN_PATH"
                onChange={handleFileChange}
                error={showErrors ? errors.PAN_PATH : ''}
              />
              <FileUpload
                label={<>Photo <span className="text-red-500">*</span></>}
                name="PHOTO"
                onChange={handleFileChange}
                error={showErrors ? errors.PHOTO : ''}
              />
            </div>
          </div>

          {/* ================= EDUCATION DETAILS ================= */}
          <div className="bg-white rounded-md shadow p-4 border-l-4 border-purple-500">
            <h2 className="text-lg font-bold mb-3">Education Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <InputField
                label={<>SSC Marks <span className="text-red-500">*</span></>}
                name="SSC_MARKS"
                type="number"
                value={formData.SSC_MARKS}
                onChange={handleInputChange}
                error={showErrors ? errors.SSC_MARKS : ''}
              />
              <InputField
                label={<>Inter Marks <span className="text-red-500">*</span></>}
                name="INTER_MARKS"
                type="number"
                value={formData.INTER_MARKS}
                onChange={handleInputChange}
                error={showErrors ? errors.INTER_MARKS : ''}
              />
              <InputField
                label={<>B.tech/Degree Marks <span className="text-red-500">*</span></>}
                name="BTECH_MARKS"
                type="number"
                value={formData.BTECH_MARKS}
                onChange={handleInputChange}
                error={showErrors ? errors.BTECH_MARKS : ''}
              />
              <InputField
                label="PG Marks"
                name="PG_MARKS"
                type="number"
                value={formData.PG_MARKS}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FileUpload
                label={<>10th Marksheet <span className="text-red-500">*</span></>}
                name="10TH_FILENAME"
                onChange={handleFileChange}
                error={showErrors ? errors['10TH_FILENAME'] : ''}
              />
              <FileUpload
                label={<>Inter Marksheet <span className="text-red-500">*</span></>}
                name="INTER_FILENAME"
                onChange={handleFileChange}
                error={showErrors ? errors.INTER_FILENAME : ''}
              />
              <FileUpload
                label={<>B.tech/Degree <span className="text-red-500">*</span></>}
                name="BTECH_FILENAME"
                onChange={handleFileChange}
                error={showErrors ? errors.BTECH_FILENAME : ''}
              />
              <FileUpload
                label="PG Certificate"
                name="PG_FILENAME"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* ================= EXPERIENCE ================= */}
          <div className="bg-white rounded-md shadow p-4 border-l-4 border-green-500">
            <h2 className="text-lg font-bold mb-3">Experience & Salary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputField
                label={<>Previous Company <span className="text-red-500">*</span></>}
                name="PREVIOUS_COMPANY"
                value={formData.PREVIOUS_COMPANY}
                onChange={handleInputChange}
                error={showErrors ? errors.PREVIOUS_COMPANY : ''}
              />
              <InputField
                label={<>Duration (Months) <span className="text-red-500">*</span></>}
                name="DURATION"
                type="number"
                value={formData.DURATION}
                onChange={handleInputChange}
                error={showErrors ? errors.DURATION : ''}
              />
              <InputField
                label={<>Current CTC <span className="text-red-500">*</span></>}
                name="CURRENT_CTC"
                type="number"
                value={formData.CURRENT_CTC}
                onChange={handleInputChange}
                error={showErrors ? errors.CURRENT_CTC : ''}
              />
              <InputField
                label={<>Expected CTC <span className="text-red-500">*</span></>}
                name="EXP_CTC"
                type="number"
                value={formData.EXP_CTC}
                onChange={handleInputChange}
                error={showErrors ? errors.EXP_CTC : ''}
              />
              <InputField
                label={<>Notice Period (Days) <span className="text-red-500">*</span></>}
                name="NOTICE_PERIOD"
                type="number"
                value={formData.NOTICE_PERIOD}
                onChange={handleInputChange}
                error={showErrors ? errors.NOTICE_PERIOD : ''}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <FileUpload
                label={<>Experience Letter <span className="text-red-500">*</span></>}
                name="EXP_LETTER"
                onChange={handleFileChange}
                error={showErrors ? errors.EXP_LETTER : ''}
              />
              <FileUpload
                label={<>Relieving Letter <span className="text-red-500">*</span></>}
                name="RELIEVING_LETTER"
                onChange={handleFileChange}
                error={showErrors ? errors.RELIEVING_LETTER : ''}
              />
              <FileUpload
                label={<>Pay Slips <span className="text-red-500">*</span></>}
                name="PAYSLIPS"
                onChange={handleFileChange}
                multiple={true}
                error={showErrors ? errors.PAYSLIPS : ''}
              />
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition text-sm"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              Submit Form
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, error, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
        } ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FileUpload = ({ label, name, onChange, multiple = false, error }) => {
  const [fileName, setFileName] = useState('No file chosen');

  const maxSize = name === 'PAYSLIPS' ? '4MB' : '2MB';

  const handleChange = (e) => {
    setFileName(e.target.files?.length > 0 ? `${e.target.files.length} file(s) selected` : 'No file chosen');
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="file"
          name={name}
          accept="application/pdf"
          onChange={handleChange}
          multiple={multiple}
          className="hidden"
        />
        <span className={`px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 font-medium text-sm ${error ? 'border border-red-500' : ''
          }`}>
          Choose File
        </span>
        <span className="text-gray-600 text-xs truncate">{fileName}</span>
      </label>
      <p className="text-gray-500 text-xs mt-0.5">PDF only, max {maxSize}</p>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default RecruitmentForm;