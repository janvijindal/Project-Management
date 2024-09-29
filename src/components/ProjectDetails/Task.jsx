import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import IssueModal from "./IssueModal"; // Import the modal component
import { FiMoreVertical } from "react-icons/fi"; // Import icons
import { RxCross2 } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa"; // Default user icon
import axios from "axios";
import { BASE_URL } from "@/config/api";

const Task = ({ issueData, projectId, token, projectUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [issues, setIssues] = useState([]);
  const [dropdownOpenIssueId, setDropdownOpenIssueId] = useState(null); // Track dropdown for user assignment

  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (issueData) {
      setIssues(issueData);
    }
  }, [issueData]);

  

  const toggleModal = (status = "") => {
    setNewIssue({ ...newIssue, status }); // Set the status when opening the modal
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateIssue = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/issue`,
        {
          title: newIssue.title,
          description: newIssue.description,
          status: newIssue.status,
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssues([...issues, response.data]);
      toggleModal();
      setNewIssue({ title: "", description: "", status: "" });
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await axios.delete(`${BASE_URL}/api/issue/${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIssues(issues.filter((issue) => issue.id !== issueId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const openDeleteModal = (issue) => {
    setSelectedIssue(issue);
    setIsDeleteModalOpen(true);
  };

  const viewIssueDetails = (issueId) => {
    router.push(`/project/${projectId}/issue/${issueId}`); // Navigate to the issue detail page
  };

  const assignUserToIssue = async (userId, issueId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/issue/${issueId}/user/${userId}`,
        {}, // Empty body if not required
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssues(
        issues.map((issue) =>
          issue.id === issueId ? { ...issue, assignIssueUser: response.data } : issue
        )
      );
      setDropdownOpenIssueId(null); // Close the dropdown after assignment
    } catch (error) {
      console.error("Error assigning user:", error.response ? error.response.data : error);
    }
  };
  

  const toggleDropdown = (issueId) => {
    if (dropdownOpenIssueId === issueId) {
      setDropdownOpenIssueId(null); // Close the dropdown if it's already open
    } else {
      setDropdownOpenIssueId(issueId); // Open dropdown for the specific issue
    }
  };

  const todoIssues = issues.filter((issue) => issue.status === "Todo");
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress"
  );
  const doneIssues = issues.filter((issue) => issue.status === "Done");

  return (
    <div className="flex flex-col p-6 shadow-lg gap-6">
      <h2 className="text-2xl font-semibold text-white">Tasks</h2>
      <div className="w-full h-[0.1px] bg-white"></div>

      {/* Todo List */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Todo</h3>
          <button
            onClick={() => toggleModal("Todo")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>
        <ul className="mt-4">
          {todoIssues.length > 0 ? (
            todoIssues.map((issue, key) => (
              <li
                key={key}
                className="bg-transparent border p-4 rounded mb-2 flex justify-between items-center cursor-pointer"
                onClick={() => viewIssueDetails(issue.id)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <h4 className="text-lg font-bold">{issue.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(issue);
                      }}
                      className="p-2 text-white bg-transparent hover:bg-gray-300 hover:text-black rounded-full"
                    >
                      <FiMoreVertical size={24} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>{issue.description}</p>
                    <div className="relative">
                      {issue.assignIssueUser ? (
                        <span className="text-sm w-10 h-10 rounded-full bg-slate-50 flex justify-center items-center text-gray-400">
                          {issue.assignIssueUser?.userName[0].toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle
                          size={24}
                          className="cursor-pointer text-xl bg-slate-50 ml-10"
                         
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(issue.id);
                          }}
                        />
                      )}
                      {dropdownOpenIssueId === issue.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                          {projectUsers.map((user) => (
                            <div
                              key={user.id}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                assignUserToIssue(user.id, issue.id);
                              }}
                            >
                              {user.userName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tasks to do</p>
          )}
        </ul>
      </div>

      {/* In Progress List */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">In Progress</h3>
          <button
            onClick={() => toggleModal("In Progress")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>
        <ul className="mt-4">
          {inProgressIssues.length > 0 ? (
            inProgressIssues.map((issue, key) => (
              <li
                key={key}
                className="bg-transparent border p-4 rounded mb-2 flex justify-between items-center cursor-pointer"
                onClick={() => viewIssueDetails(issue.id)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <h4 className="text-lg font-bold">{issue.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(issue);
                      }}
                      className="p-2 text-white bg-transparent hover:bg-gray-300 hover:text-black rounded-full"
                    >
                      <FiMoreVertical size={24} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center ">
                    <p>{issue.description}</p>
                    <div className="relative">
                      {issue.assignIssueUser ? (
                        <span className="text-sm w-10 h-10 rounded-full bg-slate-50 flex justify-center items-center text-gray-400">
                          {issue.assignIssueUser.userName[0].toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle
                          size={24}
                          className="cursor-pointer text-2xl text-slate-50 "
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(issue.id);
                          }}
                        />
                      )}
                      {dropdownOpenIssueId === issue.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                          {projectUsers.map((user) => (
                            <div
                              key={user.id}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                assignUserToIssue(user.id, issue.id);
                              }}
                            >
                              {user.userName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tasks in progress</p>
          )}
        </ul>
      </div>

      {/* Done List */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Done</h3>
          <button
            onClick={() => toggleModal("Done")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>
        <ul className="mt-4">
          {doneIssues.length > 0 ? (
            doneIssues.map((issue, key) => (
              <li
                key={key}
                className="bg-transparent border p-4 rounded mb-2 flex justify-between items-center cursor-pointer"
                onClick={() => viewIssueDetails(issue.id)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <h4 className="text-lg font-bold">{issue.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(issue);
                      }}
                      className="p-2 text-white bg-transparent hover:bg-gray-300 hover:text-black rounded-full"
                    >
                      <FiMoreVertical size={24} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>{issue.description}</p>
                    <div className="relative">
                      {issue.assignIssueUser ? (
                        <span className="text-sm w-10 h-10 rounded-full bg-slate-50 flex justify-center items-center text-gray-400">
                          {issue.assignIssueUser.userName[0].toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle
                          size={24}
                          className="cursor-pointer text-2xl text-slate-50 "
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(issue.id);
                          }}
                        />
                      )}
                      {dropdownOpenIssueId === issue.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                          {projectUsers.map((user) => (
                            <div
                              key={user.id}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                assignUserToIssue(user.id, issue.id);
                              }}
                            >
                              {user.userName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tasks done</p>
          )}
        </ul>
      </div>

      {/*Issue Modal */}
      {isModalOpen && (
        <IssueModal onClose={toggleModal}>
          <div className="bg-transparent border-white p-6 rounded">
             <div className="flex items-center justify-between mb-5">
             <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <RxCross2 onClick={toggleModal} className="text-white mb-4  text-2xl font-semibold"/>
             </div>
             <input
              type="text"
              placeholder="Task Title"
              value={newIssue.title}
              onChange={(e) =>
                setNewIssue({ ...newIssue, title: e.target.value })
              }
              className="w-full focus:outline-none bg-transparent border border-gray-300 rounded p-2 mb-4"
            />
            <textarea
              placeholder="Task Description"
              value={newIssue.description}
              onChange={(e) =>
                setNewIssue({ ...newIssue, description: e.target.value })
              }
              className="w-full border focus:outline-none bg-transparent border-gray-300 rounded p-2 mb-4"
            />
            <select
              value={newIssue.status}
              onChange={(e) =>
                setNewIssue({ ...newIssue, status: e.target.value })
              }
              className="w-full border bg-transparent border-gray-300 rounded p-2 mb-4"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              onClick={handleCreateIssue}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Task
            </button>
          </div>
        </IssueModal>
      )}


      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-90"></div>
          <div className="bg-transparent border p-6 rounded shadow-lg z-10">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this task?
            </h2>
            <p className="mb-6">{selectedIssue?.title}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteIssue(selectedIssue?.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
