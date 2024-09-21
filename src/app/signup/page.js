"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config/api';
import { useRouter } from 'next/navigation';
import {toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, { userName, email, password });
      console.log(response.status);
      const data = response.data;
      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        toast.success('Sign up successful! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError('Sign up failed. Please try again.');
        toast.error('Sign up failed. Please try again.');
      }
    } catch (error) {
      setError('Sign up failed. Please try again.');
      toast.error('An error occurred. Please try again.');
      console.log(error);
    } finally {
      setLoading(false); // Ensure loading is reset after completion
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent rounded-2xl">
      <div className="bg-transparent border border-white p-8 rounded-md w-full max-w-sm">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        <form onSubmit={signUp}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-md text-white outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-md text-white outline-none"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-gray-900 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <p className='text-white font-medium mt-3'>
            Already have an account?
            <Link href="/signing">
              <span className='text-blue-600'> Sign In</span>
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default SignUp;
