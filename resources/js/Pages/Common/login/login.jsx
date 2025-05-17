import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { authAPI } from '../../../api'; // Import the authAPI for making API calls

export default function Login() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Initialize Google API client
    useEffect(() => {
        // Load the Google API client script
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
        window.google.accounts.id.initialize({
            client_id: "463609792474-nr70b2jrphprah8d4ene5aubrofv484j.apps.googleusercontent.com",
            callback: handleGoogleResponse,
            scope: "email profile https://www.googleapis.com/auth/gmail.readonly",
            ux_mode: "popup",
            context: "signin"
        });
        
        // Also render the standard Google button as a backup
        window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"), 
            { theme: "outline", size: "large" }
        );
    };

    // Handle Google Sign-In response
    const handleGoogleResponse = async (response) => {
        try {
            setProcessing(true);
            // Send the ID token to your backend
            const authResponse = await authAPI.googleLogin({
                token: response.credential
            });
            
            // Store token from your backend
            localStorage.setItem('token', authResponse.data.token);
            localStorage.setItem('isAuthenticated', 'true');
            
            setProcessing(false);
            navigate('/my-trips');
        } catch (error) {
            setProcessing(false);
            setErrors({ login: 'Google authentication failed. Please try again.' });
            console.error('Google login error:', error);
        }
    };

    // Trigger Google Sign-In
    const handleGoogleSignIn = () => {
        window.google.accounts.id.prompt();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        
        try {
            // Make the login API call using the authAPI
            const response = await authAPI.login({ email: data.email, password: data.password });

            // If login is successful, store the token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Set authentication status to true in localStorage
            localStorage.setItem('isAuthenticated', 'true');

            setProcessing(false);

            // Redirect to My Trips page on successful login
            navigate('/my-trips');
        } catch (error) {
            setProcessing(false);
            
            // Handle error if login failed
            if (error.response && error.response.status === 401) {
                setErrors({ login: 'Invalid credentials. Please try again.' });
            } else {
                setErrors({ login: 'An error occurred. Please try again later.' });
            }
        }
    };

    return (
        <div>
            <div className="login-container">
                <div className="login-card">
                    {/* Image Section */}
                    <div
                        className="login-image"
                        style={{
                            backgroundImage: `url('/images/Rectangle 1434 (1).png')`,
                        }}
                    ></div>

                    {/* Login Form Section */}
                    <div className="login-content">
                        <h2 className="login-title">Login</h2>
                        <form className="login-form" onSubmit={submit}>
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
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    id="password"
                                    placeholder="Password"
                                    className="form-input"
                                />
                                {errors.password && <div className="error-message">{errors.password}</div>}
                            </div>
                            <div className="form-options">
                                <label className="remember-me">
                                    <input 
                                        type="checkbox" 
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleChange}
                                    />
                                    Remember Me
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="forgot-password"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <button 
                                className="login-button" 
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                            {errors.login && <div className="error-message">{errors.login}</div>}
                            <div className="login-divider">or continue with</div>
                            <div className="social-login">
                                <button type="button" className="social-button" onClick={handleGoogleSignIn}>
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
                            
                            {/* Standard Google Sign-In button as backup */}
                            <div id="google-signin-button" className="mt-4"></div>
                            <div className="signup-link">
                                Don't have an account? <Link to="/signup" className="text-link">Sign Up</Link>
                            </div>
                        </form>
                        <p className="login-footer">
                            By proceeding, you agree to our <Link to="/privacy" className="text-link">Privacy Policy</Link> and <Link to="/terms" className="text-link">Terms of Service</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
