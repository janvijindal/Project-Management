"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { BASE_URL } from "@/config/api";
const InviteModal = ({ projectId, closeModal, handleRefresh }) => {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    const token = localStorage.getItem("jwt"); // Get JWT token

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/projects/invite`,
        { email, projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Invitation sent successfully!");
      closeModal();
      handleRefresh(); // Refresh the page after sending invite
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
        
      <div className="bg-transparent relative border w-[550px] p-9 rounded-lg shadow-lg">
      <RxCross2 onClick={closeModal} className="text-xl absolute left-[510px] top-4 text-white font-medium"/>
        
         <h2 className="text-xl font-semibold mb-4">Invite a User</h2>
        
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          className="border px-3 py-2 w-full bg-transparent focus-within:bg-none focus:outline-none mb-4"
        />
        <button onClick={handleInvite} className="bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Send Invite
          </button>
      </div>
    </div>
  );
};

export default InviteModal;
