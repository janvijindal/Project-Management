"use client";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import InviteModal from "@/components/ProjectDetails/InviteModal"; // Import InviteModal

const Details = ({ projectData, loggedInUser, handleRefresh }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isProjectOwner = loggedInUser.id === projectData.projectOwner.id;

  return (
    <div className="flex flex-col gap-8 p-6 shadow-lg rounded-md">
      {/* Project Details */}
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-gray-300">{projectData.projectName}</h2>
        <h3 className="text-gray-500 text-md">{projectData.description}</h3>

        {/* Key Value Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Project Owner:</p>
            <span className="font-semibold text-gray-500">{projectData.projectOwner.userName}</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-400">Member:</p>
            <div className="flex items-center space-x-2">
              {projectData.users.map((member) => (
                <span
                  key={member.id}
                  className="bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full"
                >
                  {member.userName.charAt(0).toUpperCase()}
                </span>
              ))}

              {/* Show "Invite +" button only to the project owner */}
              {isProjectOwner && (
                <button
                  className="text-blue-500 bg-transparent border hover:text-blue-600 font-semibold px-3 py-2"
                  onClick={() => setShowInviteModal(true)}
                >
                  Invite +
                </button>
              )}
            </div>
          </div>

          {/* Other Details */}
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Category:</p>
            <span className="font-semibold text-gray-700">{projectData.category}</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-400">Status:</p>
            <span className="text-white bg-yellow-500 rounded-full px-3 py-1">Pending</span>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          projectId={projectData.id}
          closeModal={() => setShowInviteModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Details;
