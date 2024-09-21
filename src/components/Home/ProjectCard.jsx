import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "./Modal";
import { BASE_URL } from "@/config/api";
import axios from "axios";
import { toast } from "react-toastify";

const ProjectCard = ({ data, handleRefresh }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Toggle dropdown menu visibility
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Handle update button click
  const handleUpdate = () => {
    setIsUpdateMode(true);
    setShowDropdown(false);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to delete a project.");
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/api/projects/delete/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Project deleted successfully");
      handleRefresh(); 
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    }
    setShowDropdown(false);
  };

  return (
    <>
      <div className="w-full relative p-6 flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md">
        {/* Heading */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href={`/project/${data.id}`}>
              {" "}
              <h1 className="text-xl font-semibold">{data.projectName}</h1>
            </Link>

            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <p className="text-gray-500">{data.category}</p>
          </div>
          <BsThreeDotsVertical
            className="text-gray-300 text-xl cursor-pointer"
            onClick={toggleDropdown}
          />
        </div>

        <p className="text-gray-700">{data.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <span
              key={index}
              className="text-gray-500 rounded-full px-3 py-1 border border-gray-300 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute w-[100px] bg-white text-black top-11 right-9  border  rounded-lg  p-2">
            <button
              onClick={handleUpdate}
              className="block text-black bg-transparent hover:bg-slate-200 text-left px-4 py-2 "
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="block text-black bg-transparent hover:bg-slate-200 text-left px-4 py-2 "
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Modal for Update */}
      {showModal && (
        <Modal
          closeModal={() => {
            setShowModal(false);
            setIsUpdateMode(false);
          }}
          isUpdateMode={isUpdateMode}
          projectData={data}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default ProjectCard;
