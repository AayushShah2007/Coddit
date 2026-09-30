import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '', // username or email
    password: '',
  });

  // Signup form state
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    gender: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  // Manual Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Manual Signup Handler
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        birthdate: signUpData.birthdate,
        gender: signUpData.gender,
        username: signUpData.username.trim().toLowerCase(),
        phoneNumber: signUpData.phoneNumber,
        email: signUpData.email.trim().toLowerCase(),
        password: signUpData.password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage('Password reset link sent to your email.');
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  // OAuth Handlers (Redirect or SDK triggers)
  const handleOAuthLogin = (provider) => {
    // Redirects browser to your Express OAuth endpoints
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#161b22] border border-gray-800 rounded-xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>Coddit</span>
            <span className="text-blue-500 font-mono text-2xl">&lt;/&gt;</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">The developer community platform</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            type="button"
            className={`w-1/2 pb-3 font-semibold text-sm transition-colors ${
              !isSignUp ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`w-1/2 pb-3 font-semibold text-sm transition-colors ${
              isSignUp ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* OAuth Social Buttons */}
        <div className="space-y-2 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition font-medium text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition font-medium text-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.43-5.72-8.7-10.22-18.77-13.5-30.22-3.29-11.45-4.93-22.15-4.93-32.09 0-14.86 3.82-27.17 11.46-36.93 7.64-9.76 17.15-14.77 28.53-15.02 5.09 0 10.74 1.25 16.95 3.75 6.22 2.5 10.15 3.85 11.78 4.05 2.12-.41 6.32-1.87 12.61-4.38 6.29-2.5 11.7-3.6 16.24-3.3 12.01.76 21.75 5.23 29.21 13.4-10.53 6.38-15.7 15.14-15.52 26.28.18 8.65 3.48 15.93 9.9 21.84 6.42 5.92 14.15 9.29 23.19 10.12-2.18 6.55-4.63 12.92-7.36 19.12zM119.22 31.85c0-7.05 2.58-13.62 7.74-19.72 5.16-6.1 11.49-9.84 18.99-11.23.47 1.06.71 2.22.71 3.5 0 7.05-2.67 13.73-8.01 20.03-5.34 6.3-11.79 9.94-19.34 10.92-.06-1.18-.09-2.35-.09-3.5z" />
              </svg>
              Apple
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition font-medium text-sm"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-800 w-full"></div>
          <span className="bg-[#161b22] px-3 text-xs uppercase text-gray-500 font-mono tracking-wider absolute">
            Or continue with credentials
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Forms Container */}
        {!isSignUp ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Username or Email</label>
              <input
                type="text"
                name="identifier"
                required
                value={loginData.identifier}
                onChange={handleLoginChange}
                placeholder="octocat or octo@github.com"
                className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-mono text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                required
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={signUpData.firstName}
                  onChange={handleSignUpChange}
                  placeholder="Ada"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={signUpData.lastName}
                  onChange={handleSignUpChange}
                  placeholder="Lovelace"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  required
                  value={signUpData.birthdate}
                  onChange={handleSignUpChange}
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Gender</label>
                <select
                  name="gender"
                  required
                  value={signUpData.gender}
                  onChange={handleSignUpChange}
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Set Unique Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm font-mono">@</span>
                <input
                  type="text"
                  name="username"
                  required
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                  placeholder="adalovelace"
                  className="w-full pl-8 bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  placeholder="ada@example.com"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={signUpData.phoneNumber}
                  onChange={handleSignUpChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Set Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition mt-2"
            >
              {loading ? 'Creating account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>
            {forgotMessage && (
              <p className="text-xs text-blue-400 mb-3 bg-blue-900/30 p-2 rounded">
                {forgotMessage}
              </p>
            )}
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your-email@domain.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-[#0e1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setForgotMessage(''); }}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}