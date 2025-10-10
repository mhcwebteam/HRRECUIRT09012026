import React, { useState } from 'react';

const OfferLetter = () => {
  const [candidate, setCandidate] = useState({
    name: '',
    position: 'Full Stack Developer',
    startDate: '',
    offerCTC: '',
    location: 'Hyderabad, India',
    reportingManager: '',
    workMode: 'Hybrid'
  });

  const [isGenerated, setIsGenerated] = useState(false);

  const handleInputChange = (field, value) => {
    setCandidate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateOfferLetter = () => {
    if (candidate.name && candidate.startDate && candidate.offerCTC) {
      setIsGenerated(true);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const salaryBreakdown = {
    basic: Math.round(candidate.offerCTC * 0.50),
    hra: Math.round(candidate.offerCTC * 0.20),
    specialAllowance: Math.round(candidate.offerCTC * 0.25),
    otherBenefits: Math.round(candidate.offerCTC * 0.05)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Offer Letter Generator</h1>
          <p className="text-gray-600">Create professional offer letters in minutes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Candidate Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter candidate name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={candidate.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Full Stack Developer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>DevOps Engineer</option>
                    <option>UI/UX Designer</option>
                    <option>Project Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={candidate.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer CTC (₹) *</label>
                  <input
                    type="number"
                    value={candidate.offerCTC}
                    onChange={(e) => handleInputChange('offerCTC', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter annual CTC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                  <select
                    value={candidate.workMode}
                    onChange={(e) => handleInputChange('workMode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Hybrid</option>
                    <option>Remote</option>
                    <option>On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    value={candidate.reportingManager}
                    onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Manager's name"
                  />
                </div>

                <button
                  onClick={generateOfferLetter}
                  disabled={!candidate.name || !candidate.startDate || !candidate.offerCTC}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Offer Letter
                </button>
              </div>
            </div>
          </div>

          {/* Offer Letter Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Letter Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">TechCorp Solutions</h1>
                    <p className="text-blue-100">Innovating the Future, Together</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-blue-100">Ref: TC/{new Date().getFullYear()}/{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Letter Content */}
              <div className="p-8">
                {!isGenerated ? (
                  <div className="text-center py-12">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Preview Will Appear Here</h3>
                    <p className="text-gray-500">Fill in the details and generate your offer letter</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-600 mb-2">To,</p>
                      <p className="font-semibold text-lg">{candidate.name}</p>
                      <p className="text-gray-600">Email: candidate@example.com</p>
                      <p className="text-gray-600">Phone: +91 XXXXX XXXXX</p>
                    </div>

                    <div>
                      <p className="font-bold text-xl text-blue-800 mb-4">OFFER OF EMPLOYMENT</p>
                      <p className="text-gray-700 leading-relaxed">
                        Dear <span className="font-semibold">{candidate.name}</span>,
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-3">
                        We are pleased to offer you the position of <span className="font-semibold">{candidate.position}</span> 
                        at TechCorp Solutions. This letter outlines the terms and conditions of your employment.
                      </p>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-700">Position</p>
                        <p className="text-gray-600">{candidate.position}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Start Date</p>
                        <p className="text-gray-600">{new Date(candidate.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Work Location</p>
                        <p className="text-gray-600">{candidate.location}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Work Mode</p>
                        <p className="text-gray-600">{candidate.workMode}</p>
                      </div>
                    </div>

                    {/* Compensation */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-3">Compensation Package</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">Annual CTC:</span>
                          <span className="text-2xl font-bold text-green-700">₹{candidate.offerCTC?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>Basic Salary: ₹{salaryBreakdown.basic?.toLocaleString('en-IN')}</div>
                          <div>HRA: ₹{salaryBreakdown.hra?.toLocaleString('en-IN')}</div>
                          <div>Special Allowance: ₹{salaryBreakdown.specialAllowance?.toLocaleString('en-IN')}</div>
                          <div>Other Benefits: ₹{salaryBreakdown.otherBenefits?.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-3">Terms & Conditions</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>This is a full-time employment position</li>
                        <li>Standard company policies and procedures apply</li>
                        <li>You will report to: {candidate.reportingManager || "To be assigned"}</li>
                        <li>Probation period: 3 months</li>
                        <li>Working hours: 9:00 AM - 6:00 PM (Monday - Friday)</li>
                      </ul>
                    </div>

                    {/* Closing */}
                    <div className="mt-8">
                      <p className="text-gray-700 leading-relaxed">
                        We are excited about the prospect of you joining our team and believe your skills will be a valuable asset to our company.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Please sign and return this letter by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} to indicate your acceptance.
                      </p>
                      <div className="mt-8">
                        <p className="font-semibold text-gray-800">Sincerely,</p>
                        <p className="text-gray-700">HR Department</p>
                        <p className="text-gray-600">TechCorp Solutions</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isGenerated && (
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end gap-4">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;