"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { FaTrash } from "react-icons/fa"; // Import the delete icon
import { BASE_URL } from "@/config/api";

const IssueDetail = () => {
  const { projectId, issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  useEffect(() => {
    if (issueId) {
      const fetchIssue = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/issue/${issueId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIssue(response.data);
        } catch (error) {
          console.error("Error fetching issue:", error);
        }
      };

      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/comment/issue/${issueId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchIssue();
      fetchComments();
    }
  }, [issueId, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/comment`,
        {
          issueId,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(
        `${BASE_URL}/api/issue/${issueId}/status/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssue((prevIssue) => ({
        ...prevIssue,
        status: newStatus,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!issue) return <p>Loading...</p>;

  return (
    <div className="min-h-screen w-full mx-auto p-6 mt-10 container text-white bg-transparent">
      <div className="flex">
        {/* Left Section */}
        <div className="w-2/3 pr-8">
          <h1 className="text-2xl font-bold mb-4">{issue.title}</h1>
          <p className="text-lg mb-4">{issue.description}</p>

          <div className="mb-4 mt-20">
            <h3 className="text-2xl text-white font-semibold mb-3">Activity</h3>
            <button className="px-4 py-2 bg-gray-700 rounded mr-2">All</button>
            <button className="px-4 py-2 bg-gray-700 rounded mr-2">Comments</button>
            <button className="px-4 py-2 bg-gray-700 rounded">History</button>
          </div>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-4 flex items-center gap-5 p-3 border bg-transparent rounded-md shadow"
              >
                <span className="text-sm w-10 h-10 rounded-full bg-slate-50 flex justify-center items-center text-gray-400">
                  {comment.user?.userName[0].toUpperCase()}
                </span>
                <div className="flex flex-col justify-start mt-2">
                  <p className="text-white text-lg">{comment.comment}</p>
                  <p className="text-sm text-gray-400">{formatDate(comment.commentCreated)}</p>
                </div>
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-white text-xl bg-transparent ml-auto"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Form for adding a new comment */}
          <form onSubmit={handleCommentSubmit} className="mt-6 flex gap-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full bg-gray-800 border focus:outline-none border-gray-600 rounded p-2"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Save"}
            </button>
          </form>
        </div>

        {/* Right Section (Details) */}
        <div className="w-1/2 bg-transparent p-6 rounded-md shadow-lg">
          <select
            value={issue.status}
            onChange={handleStatusChange}
            className="w-1/2 focus:outline-none border bg-transparent border-gray-300 rounded p-2 mb-4"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div className="mb-4 flex flex-col space-y-2 border p-5">
            <h3 className="font-bold text-lg mb-2 border-b">Details</h3>
            <div className="flex justify-between items-center">
              <p className="text-white"><strong>Assignee:</strong></p>
              <p>{issue.assignIssueUser?.userName || "N/A"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white"><strong>Labels:</strong></p>
              <p>{issue.labels || "None"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white"><strong>Status:</strong></p>
              <span className="bg-gray-500 text-white rounded-full px-4 py-2">
                {issue.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white"><strong>Release:</strong></p>
              <p>{issue.release || "-"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white"><strong>Reporter:</strong></p>
              <p>{issue.project.projectOwner.userName || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
