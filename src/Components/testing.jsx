import React, { useContext, useEffect, useState } from 'react';
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

const RecruitmentForm = () => {
  const [formData, setFormData] = useState({
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
    POST_GRADUCTION: '',
    CURRENT_CTC: '',
    EXP_CTC: '',
    OFFER_CTC: '',
    NOTICE_PERIOD: '',
    PREVIOUS_COMPANY: '',
    DURATION: '',
    
    // File fields
    AADHAR_PATH: null,
    PAN_PATH: null,
    '10TH_FILENAME': null,
    INTER_FILENAME: null,
    BTECH_FILENAME: null,
    PG_FILENAME: null,
    PHOTO: null,
    EXP_LETTER: null,
    RELIEVING_LETTER: '',
    PAYSLIPS: []
  });

  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};
  const { HrData } = useContext(ContextData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (HrData.length > 0) {
      const firstRecord = HrData[0];
      setFormData(prev => ({
        ...prev,
        CHILD_CASEID: firstRecord?.CHILD_CASEID || '',
        PLANT: firstRecord?.PLANT || ''
      }));
    }
  }, [HrData]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'PAYSLIPS') {
      setFormData(prev => ({
        ...prev,
        PAYSLIPS: [...files]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Add all text fields
      const textFields = [
        'CHILD_CASEID', 'PLANT', 'NAME', 'EMAIL', 'PHONE_NUMBER', 'DOB', 'DEPT', 'ADDRESS',
        'AADHAR_NUM', 'PAN_NUM', 'SSC_MARKS', 'INTER_MARKS', 'BTECH_MARKS', 'POST_GRADUCTION',
        'CURRENT_CTC', 'EXP_CTC', 'OFFER_CTC', 'NOTICE_PERIOD', 'PREVIOUS_COMPANY', 'DURATION'
      ];

      textFields.forEach(field => {
        if (formData[field] !== '' && formData[field] !== null) {
          data.append(field, String(formData[field]));
        }
      });

      // Add file fields
      const fileFields = [
        'AADHAR_PATH', 'PAN_PATH', '10TH_FILENAME', 'INTER_FILENAME', 
        'BTECH_FILENAME', 'PG_FILENAME', 'PHOTO', 'EXP_LETTER', 'RELIEVING_LETTER'
      ];

      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          data.append(field, formData[field]);
        }
      });

      // Handle PAYSLIPS array
      if (formData.PAYSLIPS.length > 0) {
        formData.PAYSLIPS.forEach((file, index) => {
          if (file instanceof File) {
            data.append('PAYSLIPS[]', file);
          }
        });
      }

      console.log("Submitting form data...");

      const response = await axios.post(`${API_BASE_URL}/recruitStore`, data, {
        headers: { 
          Authorization: `Bearer ${userToken.token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log("Response:", response);
      
      if (response.data.success) {
        alert("Form submitted successfully!");
        resetForm();
      } else {
        alert("Submission failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors ? 
                          JSON.stringify(error.response.data.errors) : 
                          error.message;
      alert("Error submitting form: " + errorMessage);
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
      POST_GRADUCTION: '',
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === BASIC INFORMATION === */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField
                label="CHILD_CASEID"
                name="CHILD_CASEID"
                type="text"
                value={formData.CHILD_CASEID}
                onChange={handleInputChange}
                disabled={true}
              />
              <InputField
                label="Plant Name"
                name="PLANT"
                type="text"
                value={formData.PLANT}
                onChange={handleInputChange}
                disabled={true}
              />
              <InputField
                label="Full Name"
                name="NAME"
                type="text"
                value={formData.NAME}
                placeholder="As per Aadhar"
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
                label="Phone"
                name="PHONE_NUMBER"
                type="tel"
                value={formData.PHONE_NUMBER}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Date Of Birth"
                name="DOB"
                type="date"
                value={formData.DOB}
                onChange={handleInputChange}
              />
              <InputField
                label="Department"
                name="DEPT"
                type="text"
                value={formData.DEPT}
                onChange={handleInputChange}
              />
              <InputField
                label="Aadhaar Number"
                name="AADHAR_NUM"
                type="text"
                value={formData.AADHAR_NUM}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); 
                  if (val.length <= 12) handleInputChange({ target: { name: "AADHAR_NUM", value: val } });
                }}
                required
              />
              <InputField
                label="PAN Number"
                name="PAN_NUM"
                type="text"
                value={formData.PAN_NUM}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (val.length <= 10) handleInputChange({ target: { name: "PAN_NUM", value: val } });
                }}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="ADDRESS"
                value={formData.ADDRESS}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
              ></textarea>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileUpload label="Aadhaar Card" name="AADHAR_PATH" onChange={handleFileChange} />
              <FileUpload label="PAN Card" name="PAN_PATH" onChange={handleFileChange} />
              <FileUpload label="Passport-size Photo" name="PHOTO" onChange={handleFileChange} />
            </div>
          </div>

          {/* === EDUCATION DETAILS === */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500 text-white p-3 rounded-lg">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Education Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InputField
                label="SSC Marks"
                name="SSC_MARKS"
                type="number"
                value={formData.SSC_MARKS}
                onChange={handleInputChange}
              />
              <InputField
                label="Inter Marks"
                name="INTER_MARKS"
                type="number"
                value={formData.INTER_MARKS}
                onChange={handleInputChange}
              />
              <InputField
                label="B.Tech Marks"
                name="BTECH_MARKS"
                type="number"
                value={formData.BTECH_MARKS}
                onChange={handleInputChange}
              />
              <InputField
                label="PG Marks"
                name="POST_GRADUCTION"
                type="number"
                value={formData.POST_GRADUCTION}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FileUpload label="10th Marksheet" name="10TH_FILENAME" onChange={handleFileChange} />
              <FileUpload label="Intermediate Marksheet" name="INTER_FILENAME" onChange={handleFileChange} />
              <FileUpload label="Degree (B.Tech)" name="BTECH_FILENAME" onChange={handleFileChange} />
              <FileUpload label="Post Graduation" name="PG_FILENAME" onChange={handleFileChange} />
            </div>
          </div>

          {/* === EXPERIENCE & CTC === */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <Award size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Experience & CTC</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InputField
                label="Previous Company"
                name="PREVIOUS_COMPANY"
                type="text"
                value={formData.PREVIOUS_COMPANY}
                onChange={handleInputChange}
              />
              <InputField
                label="Duration (Months)"
                name="DURATION"
                type="number"
                value={formData.DURATION}
                onChange={handleInputChange}
              />
              <InputField
                label="Current CTC"
                name="CURRENT_CTC"
                type="number"
                value={formData.CURRENT_CTC}
                onChange={handleInputChange}
              />
              <InputField
                label="Expected CTC"
                name="EXP_CTC"
                type="number"
                value={formData.EXP_CTC}
                onChange={handleInputChange}
              />
              <InputField
                label="Offered CTC"
                name="OFFER_CTC"
                type="number"
                value={formData.OFFER_CTC}
                onChange={handleInputChange}
              />
              <InputField
                label="Notice Period (Days)"
                name="NOTICE_PERIOD"
                type="number"
                value={formData.NOTICE_PERIOD}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileUpload label="Experience Letter" name="EXP_LETTER" onChange={handleFileChange} />
              <FileUpload label="Relieving Letter" name="RELIEVING_LETTER" onChange={handleFileChange} />
              <FileUpload label="Payslips (Multiple)" name="PAYSLIPS" onChange={handleFileChange} multiple />
            </div>
          </div>

          {/* === BUTTONS === */}
          <div className="flex gap-4 pt-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
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