import React, { useState } from 'react';
import logo from '../../assets/logo.png' 
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from '../ui/Button';
import RepoScanModal from './RepoScanModal';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    
    setIsModalOpen(true);
  };

  const handleDemoUser = () => {
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <div className="p-6">
        <Link to="/" >
        <div className="flex items-center">
                <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2" />
                <p className="text-black font-medium">shipshield</p>
              </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center -mt-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-500 mb-6">Start auditing your code in seconds.</p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F5BD5] focus:border-transparent text-gray-900"
                placeholder="name@company.com"
                required
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
              />
            </div>

            <CustomButton type="submit" className="mt-2 w-full justify-center">
              Sign Up
            </CustomButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleDemoUser}
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Continue as Demo User
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/SignIn" className="text-[#4F5BD5] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <RepoScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SignUp;
