
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import CurrentDateField from './CurrentDateField.jsx';
import {
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Business,
  Assignment,
  Person,
  Email,
  Work,
  School,
  TrendingUp,
  Groups,
  Description,
  Comment,
  CheckCircle,
  Close
} from "@mui/icons-material";
import { API_BASE_URL } from "../Apis/userApi.js"



function Manapp() 
{
  const navigate = useNavigate();
  const { case_id } = useParams();
  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    plant: "",
    caseid: "",
    rdate: "",
    requestor: "",
    rmail_id: "",
    department: "",
    jobtype: "",
    recruitmentcycle: "",
    Position: "",
    qualf: "",
    exyear: "",
    hiringfor: "",
    reportingto: "",
    req_pers: "",
    tecskill: "",
    soft_skill: "",
    jdesc: "",
    uremarks: "",
    remarks: "",
    approve: "",
    hodremarks: "",
  });

  const [currentTask, setCurrentTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deptdesigndata, setDeptDesign] = useState({ empDept: '', empDesignation: '' });

  useEffect(() => {
    const uid = userToken.Emp_Id;
    axios
      .get(`http://192.168.8.91:8084/inactive/phpapi/get_empdetails.php?uid=${uid}`)
      .then((res) => {
        if (res.data.status === "success") 
        {
          const user = res.data.user;
          setDeptDesign({
            empDept: user.dept,
            empDesignation: user.designation
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  }, []);
  const manPowerData = {case_id:case_id};

  const manPowerCloseStatus = async () => 
  {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to close the Manpower Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Close it!',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 rounded-lg',
        cancelButton: 'px-4 py-2 rounded-lg'
      }
    });
    if (result.isConfirmed) {
      try {
        const closeStatusResponse = await fetch(`${API_BASE_URL}/manpowerClose`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${userToken.token}`,
          },
          body: JSON.stringify(manPowerData),
        });
        Swal.fire({
          title: 'Closed!',
          text: 'Manpower status has been closed.',
          icon: 'success',
          customClass: {
            popup: 'rounded-xl'
          }
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Error in updating the Manpower Close Status ------------', err);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while closing.',
          icon: 'error',
          customClass: 
          {
            popup: 'rounded-xl'
          }
        });
      }
    }
  };

  useEffect(() => 
  {
    const fetchFormData = async () => 
    {
      if (!case_id || !userToken.token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/manpower-data/${case_id}`, 
        {
          headers: {
            Authorization: `Bearer ${userToken.token}`,
          },
        });
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            ...response.data,
            caseid: response.data.CHILD_CASEID,
          }));

          if (response.data.CUR_TASK) 
          {
            setCurrentTask(response.data.CUR_TASK);
          }
        }
      } 
      catch (error) 
      {
        console.error("Failed to fetch form data:", error);
      }
    };

    fetchFormData();
  }, [case_id, userToken.token]);

  const handleChange = (e) => 
  {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const getDynamicRemarksKey = (task) => {
    if (task && typeof task === "string" && task.trim() !== "") {
      return `${task.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, '')}remarks`;
    }
    return "default_gm_remarks";
  };

  const remarksFieldKey = getDynamicRemarksKey(currentTask);
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [remarksFieldKey];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    setAttempted(true);
    const action = e.nativeEvent.submitter.value; // this gives "REVERT" or "APPROVE"
    const isValid = validateForm();
    let actionText = null;
    if (!isValid) 
    {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please check all required fields.',
        customClass: 
        {
          popup: 'rounded-xl'
        }
      });
      return;
    }
   // alert(action);
   let swalOptions = 
     {
        title: 'Are you sure?',
        icon: 'question',
        showCloseButton: true,
        reverseButtons: true,
        customClass: 
        {
          popup: 'rounded-xl',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white',
          cancelButton: 'bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white',
          closeButton: 'text-gray-600 hover:text-gray-900 focus:outline-none'
        },
        buttonsStyling: false
      };
// If action is REVERT → show only Revert button
      if (action === "REVERT") 
      {
        swalOptions.text = "Do you want to revert this request?";
        swalOptions.showCancelButton = false;   // ❌ no reject
        swalOptions.confirmButtonText = "Yes, Revert"; // ✅ Revert button
      } 
      else 
      {
        swalOptions.text = "Do you want to approve this request?";
        swalOptions.showCancelButton = true;    // ✅ show Reject
        swalOptions.confirmButtonText = "Yes, Approve";
        swalOptions.cancelButtonText = "No, Reject";
      }
      const result = await Swal.fire(swalOptions);
      // Handle result
      if (action === "REVERT") {
        if (result.isConfirmed) {
        actionText = "REVERT";
        } else if (result.dismiss === Swal.DismissReason.close) {
          console.log("Closed without reverting");
        }
      } else {
        if (result.isConfirmed) 
        {
          actionText = "Approve";
        } else if (result.dismiss === Swal.DismissReason.cancel) 
        {
        actionText = "Reject";  // user clicked cancel
        } else if (result.dismiss === Swal.DismissReason.close) 
        {
          console.log("Closed without action");
        }
      }
    // Handle dismiss reasons
    if (result.dismiss === Swal.DismissReason.close) 
    {
      return; 
    }
    // Determine action
    if (action === "REVERT") 
    {
      actionText = "REVERT";
    } else if (result.isConfirmed) 
    {
      actionText = "Approve";
    } else {
      actionText = "Reject";  // user clicked cancel
    }
    try 
    {
      const payload = 
     {
        case_id: case_id,
        [remarksFieldKey]: formData[remarksFieldKey],
        approve: actionText,
        user: userToken.token,
        cur_tas: currentTask,
        department: formData.DEPT,
        loc: formData.PLANT,
      };
      let endpoint;
      let role;
  
      switch (currentTask) 
     {
        case "GM":
          role = "GM";
          endpoint = `/manpower-gm-data/${case_id}`;
          break;
        case "PRJ_HEAD":
          role = "PRJ_HEAD";
          endpoint = `/manpower-prj-data/${case_id}`;
          break;
        case "FUNC_HEAD":
          role = "FUNC_HEAD";
          endpoint = `/manpower-func-data/${case_id}`;
          break;
        case "SP":
          role = "SP";
          endpoint = `/manpower-sp-data/${case_id}`;
          break;
        case "EVC":
          role = "EVC";
          endpoint = `/manpower-evc-data/${case_id}`;
          break;
        case "HOD":
          role = "HOD";
          endpoint = `/manpower-hod-data/${case_id}`;
          break;
        default:
          role = "APPROVER";
          endpoint = `/mrfRevertBack/${case_id}`;
      }
      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
         payload,
        {
          headers: 
          {
            Authorization: `Bearer ${userToken.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.statusText === "OK") 
      {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${role} ${actionText} Successfully`,
          customClass: 
          {
            popup: 'rounded-xl'
          }
        });
        navigate('/participants');
      } 
      else 
      {
        Swal.fire({
          icon: 'error',
          title: `${role} Failed to ${actionText}`,
          text: response.data?.message || 'Something went wrong on the server.',
          customClass: {
            popup: 'rounded-xl'
          }
        });
      }
    } 
    catch (error) 
    {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'An error occurred while submitting the form.',
        customClass: 
        {
          popup: 'rounded-xl'
        }
      });
    } 
    finally 
    {
      setIsLoading(false);
    }
  };

  //--------------------------HandleRevertData-----------------------//
    const revertedSubmit = async (e) => 
    {
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
        customClass: 
        {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          content: 'text-gray-600'
        }
      });
      if (!result.isConfirmed) return;
      const payload = 
      {
        case_id : case_id,
        [remarksFieldKey]: formData[remarksFieldKey],
      };
      try 
      {
        const response = await fetch(`${API_BASE_URL}/mrfRevertedSubmit`, 
        {
          method: "POST",
          headers: 
          {
            'Content-Type': "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken.token}`,
          },
          body: JSON.stringify(payload)
        });
        let responseData = await response.json();
        if (responseData.success) 
        {
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
  const handleBack = () => 
  {
    navigate(-1);
  };
  const getFieldClass = (fieldName) => 
  {
    const baseClass = "w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition duration-200";
    
    const isReadOnly = 
    [
      'plant', 'caseid', 'rdate', 'requestor', 'rmail_id', 'department',
      'jobtype', 'recruitmentcycle', 'Position', 'qualf', 'exyear',
      'hiringfor', 'reportingto', 'req_pers', 'tecskill', 'soft_skill',
      'jdesc', 'uremarks', 'hodremarks'
    ].includes(fieldName);

    const requiredFields = [remarksFieldKey,'approve'];
    const hasError = (errors[fieldName] || (attempted && requiredFields.includes(fieldName) &&
      (!formData[fieldName] || formData[fieldName].trim() === ''))) && !isReadOnly;
    if (hasError) 
    {
      return `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`;
    }
    if (isReadOnly) 
    {
      return `${baseClass} border-blue-200 bg-blue-50 text-gray-700 focus:ring-blue-500 cursor-not-allowed`;
    }
      return   `${baseClass} border-blue-300 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-400`;
  };
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                title="Go Back"
              >
                <ArrowBack className="text-white" />
              </button>
              <h1 className="text-2xl font-bold">Manpower Requisition Form</h1>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Case ID: {formData.CHILD_CASEID || 'Loading...'}</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Business className="mr-2" />
            <span className="text-blue-100">{formData.PLANT || 'Loading plant...'}</span>
          </div>
        </div>

        {/* Status Banner */}
        <div className="px-8 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-gray-200">
          {formData.STATUS !== "Reverted" && formData.STATUS === "TO_DO" ? (
            currentTask && (
              <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
                <Assignment className="mr-2" />
                <span className="font-medium">Current Task: {currentTask}</span>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-lg">
              <Close className="mr-2" />
              <span className="font-medium">Closing Form</span>
            </div>
          )}
        </div>

        <form onSubmit={currentTask =="RAISER" ? revertedSubmit:handleSubmit } className="p-8 space-y-8" noValidate>
          {/* Basic Information Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Person className="mr-2 text-blue-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Business className="inline mr-1 text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  name="plant"
                  value={formData.PLANT}
                  readOnly
                  className={getFieldClass("plant")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Assignment className="inline mr-1 text-blue-500" />
                  Case ID
                </label>
                <input
                  type="text"
                  name="caseid"
                  value={formData.CHILD_CASEID}
                  readOnly
                  className={getFieldClass("caseid")}
                />
              </div>
              <div className="lg:col-span-2">
                <CurrentDateField value={formData.tdate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                <Person className="inline mr-1 text-blue-500"/>
                  Requestor
                </label>
                <input
                  type="text"
                  name="requestor"
                  value={formData.RAISER}
                  readOnly
                  className={getFieldClass("requestor")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                <Work className="inline mr-1 text-blue-500"/>
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={deptdesigndata.empDept}
                  readOnly
                  className={getFieldClass("department")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                <School className="inline mr-1 text-blue-500" />
                  Designation
                </label>
                <input
                  type="text"
                  name="rmail_id"
                  value={deptdesigndata.empDesignation}
                  readOnly
                  className={getFieldClass("rmail_id")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                <Email className="inline mr-1 text-blue-500"/>
                  Requestor Email
                </label>
                <input
                  type="email"
                  name="rmail_id"
                  value={formData.REQ_MAIL}
                  readOnly
                  className={getFieldClass("rmail_id")}
                />
              </div>
            </div>
          </div>

          {/* Job Requisition Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Work className="mr-2 text-blue-600" />
              Job Requisition Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requestor Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.DEPT}
                  readOnly
                  className={getFieldClass("department")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobtype"
                  value={formData.MANPOWER_DESG}
                  readOnly
                  className={getFieldClass("jobtype")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Level</label>
                <input
                  type="text"
                  name="recruitmentcycle"
                  value={formData.RECRUIT_CYCLE}
                  readOnly
                  className={getFieldClass("recruitmentcycle")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <input
                  type="text"
                  name="Position"
                  value={formData.POSITION}
                  readOnly
                  className={getFieldClass("Position")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <input
                  type="text"
                  name="qualf"
                  value={formData.EDUCATION}
                  readOnly
                  className={getFieldClass("qualf")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <input
                  type="text"
                  name="exyear"
                  value={formData.EXP}
                  readOnly
                  className={getFieldClass("exyear")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hiring For</label>
                <input
                  type="text"
                  name="hiringfor"
                  value={formData.RECRUIT_FOR}
                  readOnly
                  className={getFieldClass("hiringfor")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reporting To</label>
                <input
                  type="text"
                  name="reportingto"
                  value={formData.REPORTING}
                  readOnly
                  className={getFieldClass("reportingto")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Persons</label>
                <input
                  type="text"
                  name="req_pers"
                  value={formData.NUM_REQUIRE}
                  readOnly
                  className={getFieldClass("req_pers")}
                />
              </div>
            </div>
          </div>

          {/* Required Skills Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" />
              Required Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <textarea
                  name="tecskill"
                  value={formData.TECH_SKILLS}
                  rows="3"
                  readOnly
                  className={getFieldClass("tecskill")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                <textarea
                  name="soft_skill"
                  value={formData.SOFT_SKILLS}
                  rows="3"
                  readOnly
                  className={getFieldClass("soft_skill")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  name="jdesc"
                  value={formData.JOB_DESC}
                  rows="3"
                  readOnly
                  className={getFieldClass("jdesc")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Remarks</label>
                <textarea
                  name="uremarks"
                  value={formData.REMARKS}
                  rows="3"
                  readOnly
                  className={getFieldClass("uremarks")}
                />
              </div>
            </div>
          </div>
          {/* HOD Remarks for EVC */}
          {currentTask === "EVC" && formData.hodremarks && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Comment className="mr-2 text-blue-600" />
                HOD Remarks (Previous Stage)
              </h2>
              <textarea
                name="hodremarks"
                value={formData.hodremarks}
                rows="3"
                readOnly
                className={getFieldClass("hodremarks")}
              />
            </div>
          )}
          {/* Job Requirement Details */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Groups className="mr-2 text-blue-600" />
              Job Requirement Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold rounded-tl-xl">SNO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold rounded-tr-xl">Req By Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">1</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formData.JOB_TIT}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formData.REQ_BY_DT ? new Date(formData.REQ_BY_DT).toLocaleDateString("en-GB") : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks Section */}
          {formData.STATUS !== "Reverted" && formData.STATUS === "TO_DO" && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Description className="mr-2 text-blue-600" />
                {currentTask ? `${currentTask} Remarks` : "GM Remarks"}
                <span className="text-red-600 ml-1">*</span>
              </h2>
              <textarea
                name={remarksFieldKey}
                disabled={formData.STATUS === "Reverted"}
                value={formData[remarksFieldKey] || ""}
                onChange={handleChange}
                rows="4"
                required
                className={`${getFieldClass(remarksFieldKey)} ${formData.STATUS === "Reverted" ? "bg-gray-200 cursor-not-allowed" : ""}`}
                placeholder={`Enter your remarks for ${currentTask} here...`}
              />
              {errors[remarksFieldKey] && attempted && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <Close className="mr-1 text-red-600" size="small" />
                  Please enter remarks
                </p>
              )}
            </div>
          )}
         <div className="flex justify-center pt-6">
              {(formData.STATUS === "Reverted" && formData.STATUS !== "TO_DO") ? (
                <Button
                  onClick={manPowerCloseStatus}
                  variant="outlined"
                  color="secondary"
                  className="px-8 py-3 rounded-xl font-medium text-gray-700 border-gray-400 hover:bg-gray-100"
                  startIcon={<Close />}>
                  Close Request
                </Button>
              ) : (
                <>
                  {/* Submit_Approval*/}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    value="Submit"
                    disabled={isLoading||!formData.caseid}
                    className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 
                              hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                    startIcon={isLoading?<CircularProgress size={20}/>:<CheckCircle/>}>
                    {isLoading ? "Submitting...":currentTask=="RAISER"?"Submit":"Submit Approval"}
                  </Button>
                  {/* Revert button should show only if currentTask is SP or EVC */}
                  {(currentTask === "SP" || currentTask === "EVC") && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      value="REVERT"
                      disabled={isLoading || !formData.caseid}
                      className="ml-4 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-pink-600 
                                hover:from-red-600 hover:to-pink-700 shadow-lg"
                      startIcon={isLoading ? <CircularProgress size={20}/> : <Close/>}>
                      Revert
                    </Button>
                  )}
                </>
              )}
            </div>
        </form>
      </div>
    </div>
  );
}
export default Manapp;