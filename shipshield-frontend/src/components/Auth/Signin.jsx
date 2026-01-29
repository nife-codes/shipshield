import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import logo from '../../assets/logo.png'
import CustomButton from '../ui/Button';


import { api } from '../../services/api';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.signIn(email, password);
      // Ideally store token here
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <div className="p-6">
        <Link to="/" >
          <div className="flex items-center">
            <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2" />
            <p className='text-black font-medium'>shipshield</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center -mt-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">Enter your details to access your dashboard.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F5BD5] focus:border-transparent text-gray-900"
                placeholder="name@company.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F5BD5] focus:border-transparent text-gray-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <CustomButton type="submit" className="mt-2 w-full justify-center" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </CustomButton>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/SignUp" className="text-[#4F5BD5] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
