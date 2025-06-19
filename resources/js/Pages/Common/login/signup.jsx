import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Reuse the login CSS
import { authAPI } from '../../../api'; // Import the authAPI for making API calls
import { FaUserCircle, FaInfoCircle } from 'react-icons/fa';

export default function Signup() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate first name
        if (!data.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        // Validate last name
        if (!data.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        // Validate email
        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        // Validate password
        if (!data.password) {
            newErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        // Validate confirm password
        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        // Validate terms agreement
        if (!data.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setProcessing(true);
        
        try {
            // Make the registration API call using the authAPI
            const response = await authAPI.register({
                firstName: data.firstName,
                lastName: data.lastName,
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                password: data.password
            });

            console.log('Registration successful:', response);

            // If registration is successful, store the token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Set authentication status to true in localStorage
            localStorage.setItem('isAuthenticated', 'true');

            setProcessing(false);

            // Redirect to My Trips page on successful registration
            navigate('/my-trips');
        } catch (error) {
            setProcessing(false);
            console.error('Registration error details:', error);
            
            // More detailed error logging
            if (error.response) {
                console.error('Server response data:', error.response.data);
                console.error('Server response status:', error.response.status);
                console.error('Server response headers:', error.response.headers);
                
                // Handle error if registration failed with specific error messages
                if (error.response.status === 409) {
                    setErrors({ signup: 'Email already exists. Please use a different email or login.' });
                } else if (error.response.data && error.response.data.message) {
                    // Show the actual error message from the server
                    setErrors({ signup: error.response.data.message });
                } else {
                    setErrors({ signup: 'An error occurred. Please try again later.' });
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                setErrors({ signup: 'No response from server. Please check your connection.' });
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                setErrors({ signup: 'An error occurred. Please try again later.' });
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div className="login-container" style={{ width: '100%', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}>
                <div className="login-card fade-in" style={{ width: '100%', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', border: '1px solid #e5e7eb', borderRadius: 16 }}>
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center pt-6 pb-2">
                        <span className="text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Step 1: Create Account</span>
                    </div>
                    {/* Avatar/Icon */}
                    <div className="flex justify-center mb-2 mt-2">
                        <FaUserCircle size={54} color="#0855A2" />
                    </div>
                    {/* Image Section */}
                    <div
                        className="login-image"
                        style={{
                            backgroundImage: `url('/images/Rectangle 1434 (1).png')`,
                        }}
                    ></div>
                    {/* Signup Form Section */}
                    <div className="login-content">
                        <h2 className="login-title">Sign Up</h2>
                        <form className="login-form" onSubmit={submit} aria-label="Signup form">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    value={data.firstName}
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    id="firstName"
                                    placeholder="First Name"
                                    className="form-input"
                                />
                                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    value={data.lastName}
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    id="lastName"
                                    placeholder="Last Name"
                                    className="form-input"
                                />
                                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    value={data.email}
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    id="email"
                                    placeholder="username@gmail.com"
                                    className="form-input"
                                />
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password
                                    <span className="ml-1 relative group cursor-pointer">
                                        <FaInfoCircle size={14} color="#888" />
                                        <span className="absolute left-5 top-0 z-10 hidden group-hover:block bg-white border border-gray-300 text-xs text-gray-700 rounded px-2 py-1 shadow-lg w-48">Password must be at least 8 characters and contain a mix of letters and numbers.</span>
                                    </span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        id="password"
                                        placeholder="Password"
                                        className="form-input"
                                        aria-required="true"
                                        aria-invalid={!!errors.password}
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Password must be at least 8 characters.</div>
                                {errors.password && <div className="error-message" aria-live="polite">{errors.password}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={data.confirmPassword}
                                        onChange={handleChange}
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="form-input"
                                        aria-required="true"
                                        aria-invalid={!!errors.confirmPassword}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }} tabIndex={-1} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="error-message" aria-live="polite">{errors.confirmPassword}</div>}
                            </div>
                            
                            <div className="form-options">
                                <label className="remember-me">
                                    <input 
                                        type="checkbox" 
                                        name="agreeToTerms"
                                        checked={data.agreeToTerms}
                                        onChange={handleChange}
                                    />
                                    I agree to the <Link to="/terms" className="text-link">Terms of Service</Link> and <Link to="/privacy" className="text-link">Privacy Policy</Link>
                                </label>
                            </div>
                            {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
                            
                            <button 
                                className="login-button" 
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>
                            {errors.signup && <div className="error-message">{errors.signup}</div>}
                            
                            <div className="login-divider">or continue with</div>
                            <div className="social-login">
                                <button type="button" className="social-button">
                                    <img
                                        src="/images/login/google-logo.svg"
                                        alt="Google"
                                        width="24"
                                        height="24"
                                    />
                                </button>
                                <button type="button" className="social-button">
                                    <img
                                        src="/images/login/facebook-logo.svg"
                                        alt="Facebook"
                                        width="24"
                                        height="24"
                                    />
                                </button>
                                <button type="button" className="social-button">
                                    <img
                                        src="/images/login/email-icon.svg"
                                        alt="Email"
                                        width="24"
                                        height="24"
                                    />
                                </button>
                            </div>
                            
                            <div className="signup-link">
                                Already have an account? <Link to="/login" className="text-link">Login</Link>
                            </div>
                        </form>
                        <p className="login-footer">
                            By proceeding, you agree to our <Link to="/privacy" className="text-link">Privacy Policy</Link> and <Link to="/terms" className="text-link">Terms of Service</Link>.
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                .fade-in { animation: fadeIn 0.7s; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
                .enhanced-social { transition: box-shadow 0.2s, transform 0.2s; }
                .enhanced-social:hover:not(:disabled) { box-shadow: 0 2px 8px rgba(8,85,162,0.10); transform: translateY(-2px) scale(1.07); }
                .animate-fadeIn { animation: fadeIn 0.7s; }
                .animate-bounceIn { animation: bounceIn 0.7s; }
                @keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
                .group:hover .group-hover\:block { display: block; }
            `}</style>
        </div>
    );
} 