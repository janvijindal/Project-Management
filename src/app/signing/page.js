"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '@/config/api';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const signin = async (e) => {
  e.preventDefault(); // Prevent default form submission
  setLoading(true); // Start loading state

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/signing`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json', // Set content type
          // Add any other required headers here, e.g., 'Authorization': 'Bearer YOUR_TOKEN'
        }
      }
    );

    const data = response.data;

    if (response.status === 200) {
      localStorage.setItem("jwt", data.jwt); // Store JWT token
      toast.success('Sign in successful! Redirecting...');
      setTimeout(() => {
        router.push('/'); // Redirect after success
      }, 2000);
    } else {
      setError(data.message || 'Sign in failed. Please try again.');
      toast.error(data.message || 'Sign in failed. Please try again.');
    }
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    setError(errorMsg);
    toast.error("An error occurred. Please try again."); // Improved error message
    console.error('Error:', errorMsg);
  } finally {
    setLoading(false); // End loading state
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent rounded-2xl">
      <div className="bg-transparent border border-white p-8 rounded-md w-full max-w-sm">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <form onSubmit={signin}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-md text-white outline-none"
              placeholder="user@gmail.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-md text-white outline-none"
              placeholder="123456"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-gray-900 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <p className='text-white font-medium mt-3'>
            Don't have an account? 
            <Link href="/signup">
              <span className='text-blue-600'> Sign Up</span>
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default SignIn;
