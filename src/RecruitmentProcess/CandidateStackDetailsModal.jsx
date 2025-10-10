import React, { useState, useEffect } from 'react';

const CandidateStackDetailsModal = ({ open, onClose, data, onStatusChange }) => {
  const FIXED_COMPONENTS = {
    conveyance: 1600,
    educationAllowance: 200
  };

  const calculateSalaryBreakdown = (offerCTC) => {
    console.log(offerCTC, "offer ctc");

    const monthlyCTC = offerCTC / 12;
    const conveyance = FIXED_COMPONENTS.conveyance;
    const educationAllowance = FIXED_COMPONENTS.educationAllowance;
    
    const basicSalary = Math.round(monthlyCTC * 0.50);
    const hra = Math.round(basicSalary * 0.40);
    
    const employeePFContribution = Math.min(Math.round(basicSalary * 0.12), 1800);
    const employerPFContribution = employeePFContribution;
    
    const grossSalaryForESI = basicSalary + hra + conveyance + educationAllowance;
    const isESIAplicable = grossSalaryForESI >= 100000;
    
    const employeeESIContribution = isESIAplicable ? Math.round(grossSalaryForESI * 0.0075) : 0;
    const employerESIContribution = isESIAplicable ? Math.round(grossSalaryForESI * 0.0325) : 0;
    
    const professionalTax = 200;
    
    const otherBenefits = employerPFContribution + employerESIContribution;
    const deductions = employeePFContribution + employeeESIContribution + professionalTax;
    const targetGross = monthlyCTC - otherBenefits + deductions;
    const specialAllowance = Math.round(targetGross - basicSalary - hra - conveyance - educationAllowance);

    const bonus = Math.round((offerCTC * 0.04) / 12);
    
    return {
      basicSalary,
      hra,
      conveyance,
      educationAllowance,
      specialAllowance: Math.max(0, specialAllowance),
      bonus,
      leaveTravelAllowance: 0,
      mealVouchers: 0,
      employerPFContribution,
      employerESIContribution,
      employeePFContribution,
      employeeESIContribution,
      professionalTax,
      isESIAplicable 
    };
  };

  const [offerCTC, setOfferCTC] = useState(0);
  const [salaryComponents, setSalaryComponents] = useState({
    basicSalary: 0,
    hra: 0,
    conveyance: FIXED_COMPONENTS.conveyance,
    educationAllowance: FIXED_COMPONENTS.educationAllowance,
    specialAllowance: 0,
    bonus: 0,
    leaveTravelAllowance: 0,
    mealVouchers: 0,
    employerPFContribution: 0,
    employerESIContribution: 0,
    employeePFContribution: 0,
    employeeESIContribution: 0,
    professionalTax: 200,
    isESIAplicable: false
  });

  const [remarks, setRemarks] = useState('');
  
  useEffect(() => {
    if (open && data) {
      const offerAmount = parseFloat(data.OFFER_CTC) || 420000;
      setOfferCTC(offerAmount);
      const breakdown = calculateSalaryBreakdown(offerAmount);
      setSalaryComponents(breakdown);
    }
  }, [open, data]);

  const calculations = {
    bonus: Math.round(salaryComponents.basicSalary * 8.33 / 100),

    specialAllowance: Math.round(Math.max(0,
      (offerCTC || 0) / 12 - (
        (salaryComponents?.basicSalary || 0) +
        (salaryComponents?.hra || 0) +
        (salaryComponents?.conveyance || 0) +
        (salaryComponents?.educationAllowance || 0) +
        (salaryComponents?.employerPFContribution || 0) +
        ((salaryComponents?.basicSalary || 0) * 8.33 / 100)
      )
    )),

    grossSalary: Math.round((salaryComponents?.basicSalary || 0) + 
      (salaryComponents?.hra || 0) + 
      (salaryComponents?.conveyance || 0) + 
      (salaryComponents?.educationAllowance || 0) + 
      Math.max(0,
        (offerCTC || 0) / 12 - (
          (salaryComponents?.basicSalary || 0) +
          (salaryComponents?.hra || 0) +
          (salaryComponents?.conveyance || 0) +
          (salaryComponents?.educationAllowance || 0) +
          (salaryComponents?.employerPFContribution || 0) +
          ((salaryComponents?.basicSalary || 0) * 8.33 / 100)
        )
      )),

    otherBenefits: salaryComponents.bonus + 
      salaryComponents.leaveTravelAllowance + 
      salaryComponents.mealVouchers + 
      salaryComponents.employerPFContribution + 
      salaryComponents.employerESIContribution,
    
    totalDeductions: salaryComponents.employeePFContribution + 
      salaryComponents.employeeESIContribution + 
      salaryComponents.professionalTax,
    
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

  if (!open) return null;

  const handleSubmit = (status) => {
    if (onStatusChange) {
      onStatusChange({
        id: data.id,
        status: status,
        remarks: remarks,
        offerCTC: offerCTC,
        salaryBreakdown: salaryComponents
      });
    }
    onClose();
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

  const SalaryRow = ({ label, monthly, annual, isBold = false, bgColor = '', isFixed = false, showESINote = false }) => (
    <tr className={`${bgColor} hover:bg-gray-50 transition-colors`}>
      <td className={`px-4 py-3 ${isBold ? 'font-bold' : 'font-semibold'} text-gray-700`}>
        {label}
        {isFixed && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Fixed</span>}
        {showESINote && !salaryComponents.isESIAplicable && (
          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Not Applicable</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={isBold ? 'font-bold' : ''}>{monthly.toLocaleString('en-IN')}</span>
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
            <h2 className="text-2xl font-bold">Candidate Stackup</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

          {/* Salary Breakdown Table */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <div className="flex items-center mb-4">
              <svg className="w-7 h-7 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Salary Breakdown</h3>
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
                    monthly={salaryComponents.basicSalary}
                    annual={salaryComponents.basicSalary * 12}
                  />
                  <SalaryRow 
                    label="HRA" 
                    monthly={salaryComponents.hra}
                    annual={salaryComponents.hra * 12}
                  />
                  <SalaryRow 
                    label="Conveyance" 
                    monthly={salaryComponents.conveyance}
                    annual={salaryComponents.conveyance * 12}
                    isFixed={true}
                  />
                  <SalaryRow 
                    label="Education Allowance" 
                    monthly={salaryComponents.educationAllowance}
                    annual={salaryComponents.educationAllowance * 12}
                    isFixed={true}
                  />
                  <SalaryRow 
                    label="Special Allowance" 
                    monthly={calculations.specialAllowance}
                    annual={calculations.specialAllowance * 12}
                  />
                  <SalaryRow 
                    label="GROSS SALARY (sum of 1 to 5)"
                    monthly={calculations.grossSalary}
                    annual={calculations.grossSalaryAnnual}
                    isBold={true}
                    bgColor="bg-emerald-50"
                  />

                  {/* Section II - Other Benefits */}
                  <tr className="bg-blue-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-blue-900">II. OTHER BENEFITS</td>
                  </tr>
                  <SalaryRow 
                    label="Bonus" 
                    monthly={calculations.bonus}
                    annual={calculations.bonus * 12}
                  />
                  <SalaryRow 
                    label="Leave Travel Allowance" 
                    monthly={salaryComponents.leaveTravelAllowance}
                    annual={salaryComponents.leaveTravelAllowance * 12}
                  />
                  <SalaryRow 
                    label="Meal Vouchers" 
                    monthly={salaryComponents.mealVouchers}
                    annual={salaryComponents.mealVouchers * 12}
                  />
                  <SalaryRow 
                    label="Employer PF Contribution" 
                    monthly={salaryComponents.employerPFContribution}
                    annual={salaryComponents.employerPFContribution * 12}
                  />
                  <SalaryRow 
                    label="Employer ESI Contribution" 
                    monthly={salaryComponents.employerESIContribution}
                    annual={salaryComponents.employerESIContribution * 12}
                    showESINote={true}
                  />

                  {/* Section III - Deductions */}
                  <tr className="bg-red-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-red-900">III. DEDUCTIONS ON GROSS SALARY</td>
                  </tr>
                  <SalaryRow 
                    label="Employee PF Contribution" 
                    monthly={salaryComponents.employeePFContribution}
                    annual={salaryComponents.employeePFContribution * 12}
                  />
                  <SalaryRow 
                    label="Employee ESI Contribution" 
                    monthly={salaryComponents.employeeESIContribution}
                    annual={salaryComponents.employeeESIContribution * 12}
                    showESINote={true}
                  />
                  <SalaryRow 
                    label="Professional Tax" 
                    monthly={salaryComponents.professionalTax}
                    annual={salaryComponents.professionalTax * 12}
                  />
                  <SalaryRow 
                    label="TOTAL DEDUCTIONS (sum of 1 to 3)"
                    monthly={calculations.totalDeductions}
                    annual={calculations.totalDeductionsAnnual}
                    isBold={true}
                    bgColor="bg-red-50"
                  />

                  {/* Section IV - Net Salary */}
                  <tr className="bg-green-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-green-900">IV. NET SALARY</td>
                  </tr>
                  <SalaryRow 
                    label="NET SALARY (I+II-IV)"
                    monthly={calculations.netSalaryMonthly}
                    annual={calculations.netSalaryAnnual}
                    isBold={true}
                    bgColor="bg-green-50"
                  />

                  {/* Section V - Fixed Cost to Company */}
                  <tr className="bg-purple-100">
                    <td colSpan="3" className="px-4 py-2 font-bold text-purple-900">V. FIXED COST TO COMPANY</td>
                  </tr>
                  <SalaryRow 
                    label="FIXED COST TO COMPANY"
                    monthly={offerCTC ? offerCTC / 12 : 0}
                    annual={offerCTC || 0}
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
                <div className="text-3xl font-bold text-orange-600">
                  ₹ {offerCTC.toLocaleString('en-IN')}
                </div>
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
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit('rejected')}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button
              onClick={() => handleSubmit('approved')}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center gap-2"
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

export default CandidateStackDetailsModal;