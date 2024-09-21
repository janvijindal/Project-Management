"use client";
import { BASE_URL } from "@/config/api";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const categories = [
  "Full Stack Project",
  "Frontend Project",
  "Backend Project",
];

const Modal = ({ closeModal, isUpdateMode, projectData, handleRefresh }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isUpdateMode && projectData) {
      setProjectName(projectData.projectName);
      setDescription(projectData.description);
      setTags(projectData.tags);
      setCategory(projectData.category);
    }
  }, [isUpdateMode, projectData]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to update a project.");
      return;
    }
  
    try {
      if (isUpdateMode) {
        await axios.post(
          `${BASE_URL}/api/projects/update/${projectData.id}`,
          { id: projectData.id, projectName, description, tags, category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Project updated successfully");
      } else {
        await axios.post(
          `${BASE_URL}/api/projects/create`,
          { projectName, description, tags, category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Project created successfully");
      }
      handleRefresh();
      closeModal();
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} project:`, error);
      toast.error(`Failed to ${isUpdateMode ? 'update' : 'create'} project. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 text-white flex justify-center items-center bg-black bg-opacity-70  z-30">
      <div className="bg-black/50 border border-white w-[500px] rounded-lg p-8 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-4xl bg-transparent font-bold text-white"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isUpdateMode ? 'Update Project' : 'Create New Project'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none bg-transparent"
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none bg-transparent"
              placeholder="Enter project description"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium">Tags</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="border w-full p-2 rounded-lg focus:outline-none bg-transparent"
                placeholder="Add tag"
              />
              <button
                onClick={handleAddTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-blue-500 text-white py-1 px-3 rounded-full flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="bg-transparent text-white hover:text-red-400"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none bg-transparent"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isUpdateMode ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
