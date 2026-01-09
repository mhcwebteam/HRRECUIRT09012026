import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  Upload,
  User,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Award
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../Config/Config"
import { ContextData } from '../Context/ContextData';
import { useParams } from 'react-router-dom';

const RecruitmentForm = () => {
  const {case_Id} = useParams();
 const  { HrData} = useContext(ContextData);
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

  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name,"nameddddddddd", value)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (name === 'PAYSLIPS') {
      setFormData(prev => ({
        ...prev,
        PAYSLIPS: [...files]
      }));
    } 
   else 
    {
     setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
   }
  };
//Validation Errors----
const validateForm = () => {
  const errors = {};
  // ===== REQUIRED TEXT FIELDS =====
  const requiredFields = [
    "NAME",
    "EMAIL",
    "PHONE_NUMBER",
    "DOB",
    "ADDRESS",
    "AADHAR_NUM",
    "PAN_NUM",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].toString().trim() === "") {
      errors[field] = `${field.replace("_", " ")} is required`;
    }
  });

  // ===== EMAIL =====
  if (formData.EMAIL && !/^\S+@\S+\.\S+$/.test(formData.EMAIL)) {
    errors.EMAIL = "Invalid email format";
  }

  // ===== PHONE =====
  if (formData.PHONE_NUMBER && formData.PHONE_NUMBER.length !== 10) {
    errors.PHONE_NUMBER = "Phone number must be 10 digits";
  }

  // ===== AADHAAR =====
  if (formData.AADHAR_NUM && formData.AADHAR_NUM.length !== 12) {
    errors.AADHAR_NUM = "Aadhaar must be 12 digits";
  }

  // ===== PAN =====
  // if (
  //   formData.PAN_NUM &&
  //   !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.PAN_NUM)
  // ) {
  //   errors.PAN_NUM = "Invalid PAN format";
  // }

  // ===== NUMERIC FIELDS =====
  const numericFields = [
    "SSC_MARKS",
    "INTER_MARKS",
    "BTECH_MARKS",
    "PG_MARKS",
    "CURRENT_CTC",
    "EXP_CTC",
    "NOTICE_PERIOD",
    "DURATION",
  ];

  numericFields.forEach((field) => {
    if (formData[field] && isNaN(formData[field])) {
      errors[field] = `${field.replace("_", " ")} must be numeric`;
    }
  });

  // ===== REQUIRED FILES =====
  const requiredFiles = ["AADHAR_PATH", "PAN_PATH", "PHOTO"];

  requiredFiles.forEach((file) => {
    if (!formData[file]) {
      errors[file] = `${file.replace("_", " ")} is required`;
    }
  });

  return errors;
};


  const handleSubmit = async (e) => {
    //alert(e.target.value);
    //console.log("FormData:::::",formData);
  e.preventDefault();

  // 🔥 TEST CHECK
  console.log("Submit clicked");

  //const errors = validateForm();

  // ❌ STOP IF VALIDATION FAILS
  // if (Object.keys(errors).length > 0) {
  //   await Swal.fire({
  //     title: "Validation Errors",
  //     html: `<ul style="text-align:left">
  //       ${Object.values(errors).map(err => `<li>• ${err}</li>`).join("")}
  //     </ul>`,
  //     icon: "error",
  //   });
  //   return;
  // }

  // ✅ CONFIRMATION
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

    // ===== APPEND ALL FIELDS =====
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) return;

      if (value instanceof File) 
      {
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
    console.log("Data::::::",data);
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
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-10 
                rounded-3xl shadow-2xl 
                border border-gray-300 
                bg-gradient-to-br from-pink-100 via-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
  <form onSubmit={handleSubmit} className="space-y-8">
  {/* ================= BASIC INFORMATION ================= */}
  <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
    <h2 className="text-xl font-bold mb-6">Basic Information</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        label="Full Name"
        name="NAME"
        value={formData.NAME}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Email"
        name="EMAIL"
        type="email"
        value={formData.EMAIL}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Phone Number"
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
        required
      />

      <InputField
        label="Date of Birth"
        name="DOB"
        type="date"
        value={formData.DOB}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Aadhaar Number"
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
        required
      />

      <InputField
        label="PAN Number"
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
        required
      />
    </div>

    <div className="mt-4">
      <label className="text-sm font-medium">Address *</label>
      <textarea
        name="ADDRESS"
        value={formData.ADDRESS}
        onChange={handleInputChange}
        rows={3}
        className="w-full border rounded-md px-3 py-2"
        required
      />
    </div>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <FileUpload label="Aadhaar Card" name="AADHAR_PATH" onChange={handleFileChange} />
      <FileUpload label="PAN Card" name="PAN_PATH" onChange={handleFileChange} />
      <FileUpload label="Photo" name="PHOTO" onChange={handleFileChange} />
    </div>
  </div>

  {/* ================= EDUCATION DETAILS ================= */}
  <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-500">
    <h2 className="text-xl font-bold mb-6">Education Details</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InputField label="SSC Marks" name="SSC_MARKS" type="number" value={formData.SSC_MARKS} onChange={handleInputChange} />
      <InputField label="Inter Marks" name="INTER_MARKS" type="number" value={formData.INTER_MARKS} onChange={handleInputChange} />
      <InputField label="B.Tech Marks" name="BTECH_MARKS" type="number" value={formData.BTECH_MARKS} onChange={handleInputChange} />
      <InputField label="PG Marks" name="PG_MARKS" type="number" value={formData.PG_MARKS} onChange={handleInputChange} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FileUpload label="10th Marksheet" name="10TH_FILENAME" onChange={handleFileChange} />
      <FileUpload label="Inter Marksheet" name="INTER_FILENAME" onChange={handleFileChange} />
      <FileUpload label="Degree" name="BTECH_FILENAME" onChange={handleFileChange} />
      <FileUpload label="PG Certificate" name="PG_FILENAME" onChange={handleFileChange} />
    </div>
  </div>

  {/* ================= EXPERIENCE ================= */}
  <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
    <h2 className="text-xl font-bold mb-6">Experience & Salary</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InputField label="Previous Company" name="PREVIOUS_COMPANY" value={formData.PREVIOUS_COMPANY} onChange={handleInputChange} />
      <InputField label="Duration (Months)" name="DURATION" type="number" value={formData.DURATION} onChange={handleInputChange} />
      <InputField label="Current CTC" name="CURRENT_CTC" type="number" value={formData.CURRENT_CTC} onChange={handleInputChange} />
      <InputField label="Expected CTC" name="EXP_CTC" type="number" value={formData.EXP_CTC} onChange={handleInputChange} />
      <InputField label="Notice Period (Days)" name="NOTICE_PERIOD" type="number" value={formData.NOTICE_PERIOD} onChange={handleInputChange} />
    </div>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <FileUpload label="Experience Letter" name="EXP_LETTER" onChange={handleFileChange} />
      <FileUpload label="Relieving Letter" name="RELIEVING_LETTER" onChange={handleFileChange} />
      <FileUpload label="Payslips" name="PAYSLIPS" onChange={handleFileChange} />
    </div>
  </div>

  {/* ================= ACTION BUTTONS ================= */}
  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={resetForm}
      className="px-6 py-3 bg-gray-200 rounded-md"
    >
      Reset
    </button>

    <button
      type="submit"
      className="px-8 py-3 bg-blue-600 text-white rounded-md"
    >
      Submit Form
    </button>
  </div>

</form>

      </div>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
        }`}
      required={required}
    />
  </div>
);

const FileUpload = ({ label, name, onChange, multiple = false }) => {
  const [fileName, setFileName] = useState('No file chosen');

  const handleChange = (e) => {
    setFileName(e.target.files?.length > 0 ? `${e.target.files.length} file(s) selected` : 'No file chosen');
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="file"
          name={name}
          accept="application/pdf,image/*"
          onChange={handleChange}
          multiple={multiple}
          className="hidden"
        />
        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">
          Choose File
        </span>
        <span className="text-gray-600">{fileName}</span>
      </label>
    </div>
  );
}

export default RecruitmentForm;