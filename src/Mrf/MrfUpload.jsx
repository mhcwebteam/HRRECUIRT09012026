import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from "../Config/Config"

const FileUpload = () => {

  const [userToken, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo')) || {};
  });
   const [isUploading, setIsUploading] = useState(false); 
  const [file, setFile] = useState(null);
  const [plantCode, setPlantCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [plantOptions, setPlantOptions] = useState([]);
    const [data, setData] = useState([]);
    const [postData, setPostData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://192.168.8.91:8084/inactive/phpapi/plant_api.php")
      .then(res => setPlantOptions(res.data))
      .catch(err => console.error("Failed to fetch plant data", err));
  }, []);







  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handlePlantCodeChange = (e) => setPlantCode(e.target.value);

 const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
   
    
    if (!file || !plantCode.trim()) {
      setError('Please select a file and enter Plant Code');
      return;
    }
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('PlantCode', plantCode);
    
    try {
      const response = await fetch(`${API_BASE_URL}/manpower-upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken.token}` },
        body: formData,
      });
      
      const data = await response.json();
      setPostData(data);


      
      if (!response.ok) throw new Error(data.error || 'Unknown error');
      
      // Show success SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: 'File uploaded successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
      

      navigate('/ManpowerUploadList');
      
    } catch (error) {
      setError(error.message);
      setIsUploading(false); // Re-enable button on error
      
      // Show error SweetAlert
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to upload file',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626',
      });
    }
  };


  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-blue-300 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img src="./mrflogo.png" alt="Logo" className="h-14 w-18 object-contain" />
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide drop-shadow-sm">
            Manpower Upload
          </h2>
        </div>
        <ArrowBackIcon
          className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => navigate('/dashboard')}
          fontSize="large"
          titleAccess="Go Back"
        />
      </div>

      <hr className="border-t-4 border-blue-600 rounded mb-8" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-700 text-sm">Plant Code</label>
          <select
            value={plantCode}
            onChange={handlePlantCodeChange}
            className="w-full mt-1 px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900"
            required
          >
            <option value="">Select Plant</option>
            {plantOptions.map((plant, idx) => (
              <option key={idx} value={plant.PLANT}>{plant.PLANT_NAME}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 text-sm">Excel File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="w-full mt-1 px-3 py-3 border-2 border-blue-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 cursor-pointer"
            required
             disabled={isUploading} 
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isUploading} // Disable during upload
            className={`px-8 py-3 bg-gradient-to-r text-white rounded-full font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 ${
              isUploading 
                ? 'from-gray-400 to-gray-600 cursor-not-allowed' 
                : 'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload'} {/* Change button text */}
          </button>
        </div>
      </form>

      {/* Messages */}
      {message && (
        <p className="mt-5 text-green-600 font-medium text-center animate-fade-in">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-5 text-red-600 font-medium text-center animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;



