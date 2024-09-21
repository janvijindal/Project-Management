import React from "react";

const IssueModal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blur background */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
        onClick={onClose} // Close modal if background is clicked
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-transparent border rounded-lg shadow-lg p-6 max-w-lg w-full">
        {children}
      </div>
    </div>
  );
};

export default IssueModal;
