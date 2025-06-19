import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { authAPI } from '../../../api'; // Import the authAPI for making API calls
import { 
  loadGoogleScript, 
  initializeGoogleSignIn, 
  renderGoogleButton, 
  promptGoogleSignIn, 
  cleanupGoogleAuth,
  verifyGoogleToken
} from '../../../utils/googleAuth';

export default function Login() {
    const navigate = useNavigate();
    const emailInputRef = useRef(null);

    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [facebookProcessing, setFacebookProcessing] = useState(false);

    // Initialize Google API client
    useEffect(() => {
        // Load the Google API script and initialize
        const initializeGoogle = async () => {
            try {
                console.log('Starting Google auth initialization');
                await loadGoogleScript();
                initializeGoogleSignIn(handleGoogleResponse);
                renderGoogleButton("google-signin-button");
                console.log('Google auth initialization complete');
            } catch (error) {
                console.error('Failed to initialize Google Sign-In:', error);
                setErrors(prev => ({ 
                    ...prev, 
                    login: 'Google Sign-In initialization failed. Please try again later.' 
                }));
            }
        };
        
        initializeGoogle();

        // Clean up on unmount
        return () => {
            cleanupGoogleAuth();
        };
    }, []);

    // Handle Google Sign-In response
    const handleGoogleResponse = async (response) => {
        try {
            console.log('Google sign-in response received', response);
            setProcessing(true);
            setErrors({}); // Clear any previous errors
            
            if (!response || !response.credential) {
                throw new Error('Invalid Google response: Missing credential');
            }
            
            // Verify token format
            const isValidToken = await verifyGoogleToken(response.credential);
            if (!isValidToken) {
                throw new Error('Invalid token format received from Google');
            }
            
            // Get current URL to ensure we're using the right domain
            const apiDomain = window.location.origin;
            console.log('Using API domain:', apiDomain);
            
            // Send the ID token to your backend
            console.log('Sending token to backend');
            const authResponse = await authAPI.googleLogin({
                token: response.credential
            });
            
            console.log('Backend authentication successful', authResponse);
            
            // Store token from your backend
            if (authResponse && authResponse.data && authResponse.data.token) {
                localStorage.setItem('token', authResponse.data.token);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify({
                    id: authResponse.data.id,
                    email: authResponse.data.email,
                    firstName: authResponse.data.firstName,
                    lastName: authResponse.data.lastName
                }));
                
                setProcessing(false);
                navigate('/my-trips');
            } else {
                throw new Error('Invalid response from server: Missing token');
            }
        } catch (error) {
            console.error('Google login error details:', error);
            setProcessing(false);
            
            // Display a more specific error message
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server error response:', error.response.data);
                let errorMessage = 'Authentication failed';
                
                if (error.response.status === 401) {
                    errorMessage = 'Google authentication failed: Invalid token or server configuration';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                
                setErrors({ login: errorMessage });
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                setErrors({ 
                    login: 'Server not responding. Please try again later.' 
                });
            } else {
                // Something happened in setting up the request
                console.error('Request error:', error.message);
                setErrors({ 
                    login: `Error: ${error.message}` 
                });
            }
        }
    };

    // Trigger Google Sign-In
    const handleGoogleSignIn = () => {
        setErrors({}); // Clear previous errors
        promptGoogleSignIn();
    };

    // Facebook SDK initialization
    useEffect(() => {
        // Load Facebook SDK
        if (!window.FB) {
            window.fbAsyncInit = function() {
                window.FB.init({
                    appId      : 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
                    cookie     : true,
                    xfbml      : true,
                    version    : 'v18.0'
                });
            };
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }, []);

    // Facebook login handler
    const handleFacebookLogin = () => {
        setFacebookProcessing(true);
        setErrors({});
        if (!window.FB) {
            setFacebookProcessing(false);
            setErrors({ login: 'Facebook SDK not loaded. Please try again.' });
            return;
        }
        window.FB.login(function(response) {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                // Send accessToken to backend for login/auth
                authAPI.facebookLogin({ token: accessToken })
                    .then(authResponse => {
                        if (authResponse && authResponse.data && authResponse.data.token) {
                            localStorage.setItem('token', authResponse.data.token);
                            localStorage.setItem('isAuthenticated', 'true');
                            localStorage.setItem('user', JSON.stringify({
                                id: authResponse.data.id,
                                email: authResponse.data.email,
                                firstName: authResponse.data.firstName,
                                lastName: authResponse.data.lastName
                            }));
                            setFacebookProcessing(false);
                            navigate('/my-trips');
                        } else {
                            setFacebookProcessing(false);
                            setErrors({ login: 'Facebook login failed. Please try again.' });
                        }
                    })
                    .catch(() => {
                        setFacebookProcessing(false);
                        setErrors({ login: 'Facebook login failed. Please try again.' });
                    });
            } else {
                setFacebookProcessing(false);
                setErrors({ login: 'Facebook login was cancelled or failed.' });
            }
        }, {scope: 'public_profile,email'});
    };

    // Email button handler: focus the email input
    const handleEmailButton = () => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
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
        setErrors({}); // Clear previous errors
        
        try {
            // Make the login API call using the authAPI
            const response = await authAPI.login({ email: data.email, password: data.password });

            // If login is successful, store the token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Set authentication status to true in localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify({
                id: response.data.id,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName
            }));

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
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div className="login-container" style={{ width: '100%', maxWidth: 400, margin: '0 auto', boxSizing: 'border-box' }}>
                <div className="login-card" style={{ width: '100%', maxWidth: 400, margin: '0 auto', boxSizing: 'border-box' }}>
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
                        {errors.login && (
                            <div className="error-message mb-4 p-3 bg-red-50 text-red-700 rounded">
                                {errors.login}
                            </div>
                        )}
                        <form className="login-form" onSubmit={submit} aria-label="Login form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    ref={emailInputRef}
                                    value={data.email}
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    id="email"
                                    placeholder="username@gmail.com"
                                    className="form-input"
                                    aria-required="true"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && <div className="error-message" aria-live="polite">{errors.email}</div>}
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
                                disabled={processing || facebookProcessing}
                                aria-busy={processing || facebookProcessing}
                            >
                                {(processing || facebookProcessing) ? <span className="spinner mr-2" aria-label="Loading"></span> : null}
                                {(processing || facebookProcessing) ? 'Signing in...' : 'Sign In'}
                            </button>
                            
                            <div className="login-divider" role="separator" aria-orientation="horizontal">or continue with</div>
                            <div className="social-login">
                                <button type="button" className="social-button" onClick={handleGoogleSignIn} disabled={processing || facebookProcessing} aria-label="Sign in with Google">
                                    <img
                                        src="/images/login/google-logo.svg"
                                        alt="Google"
                                        width="24"
                                        height="24"
                                    />
                                </button>
                                <button type="button" className="social-button" onClick={handleFacebookLogin} disabled={facebookProcessing || processing} aria-label="Sign in with Facebook">
                                    <img
                                        src="/images/login/facebook-logo.svg"
                                        alt="Facebook"
                                        width="24"
                                        height="24"
                                    />
                                </button>
                                <button type="button" className="social-button" onClick={handleEmailButton} disabled={processing || facebookProcessing} aria-label="Sign in with Email">
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
