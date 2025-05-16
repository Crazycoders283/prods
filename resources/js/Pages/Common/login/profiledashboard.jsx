"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [processing, setProcessing] = useState(false)
  const [recentlySuccessful, setRecentlySuccessful] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    date_of_birth: "",
    gender: "Male",
    profile_photo: null,
  })

  // Load user data from localStorage if available
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData)
        setData(prevData => ({
          ...prevData,
          ...parsedData
        }))
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e)
      }
    }
  }, [])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setData({...data, profile_photo: file})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProcessing(true)
    
    // Validate form
    const newErrors = {}
    if (!data.first_name) newErrors.first_name = "First name is required"
    if (!data.email) newErrors.email = "Email is required"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setProcessing(false)
      return
    }

    // Save the user data to localStorage
    const dataToSave = {...data}
    if (data.profile_photo) {
      // Don't try to stringify the File object
      delete dataToSave.profile_photo
    }
    localStorage.setItem('userData', JSON.stringify(dataToSave))
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false)
      setRecentlySuccessful(true)
      
      // Reset success message after a delay
      setTimeout(() => {
        setRecentlySuccessful(false)
      }, 2000)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#f0f7fc] py-4 sm:py-6 md:py-8">
      <header className="container mx-auto px-4 sm:px-6 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-[#006d92] hover:text-[#005a7a] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2 font-medium">Back to Home</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">My Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              {data.profile_photo ? (
                <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden">
                  <img src={URL.createObjectURL(data.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full bg-[#5aadd0] flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                  {data.first_name ? data.first_name[0].toUpperCase() : "A"}
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
              <button type="button" className="text-[#006d92] font-medium mt-2 text-sm whitespace-nowrap" onClick={() => fileInputRef.current?.click()}>
                Add Profile Photo
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
              <h1 className="text-xl sm:text-2xl font-bold">{data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : "Full Name"}</h1>
              <p className="text-gray-600">{data.mobile_number || "Mobile number"}</p>
              <p className="text-gray-600">{data.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Personal Information</h2>

          {/* Gender Buttons */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 mb-2">Gender</label>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {["Male", "Female", "Others"].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={`px-4 sm:px-6 py-2 rounded-md ${data.gender === value ? "bg-[#006d92] text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                  onClick={() => setData({...data, gender: value})}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <input
                type="text"
                placeholder="Mobile Number"
                value={data.mobile_number}
                onChange={(e) => setData({...data, mobile_number: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md"
              />
              {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={data.first_name}
                onChange={(e) => setData({...data, first_name: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md"
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={data.last_name}
                onChange={(e) => setData({...data, last_name: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md"
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
            <div className="sm:col-span-2">
              <input
                type="date"
                placeholder="Date of Birth"
                value={data.date_of_birth}
                onChange={(e) => setData({...data, date_of_birth: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md"
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
            <button 
              type="submit" 
              disabled={processing} 
              className="w-full sm:w-auto px-8 py-2 bg-[#006d92] text-white rounded-md hover:bg-[#005a7a] transition"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => setData({
                first_name: "",
                last_name: "",
                email: "",
                mobile_number: "",
                date_of_birth: "",
                gender: "Male",
                profile_photo: null
              })} 
              className="w-full sm:w-auto px-8 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Reset Form
            </button>
          </div>

          {recentlySuccessful && (
            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
              <p className="text-green-600 text-sm font-medium">Profile updated successfully!</p>
            </div>
          )}
        </div>

        {/* Account Security Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Account Security</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500">Last updated 3 months ago</p>
              </div>
              <button type="button" className="text-[#006d92] font-medium hover:underline">
                Change Password
              </button>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium">Two-factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button type="button" className="text-[#006d92] font-medium hover:underline">
                Enable
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Connected Accounts</h3>
                <p className="text-sm text-gray-500">Link your social accounts for easier login</p>
              </div>
              <button type="button" className="text-[#006d92] font-medium hover:underline">
                Manage
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}