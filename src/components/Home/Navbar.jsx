"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import Modal from "./Modal";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "@/config/api";

const Navbar = ({handleRefresh}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
    router.push("/signing");
  };

  return (
    <>
      <div className="w-full p-6 border-b-[0.1px] border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <ul className="flex gap-7">
              <li className="text-white text-xl font-bold">
                <Link href="/">Project Management</Link>
              </li>
              <li
                className="text-white text-xl font-normal cursor-pointer"
                onClick={openModal}
              >
              Create Project
              </li>
             
            </ul>
          </div>
          <div className="relative flex items-center gap-3">
            <FaCircleUser
              className="text-4xl text-white font-bold cursor-pointer"
              onClick={toggleDropdown}
            />
            {user && (
              <span
                onClick={toggleDropdown}
                className="text-white text-xl font-normal cursor-pointer"
              >
                {user.userName}
              </span>
            )}

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-[140px] w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-gray-800 font-bold">Profile</span>
                  <FaTimes
                    className="text-xl text-gray-800 cursor-pointer"
                    onClick={closeDropdown}
                  />
                </div>
                <ul>
                  <li
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && <Modal closeModal={closeModal} handleRefresh={handleRefresh} />}
    </>
  );
};

export default Navbar;
