
import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrentDateField from "./CurrentDateField";
import './stylePage.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from "../Config/Config"

const ManpowerForm = () => {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });
  const [attempted, setAttempted] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    loc: "",
    caseid: "",
    tdate: new Date().toISOString().split("T")[0],
    requestor: "",
    empDept: "",
    empDesignation: "",
    department: "",
    rmail_id: "",
    jobtype: "",
    tecskill: "",
    soft_skill: "",
    recruitmentcycle: "Senior Management",
    Position: "Regular",
    qualf: "",
    exyear: "",
    hiringfor: "New",
    reportingto: "",
    req_pers: "",
    job_descp: "",
    remarks: "",
  });

  const Token = JSON.parse(localStorage.getItem('userInfo'));
  const [plantOptions, setPlantOptions] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [desgList, setDesgList] = useState([]);
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  const [jobRows, setJobRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [plantCodeEmps, setplantCodeEmps] = useState([]);

  const validateReqPers = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    const tempFormData = {
      ...formData,
      [name]: value,
    };
    const matchedRow = data.find(
      (row) =>
        row.Plant_code.slice(0, 4) === tempFormData.loc.slice(0, 4)
        && row.Designation.trim().toLowerCase() === tempFormData.jobtype.trim().toLowerCase()
    );
    if (!matchedRow) {
      newErrors.req_pers = "No matching job title found for selected plant.";
      setErrors(newErrors);
      return;
    }
    const totalReq = parseInt(matchedRow.Total_Requirement || "0", 10);
    const enteredReq = parseInt(tempFormData.req_pers || "0", 10);
    if (enteredReq > totalReq) {
      newErrors.req_pers = `Only ${totalReq} position(s) allowed for this Job Title at selected Plant`;
      setErrors(newErrors);
    } else {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.req_pers;
        return newErr;
      });
    }
  };

  const plantCodeemployees = async (e) => {
    const plantSlice = e.slice(0, 4);
    const fetchplantCodeemps = await fetch(`http://192.168.8.91:8084/inactive/phpapi/get_emp_by_plant.php?plant_code=${plantSlice}`, {
      method: "GET"
    });
    const employs = await fetchplantCodeemps.json();
    if (Array.isArray(employs.data)) {
      setplantCodeEmps(employs.data);
    } else {
      console.error("Expected array but got:", employs.data);
      setplantCodeEmps([]);
    }
  };

  const fetchUploadGetData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manpower-upload-get`, {
        headers: {
          "Content-Type": "application/json",
          Accept: 'application/json',
          Authorization: `Bearer ${userToken.token}`
        }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Data is not in the Array Format here---");
    }
  };

  useEffect(() => {
    axios
      .get("http://192.168.8.91:8084/inactive/phpapi/plant_api.php")
      .then((res) => {
        setPlantOptions(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch plant data", err);
      });
  }, []);

  useEffect(() => {
    const fetchDeptAndDesg = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dept`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${userToken.token}`,
          },
        });
        const departments = response.data.departments;
        const designations = response.data.designations;
        setDeptList(departments);
        setDesgList(designations);
      } catch (error) {
        console.error('Failed to fetch dept/desig data', error);
      }
    };
    fetchDeptAndDesg();
    fetchUploadGetData();
  }, []);

  useEffect(() => {
    const uid = Token.Emp_Id;
    axios
      .get(`http://192.168.8.91:8084/inactive/phpapi/get_empdetails.php?uid=${uid}`)
      .then((res) => {
        if (res.data.status === "success") {
          const user = res.data.user;
          setFormData((prev) => ({
            ...prev,
            requestor: user.name,
            rmail_id: user.email,
            empDept: user.dept,
            empDesignation: user.designation,
          }));
        }
        setUserDetailsFetched(true);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setUserDetailsFetched(true);
      });
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "loc") {
      setJobRows([]);
      if (value.trim() === "") {
        setFormData((prev) => ({
          ...prev,
          caseid: "",
        }));
        return;
      }
      try {
        const response = await axios.post(
          `${API_BASE_URL}/fetch-gpnum`,
          { plant: value },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${userToken.token}`,
            },
          }
        );
        setFormData((prev) => ({
          ...prev,
          caseid: response.data || "",
        }));
      } catch (err) {
        console.error("Error fetching case ID:", err);
        setFormData((prev) => ({
          ...prev,
          caseid: "",
        }));
      }
    }

       
    if (name === "req_pers" || name === "loc" || name === "jobtype") {
      const tempFormData = {
        ...formData,
        [name]: value,
      };
      const newErrors = { ...errors };

  
      const matchedRow = data.find(
        (row) =>
          row?.Plant_code?.slice(0, 4) === tempFormData?.loc?.slice(0, 4) &&
          row?.Designation?.trim() === tempFormData?.jobtype?.trim()
      );
      if (matchedRow) {
        const totalReq = parseInt(matchedRow.Total_Requirement || "0", 10);
        const enteredReq = parseInt(tempFormData.req_pers || "0", 10);
        if (enteredReq > totalReq) {
          newErrors.req_pers = `Only ${totalReq} position(s) allowed for this Job Title at selected Plant`;
        } else {
          delete newErrors.req_pers;
        }
      } else {
        delete newErrors.req_pers;
      }
      setErrors(newErrors);
    }

    if (name === "req_pers") {
      const count = parseInt(value);
      const baseCaseid = formData.caseid;
      if (count === 0 || isNaN(count)) {
        setJobRows([]);
      } else {
        const rows = Array.from({ length: count }, (_, idx) => ({
          sno: idx + 1,
          jobTitle: formData.jobtype,
          requiredDate: "",
          childcaseid: `${baseCaseid}${String(idx + 1).padStart(2, "0")}`,
        }));
        setJobRows(rows);
      }
    }

    if (name === "jobtype") {
      setJobRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          jobTitle: value,
        }))
      );
    }
  };

  const handleDateChangeForRow = (index, dateValue) => {
    setJobRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, requiredDate: dateValue } : row
      )
    );
    if (errors.jobDates) {
      const allDatesFilled = jobRows.every((row, idx) =>
        idx === index ? dateValue !== "" : row.requiredDate !== ""
      );
      if (allDatesFilled) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.jobDates;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'loc', 'jobtype', 'department', 'qualf',
      'exyear', 'reportingto', 'req_pers', 'tecskill',
      'soft_skill', 'job_descp', 'remarks', 'hiringfor'
    ];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });

    if (formData.hiringfor === "Replacement" && (!formData.replaced_emp || formData.replaced_emp.trim() === '')) {
      newErrors.replaced_emp = 'Replacing Emp_Id is required';
    }

    if (formData.rmail_id && !/\S+@\S+\.\S+/.test(formData.rmail_id)) {
      newErrors.rmail_id = 'Email address is invalid';
    }

    if (jobRows.length > 0) {
      let hasDateError = false;
      jobRows.forEach((row) => {
        if (!row.requiredDate) {
          hasDateError = true;
        }
      });
      if (hasDateError) {
        newErrors.jobDates = 'Please Select dates for all job requirements';
      }
    }

    const matchedRow = data?.find(
      row => row?.Plant_code?.slice(0, 4) === formData?.loc?.slice(0, 4) && row?.Designation?.trim() === formData?.jobtype?.trim()
    );
    if (matchedRow) {
      const totalReq = parseInt(matchedRow.Total_Requirement || "0", 10);
      const enteredReq = parseInt(formData.req_pers || "0", 10);
      if (enteredReq > totalReq) {
        newErrors.req_pers = `Only ${totalReq} position(s) allowed for this Job Title at selected Plant`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    const isValid = validateForm();
    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please check all required fields.',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          content: 'text-gray-600'
        }
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Submission',
      text: 'Do you want to raise the Manpower request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-gray-800',
        content: 'text-gray-600'
      }
    });
    if (!result.isConfirmed) return;

    const jobDetailsToSend = jobRows.map(row => {
      const { sno, ...rest } = row;
      return rest;
    });
    const payload = {
      method: "POST",
      ...formData,
      jobDetails: jobDetailsToSend,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/man-power-store`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken.token}`,
        },
        body: JSON.stringify(payload)
      });
      let responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'ManPower Request Raised Successfully',
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-gray-800',
            content: 'text-gray-600'
          }
        });
        navigate('/participants');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Request Submission Failed',
          text: responseData.message || 'Something went wrong on the server.',
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-gray-800',
            content: 'text-gray-600'
          }
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalType("error");
      setShowModal(true);
    }
  };

  const getFieldClass = (fieldName, isSelect = false) => {
    const baseClass = `w-full px-4 py-3 text-sm  border-2 rounded-xl transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
      placeholder:text-gray-400 hover:border-gray-400`;

    const requiredFields = [
      'loc', 'jobtype', 'department', 'qualf',
      'exyear', 'reportingto', 'req_pers', 'tecskill',
      'soft_skill', 'job_descp', 'remarks'
    ];

    const isReadOnly = ['requestor', 'rmail_id', 'caseid', 'empDept', 'empDesignation'].includes(fieldName);
    const hasError = (errors[fieldName] || (attempted && requiredFields.includes(fieldName) &&
      (!formData[fieldName] || formData[fieldName].trim() === ''))) && !isReadOnly;

    if (hasError) {
      return `${baseClass} border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500`;
    }
    if (isReadOnly) {
      return `${baseClass} bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed`;
    }
    return `${baseClass} border-gray-200`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    // max-w-7xl w-full mx-auto p-10 rounded-3xl shadow-2xl border border-gray-300 bg-gradient-to-br from-wheat via-gray-50 to-gray-100"> <div className="flex items-center bg-white rounded-2xl shadow-lg px-8 py-6
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="max-w-7xl w-full mx-auto p-10 
                rounded-3xl shadow-2xl 
                border border-gray-300 
                bg-gradient-to-br from-pink-100 via-gray-50 to-gray-100">
        <div className="flex items-center bg-white rounded-2xl shadow-lg px-8 py-6 border border-gray-100">
          {/* Left Accent Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md mr-4">
            <BriefcaseIcon className="w-6 h-6" />
          </div>

          {/* Title + Subtitle */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Manpower Requisition Form
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Submit a request for hiring, replacements, or manpower planning
            </p>
          </div>

          {/* Back Button */}
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


        <form onSubmit={handleSubmit} className="space-y-8 mt-10" noValidate>
          {/* Card 1: Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="loc"
                  value={formData.loc}
                  onChange={(e) => {
                    handleChange(e);
                    plantCodeemployees(e.target.value);
                  }}
                  className={getFieldClass("loc", true)}
                >
                  <option value="">Select Plant</option>
                  {plantOptions.map((plant, idx) => (
                    <option key={idx} value={plant.PLANT}>
                      {plant.PLANT_NAME}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {attempted && errors.loc && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Select Plant Location
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  Case ID
                </label>
                <input
                  type="text"
                  name="caseid"
                  value={formData.caseid}
                  readOnly
                  className={getFieldClass("caseid")}
                />
              </div>

              <div className="md:col-span-2">
                <CurrentDateField value={formData.tdate} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Requestor</label>
                <input
                  type="text"
                  name="requestor"
                  value={formData.requestor}
                  onChange={handleChange}
                  readOnly
                  className={getFieldClass("requestor")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="empDept"
                  value={formData.empDept}
                  onChange={handleChange}
                  readOnly
                  className={getFieldClass("empDept")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  name="empDesignation"
                  value={formData.empDesignation}
                  onChange={handleChange}
                  readOnly
                  className={getFieldClass("empDesignation")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Requestor Email</label>
                <input
                  type="email"
                  name="rmail_id"
                  value={formData.rmail_id}
                  onChange={handleChange}
                  readOnly
                  className={getFieldClass("rmail_id")}
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Job Requisition Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Job Requisition Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requestor Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={getFieldClass("department", true)}
                >
                  <option value="">Select Dept</option>
                  {deptList.map((dept, idx) => (
                    <option key={idx} value={dept.DEPT}>
                      {dept.DEPT}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {errors.department && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Select Department
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required for Job Title <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobtype"
                  value={formData.jobtype}
                  onChange={handleChange}
                  className={getFieldClass("jobtype", true)}
                >
                  <option value="">Select Job title</option>
                  {desgList.map((desg, idx) => (
                    <option key={idx} value={desg.DESIG}>
                      {desg.DESIG}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {errors.jobtype && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Select Job Title
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Level</label>
                <select
                  name="recruitmentcycle"
                  value={formData.recruitmentcycle}
                  onChange={handleChange}
                  className={getFieldClass("recruitmentcycle", true)}
                >
                  <option value="Senior Management">Senior Management</option>
                  <option value="Middle Management">Middle Management</option>
                  <option value="Junior Management">Junior Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Employment</label>
                <select
                  name="Position"
                  value={formData.Position}
                  onChange={handleChange}
                  className={getFieldClass("Position", true)}
                >
                  <option value="Regular">Regular</option>
                  <option value="FTC">FTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="qualf"
                  value={formData.qualf}
                  onChange={handleChange}
                  placeholder="Enter qualification"
                  className={getFieldClass("qualf")}
                />
                <AnimatePresence>
                  {errors.qualf && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Enter Qualification
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience in Years <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="exyear"
                  value={formData.exyear}
                  onChange={handleChange}
                  placeholder="e.g., 3-5 years"
                  className={getFieldClass("exyear")}
                />
                <AnimatePresence>
                  {errors.exyear && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Enter Experience In Years
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hiring For</label>
                <select
                  name="hiringfor"
                  value={formData.hiringfor}
                  onChange={handleChange}
                  className={getFieldClass("hiringfor", true)}
                >
                  <option value="New">New</option>
                  <option value="Replacement">Replacement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.hiringfor === "Replacement" && <span className="text-red-500">*</span>} Replacing Emp_Id
                </label>
                <select
                  name="replaced_emp"
                  value={formData.replaced_emp}
                  onChange={handleChange}
                  disabled={formData.hiringfor !== "Replacement"}
                  required={formData.hiringfor === "Replacement"}
                  className={getFieldClass("replaced_emp", true)}
                >
                  <option value="">Select Replace Employee</option>
                  {plantCodeEmps?.map((emp) => (
                    <option key={emp?.SNO} value={emp?.EMP_ID}>
                      {`${emp?.EMP_ID} - ${emp?.EMP_NAME}`}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {errors.replaced_emp && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      {errors.replaced_emp}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reporting To <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reportingto"
                  value={formData.reportingto}
                  onChange={handleChange}
                  placeholder="Enter reporting manager"
                  className={getFieldClass("reportingto")}
                />
                <AnimatePresence>
                  {errors.reportingto && attempted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      Please Enter Reporting To
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Persons <span className="text-red-500">*</span>
                </label>
                <select
                  name="req_pers"
                  value={formData.req_pers}
                  onChange={(e) => {
                    handleChange(e);
                    validateReqPers(e);
                  }}
                  className={getFieldClass("req_pers", true)}
                >
                  <option value="">Select Number</option>
                  <option value="0">-----Clear Grid---</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num.toString()}>
                      {num}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {errors.req_pers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2 text-sm text-red-500"
                    >
                      <ExclamationCircleIcon className="w-4 h-4" />
                      {typeof errors.req_pers === 'string' ? errors.req_pers : 'Please Select No. of Persons'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Required Skills</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technical Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="tecskill"
                  value={formData.tecskill}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="List required technical skills..."
                  className={`${getFieldClass("tecskill")} resize-none`}
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.tecskill && attempted && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1 text-sm text-red-500"
                      >
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Please Enter Technical Skills
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-xs text-gray-500">{formData.tecskill.length}/500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Soft Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="soft_skill"
                  value={formData.soft_skill}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="List required soft skills..."
                  className={`${getFieldClass("soft_skill")} resize-none`}
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.soft_skill && attempted && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1 text-sm text-red-500"
                      >
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Please Enter Soft Skills
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-xs text-gray-500">{formData.soft_skill.length}/500</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="job_descp"
                  value={formData.job_descp}
                  maxLength="500"
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the job role and responsibilities..."
                  className={`${getFieldClass("job_descp")} resize-none`}
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.job_descp && attempted && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1 text-sm text-red-500"
                      >
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Please Enter Job Description
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-xs text-gray-500">{formData.job_descp.length}/500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="Additional comments or requirements..."
                  className={`${getFieldClass("remarks")} resize-none`}
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.remarks && attempted && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1 text-sm text-red-500"
                      >
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Please Enter Comments
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-xs text-gray-500">{formData.remarks.length}/500</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Details Table */}
          <AnimatePresence>
            {jobRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">S.No</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Job Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Required Date *</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Case ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobRows.map((row, index) => (
                        <motion.tr
                          key={row.childcaseid || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            } hover:bg-blue-50 transition-colors duration-200`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                              {row.sno}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.jobTitle}</td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={row.requiredDate || ''}
                              onChange={(e) => handleDateChangeForRow(index, e.target.value)}
                              className={`w-full px-3 py-2 text-sm bg-white border-2 rounded-lg transition-all duration-200 
                                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${errors.jobDates && attempted && !row.requiredDate
                                  ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500'
                                  : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono bg-gray-50 rounded-lg">
                            {row.childcaseid}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AnimatePresence>
                  {errors.jobDates && attempted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-700 font-medium">{errors.jobDates}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pt-4"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl 
                transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <CheckCircleIcon className="w-6 h-6" />
              Submit Request
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default ManpowerForm;