"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; 
import { BASE_URL } from "@/config/api";
import Aside from "@/components/Home/Aside";
import Navbar from "@/components/Home/Navbar";
import Projects from "@/components/Home/Projects";
import Loader from "@/components/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';

const Page = () => {
  const router = useRouter(); 
  const [user, setUser] = useState(null); 
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [selectedTags, setSelectedTags] = useState([]); 
  const [searchKeyword, setSearchKeyword] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      router.push("/signing"); 
      setLoading(false); 
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        fetchProjects(); 
      } else {
        getUser();
      }
    }
  }, [router]); 

  const getUser = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data)); 
        }
      }
    } catch (error) {
      setError("Failed to fetch user data");
      console.error(error);
    } finally {
      fetchProjects(); 
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    if (user != null) {
      try {
        const token = localStorage.getItem("jwt");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const categoryQuery = selectedCategories.length ? `&category=${selectedCategories.join(",")}` : "";
        const tagQuery = selectedTags.length ? `&tag=${selectedTags.join(",")}` : "";
        const url = `${BASE_URL}/api/projects/all-projects?${categoryQuery}${tagQuery}`;
        const response = await axios.get(url, { headers });
        setProjects(response.data);
      } catch (error) {
        setError("Failed to fetch projects");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [selectedCategories, selectedTags, user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const url = `${BASE_URL}/api/projects/search?keyword=${searchKeyword}`;
      const response = await axios.get(url, { headers });
      setProjects(response.data);
    } catch (error) {
      setError("Failed to search projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchKeyword("");
    fetchProjects();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
     <Navbar handleRefresh={handleRefresh}  />
      <div className="min-h-screen flex flex-col">
        <main className="flex mt-5 flex-grow p-4 gap-10 mx-[100px] container">
          <Aside
            className="w-[250px] hidden lg:block"
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <div className="w-full max-w-[900px]">
            <div className='flex w-full items-center gap-3 mb-4 border border-gray-300 rounded-lg p-2'>
              <FaSearch className='text-gray-200' />
              <input
                type='search'
                name='search'
                id='search'
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)} 
                placeholder='Search projects...'
                className='flex-1 outline-none border-none bg-transparent text-gray-300'
              />
              <TbRefresh className='text-gray-300 cursor-pointer' onClick={handleRefresh} />
              <button onClick={handleSearch} className="ml-3 px-4 py-2 text-white bg-blue-500 rounded-md">Search</button>
            </div>
            <Projects projects={projects} handleRefresh={handleRefresh} />
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
