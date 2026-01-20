import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../Config/Config";
import Verification from "./Verification";

const SalaryStackDetailsModal = ({ open, onClose, data, onStatusChange }) => {
  console.log("data3333333333333", data);
  const FIXED_COMPONENTS = {
    conveyance: 1600,
    education_allowance: 200
  };
  const [userToken] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || {});
  // Add state to track if we're editing an existing record
  const [isEditing, setIsEditing] = useState(false);
  const [existingSalaryBreakupId, setExistingSalaryBreakupId] = useState(null);
  const [newSalaryBreakupId, setNewSalaryBreakupId] = useState(null);

  // Function to generate random ID
  const generateRandomId = () => {
    return 'SB_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  };

  const calculateSalaryBreakdown = (offerCTC) => {
    console.log(offerCTC, "offer ctc");

    const monthlyCTC = offerCTC / 12;
   
    const conveyance = FIXED_COMPONENTS.conveyance;
    const education_allowance = FIXED_COMPONENTS.education_allowance;
    
    const basic_salary = Math.round(monthlyCTC * 0.50);
    console.log("basiccccccccccc",basic_salary);
    const hra = Math.round(basic_salary * 0.40);
    
    const employee_pf_contribution = Math.min(Math.round(basic_salary * 0.12), 1800);
    const employer_pf_contribution = employee_pf_contribution;
    
   
    const grossSalaryForESI = basic_salary + hra + conveyance + education_allowance;
    const is_esi_applicable = grossSalaryForESI <= 10000;
    
  
    const employeeESIContribution = is_esi_applicable ? Math.round(grossSalaryForESI * 0.0075) : 0;
    const employer_esi_contribution = is_esi_applicable ? Math.round(grossSalaryForESI * 0.0325) : 0;
    
  
    const professional_tax = 200;
    
    const otherBenefits = employer_pf_contribution + employer_esi_contribution;
    const deductions = employee_pf_contribution + employeeESIContribution + professional_tax;
    const targetGross = monthlyCTC - otherBenefits + deductions;
    const special_allowance = Math.round(targetGross - basic_salary - hra - conveyance - education_allowance);
    console.log(special_allowance,"special!!!!");
    const bonus = Math.round((offerCTC * 0.04) / 12);
    return {
      basic_salary,
      hra,
      conveyance,
      education_allowance,
      special_allowance: Math.max(0, special_allowance),
      bonus,
      leave_travel_allowance: 0,
      meal_vouchers: 0,
      employer_pf_contribution,
      employer_esi_contribution,
      employee_pf_contribution,
      employeeESIContribution,
      professional_tax,
      is_esi_applicable 
    };
  };

  const [offerCTC, setOfferCTC] = useState(0);

  const [salaryComponents, setSalaryComponents] = useState({
    basic_salary: 0,
    hra: 0,
    conveyance: FIXED_COMPONENTS.conveyance,
    education_allowance: FIXED_COMPONENTS.education_allowance,
    special_allowance: 0,
    bonus: 0,
    leave_travel_allowance: 0,
    meal_vouchers: 0,
    employer_pf_contribution: 1800,
    employer_esi_contribution: 0,
    employee_pf_contribution: 1800,
    employeeESIContribution: 0,
    professional_tax: 200,
    is_esi_applicable: false
  });

  const [remarks, setRemarks] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open && data) {
      const offerAmount = parseFloat(data.OFFER_CTC);
      setOfferCTC(offerAmount);
      const breakdown = calculateSalaryBreakdown(offerAmount);
      setSalaryComponents(breakdown);
      
      // Check if we have an existing salary breakup ID for editing
      if (data.id) {
        setIsEditing(true);
        setExistingSalaryBreakupId(data.id);
        console.log("Editing existing salary breakup:", data.salary_breakup_id);
      } else {
        setIsEditing(false);
        setExistingSalaryBreakupId(null);
        const newId = generateRandomId();
        setNewSalaryBreakupId(newId);
        console.log("Creating new salary breakup with ID:", newId);
      }
    }
  }, [open, data]);

  const calculations = {
    bonus: Math.round(salaryComponents.basic_salary * 8.33 / 100),
    special_allowance: Math.round(Math.max(0,
      (offerCTC || 0) / 12 - (
        (salaryComponents?.basic_salary || 0) +
        (salaryComponents?.hra || 0) +
        (salaryComponents?.conveyance || 0) +
        (salaryComponents?.education_allowance || 0) +
        (salaryComponents?.employer_pf_contribution || 0) +
        ((salaryComponents?.basic_salary || 0) * 8.33 / 100)
      )
    )),
    grossSalary: Math.round((salaryComponents?.basic_salary || 0) + 
      (salaryComponents?.hra || 0) + 
      (salaryComponents?.conveyance || 0) + 
      (salaryComponents?.education_allowance || 0) + 
      Math.max(0,
        (offerCTC || 0) / 12 - (
          (salaryComponents?.basic_salary || 0) +
          (salaryComponents?.hra || 0) +
          (salaryComponents?.conveyance || 0) +
          (salaryComponents?.education_allowance || 0) +
          (salaryComponents?.employer_pf_contribution || 0) +
          ((salaryComponents?.basic_salary || 0) * 8.33 / 100)
        )
      )),
    otherBenefits: salaryComponents.bonus + 
      salaryComponents.leave_travel_allowance + 
      salaryComponents.meal_vouchers + 
      salaryComponents.employer_pf_contribution + 
      salaryComponents.employer_esi_contribution,
      totalDeductions: salaryComponents.employee_pf_contribution + 
      salaryComponents.employeeESIContribution + 
      salaryComponents.professional_tax,
    get netSalaryMonthly() {
      return this.grossSalary - this.totalDeductions;
    },
    
    get netSalaryAnnual() {
      return this.netSalaryMonthly * 12;
    },
    
    get grossSalaryAnnual() {
      return this.grossSalary * 12;
    },
    
    get otherBenefitsAnnual() {
      return this.otherBenefits * 12;
    },
    
    get totalDeductionsAnnual() {
      return this.totalDeductions * 12;
    },
    
    get fixedCostAnnual() {
      return offerCTC || 0;
    }
  };

  const handleOfferCTCChange = (newOfferCTC) => {
    setOfferCTC(newOfferCTC);
    const breakdown = calculateSalaryBreakdown(newOfferCTC);
    setSalaryComponents(breakdown);
  };

  if (!open) return null;

  const handleSubmit = async (status) => {
    console.log("Data ID:", data.id);
    console.log("Existing Salary Breakup ID:", existingSalaryBreakupId);
    console.log("New Salary Breakup ID:", newSalaryBreakupId);
    console.log("Is Editing:", isEditing);

    const payload = {
      childCaseId:data.CHILD_CASEID,
      VerificationId:data.verification_id,
      status: status,
      remarks: remarks,
      offer_ctc: offerCTC,
      basic_salary: salaryComponents.basic_salary,
      hra: salaryComponents.hra,
      conveyance: FIXED_COMPONENTS.conveyance,
      education_allowance: FIXED_COMPONENTS.education_allowance,
      special_allowance: calculations.special_allowance,
      bonus: calculations.bonus,
      Gross_Salary: calculations.grossSalary,
      Total_Deductions: calculations.totalDeductions,
      Net_Salary: calculations.netSalaryMonthly,
      leave_travel_allowance: salaryComponents.leave_travel_allowance,
      meal_vouchers: salaryComponents.meal_vouchers,
      employer_pf_contribution: salaryComponents.employer_pf_contribution,
      employer_esi_contribution: salaryComponents.employer_esi_contribution,
      employee_pf_contribution: salaryComponents.employee_pf_contribution,
      employee_esi_contribution: salaryComponents.employeeESIContribution,
      professional_tax: 200,
      is_esi_applicable: salaryComponents.is_esi_applicable
    };

    // Add salary_breakup_id based on mode
    if (isEditing && existingSalaryBreakupId) {
      // Editing existing record - use existing ID
      payload.salary_breakup_id = existingSalaryBreakupId;
    } else if (!isEditing && newSalaryBreakupId) {
      // Creating new record - use generated random ID
      payload.salary_breakup_id = newSalaryBreakupId;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/salary-breakUp`, payload, {
        headers: {
          Authorization: `Bearer ${userToken.token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data, "Response from server");
      // Show success message
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('Salary breakup saved successfully!');
      }

      // Close modal and refresh data
      onClose();
      if (onStatusChange) {
        onStatusChange({
          id: data.id,
          salary_breakup_id: isEditing ? existingSalaryBreakupId : newSalaryBreakupId,
          ...payload
        });
      }
    } catch (err) {
      console.error('Error saving salary breakup:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error occurred';
      alert('Error saving salary breakup: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    // Prevent changing fixed components in edit mode
    if (field === 'conveyance' || field === 'education_allowance') {
      return;
    }
    
    setSalaryComponents(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const InfoRow = ({ label, value, valueColor = 'text-gray-700' }) => (
    <div className="flex items-start mb-3">
      <div className="flex items-center min-w-[180px] text-gray-600 font-medium">
        <span>{label}:</span>
      </div>
      <div className={`flex-1 font-medium ${valueColor}`}>
        {value || 'N/A'}
      </div>
    </div>
  );

  const SalaryRow = ({ label, field, monthly, annual, isEditable = true, isBold = false, bgColor = '', isFixed = false, showESINote = false }) => (
    <tr className={`${bgColor} hover:bg-gray-50 transition-colors`}>
      <td className={`px-4 py-3 ${isBold ? 'font-bold' : 'font-semibold'} text-gray-700`}>
        {label}
        {isFixed && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Fixed</span>}
        {showESINote && !salaryComponents.is_esi_applicable && (
          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Not Applicable</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {isEditable && !isViewMode && !isFixed ? (
          <input
            type="number"
            value={monthly}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <span className={isBold ? 'font-bold' : ''}>{monthly.toLocaleString('en-IN')}</span>
        )}
      </td>
      <td className={`px-4 py-3 text-center ${isBold ? 'font-bold' : ''}`}>
        {annual.toLocaleString('en-IN')}
      </td>
    </tr>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold">Salary Stackup</h2>
              {isEditing ? (
                <p className="text-sm text-emerald-100">Editing existing salary breakup (ID: {existingSalaryBreakupId})</p>
              ) : (
                <p className="text-sm text-emerald-100">Creating new salary breakup (ID: {newSalaryBreakupId})</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsViewMode(!isViewMode)}
              className="bg-white text-emerald-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              {isViewMode ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 bg-gray-50">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Employee Information</h3>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <InfoRow label="Name" value={data?.NAME} />
              <InfoRow label="Case ID" value={data?.CASEID} valueColor="text-emerald-600" />
              <InfoRow label="Job Title" value={data?.JOB_TITLE || 'Full Stack Developer'} />
              <InfoRow label="Email" value={data?.EMAIL} />
              <InfoRow label="Phone" value={data?.PHONE_NUMBER} />
              <InfoRow label="Location" value={data?.PLANT || 'Head Office'} valueColor="text-blue-600" />
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-7 h-7 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Salary Breakdown</h3>
              </div>
              {!isViewMode && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Edit Mode Active
                </span>
              )}
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Compensation Components</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-800">Monthly - INR</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-800">Annual - INR</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Section I - Compensation Components */}
                  <tr className="bg-emerald-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-emerald-900">I. COMPENSATION COMPONENTS</td>
                  </tr>
                  <SalaryRow 
                    label="Basic Salary" 
                    field="basic_salary"
                    monthly={salaryComponents.basic_salary}
                    annual={salaryComponents.basic_salary * 12}
                  />
                  <SalaryRow 
                    label="HRA" 
                    field="hra"
                    monthly={salaryComponents.hra}
                    annual={salaryComponents.hra * 12}
                  />
                  <SalaryRow 
                    label="Conveyance" 
                    field="conveyance"
                    monthly={salaryComponents.conveyance}
                    annual={salaryComponents.conveyance * 12}
                    isFixed={true}
                  />
                  <SalaryRow 
                    label="Education Allowance" 
                    field="education_allowance"
                    monthly={salaryComponents.education_allowance}
                    annual={salaryComponents.education_allowance * 12}
                    isFixed={true}
                  />
                  <SalaryRow 
                    label="Special Allowance" 
                    field="special_allowance"
                    monthly={calculations.special_allowance}
                    annual={calculations.special_allowance * 12}
                  />
                  <SalaryRow 
                    label="GROSS SALARY (sum of 1 to 5)"
                    field="grossSalary"
                    monthly={calculations.grossSalary}
                    annual={calculations.grossSalaryAnnual}
                    isEditable={false}
                    isBold={true}
                    bgColor="bg-emerald-50"
                  />

                  {/* Section II - Other Benefits */}
                  <tr className="bg-blue-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-blue-900">II. OTHER BENEFITS</td>
                  </tr>
                  <SalaryRow 
                    label="Bonus" 
                    field="bonus"
                    monthly={calculations.bonus}
                    annual={calculations.bonus * 12}
                  />
                  <SalaryRow 
                    label="Leave Travel Allowance" 
                    field="leave_travel_allowance"
                    monthly={salaryComponents.leave_travel_allowance}
                    annual={salaryComponents.leave_travel_allowance * 12}
                  />
                  <SalaryRow 
                    label="Meal Vouchers" 
                    field="meal_vouchers"
                    monthly={salaryComponents.meal_vouchers}
                    annual={salaryComponents.meal_vouchers * 12}
                  />
                  <SalaryRow 
                    label="Employer PF Contribution" 
                    field="employer_pf_contribution"
                    monthly={salaryComponents.employer_pf_contribution}
                    annual={salaryComponents.employer_pf_contribution * 12}
                  />
                  <SalaryRow 
                    label="Employer ESI Contribution" 
                    field="employer_esi_contribution"
                    monthly={salaryComponents.employer_esi_contribution}
                    annual={salaryComponents.employer_esi_contribution * 12}
                    showESINote={true}
                  />

                  {/* Section III - Deductions */}
                  <tr className="bg-red-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-red-900">III. DEDUCTIONS ON GROSS SALARY</td>
                  </tr>
                  <SalaryRow 
                    label="Employee PF Contribution" 
                    field="employee_pf_contribution"
                    monthly={salaryComponents.employee_pf_contribution}
                    annual={salaryComponents.employee_pf_contribution * 12}
                  />
                  <SalaryRow 
                    label="Employee ESI Contribution" 
                    field="employeeESIContribution"
                    monthly={salaryComponents.employeeESIContribution}
                    annual={salaryComponents.employeeESIContribution * 12}
                    showESINote={true}
                  />
                  <SalaryRow 
                    label="Professional Tax" 
                    field="professional_tax"
                    monthly={salaryComponents.professional_tax}
                    annual={salaryComponents.professional_tax * 12}
                  />
                  <SalaryRow 
                    label="TOTAL DEDUCTIONS (sum of 1 to 3)"
                    field="totalDeductions"
                    monthly={calculations.totalDeductions}
                    annual={calculations.totalDeductionsAnnual}
                    isEditable={false}
                    isBold={true}
                    bgColor="bg-red-50"
                  />

                  {/* Section IV - Net Salary */}
                  <tr className="bg-green-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-green-900">IV. NET SALARY</td>
                  </tr>
                  <SalaryRow 
                    label="NET SALARY (I+II-IV)"
                    field="netSalary"
                    monthly={calculations.netSalaryMonthly}
                    annual={calculations.netSalaryAnnual}
                    isEditable={false}
                    isBold={true}
                    bgColor="bg-green-50"
                  />

                  {/* Section V - Fixed Cost to Company */}
                  <tr className="bg-purple-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-purple-900">V. FIXED COST TO COMPANY</td>
                  </tr>
                  <SalaryRow 
                    label="FIXED COST TO COMPANY"
                    field="fixedCost"
                    monthly={offerCTC ? offerCTC / 12 : 0}
                    annual={offerCTC || 0}
                    isEditable={false}
                    isBold={true}
                    bgColor="bg-purple-50"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Offer CTC Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-md p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Offer CTC (Per Annum)</h3>
                  <p className="text-sm text-gray-600">Total cost to company for this position</p>
                </div>
              </div>
              <div className="text-right">
                {!isViewMode ? (
                  <input
                    type="number"
                    value={offerCTC}
                    onChange={(e) => handleOfferCTCChange(parseFloat(e.target.value) || 0)}
                    className="text-3xl font-bold text-orange-600 border-2 border-orange-300 rounded-xl px-4 py-2 text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                  />
                ) : (
                  <div className="text-3xl font-bold text-orange-600">
                    ₹ {offerCTC.toLocaleString('en-IN')}
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">
                  Calculated CTC: ₹ {calculations.fixedCostAnnual.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Remarks / Notes:
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any remarks or notes here..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              disabled={isViewMode}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleString('en-IN')}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit('rejected')}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button
              onClick={() => handleSubmit('approved')}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStackDetailsModal;