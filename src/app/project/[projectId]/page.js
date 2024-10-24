"use client";
import Navbar from "@/components/Home/Navbar";
import Details from "@/components/ProjectDetails/Details";
import Chat from "@/components/ProjectDetails/Chat";
import Task from "@/components/ProjectDetails/Task";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";
import axios from "axios";

const Page = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [issueData, setIssueData] = useState([]); // New state for issue data
  const [projectUsers, setProjectUsers] = useState([]);

  // Fetch logged-in user data and token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setToken(token);
      setIsLoggedIn(true);

      // Fetch logged-in user details
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLoggedInUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch project data
  useEffect(() => {
    if (projectId && isLoggedIn) {
      const fetchProjectData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/projects/${projectId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProjectData(response.data);
          setProjectUsers(response.data.users)
        } catch (error) {
          console.error("Error fetching project data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProjectData();
    }
  }, [projectId, isLoggedIn, token]);

  // Fetch issue data for the Task component
  useEffect(() => {
    if (projectId && isLoggedIn) {
      const fetchIssueData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/issue/project/${projectId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIssueData(response.data); // Save the issue data
        } catch (error) {
          console.error("Error fetching issue data:", error);
        }
      };

      fetchIssueData();
    }
  }, [projectId, isLoggedIn, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectData) {
    return <div>No data available</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex w-full gap-10 p-10">
        <div className="w-[70%]">
          <Details projectData={projectData} loggedInUser={loggedInUser} handleRefresh={() => {}} />
          {/* Pass the fetched issueData to the Task component */}
          <Task issueData={issueData} projectId={projectId} token={token} projectUsers={projectUsers} />
        </div>
        <div className="w-[30%]">
          <Chat projectId={projectId} token={token} loggedInUser={loggedInUser} />
        </div>
      </div>
    </>
  );
};

export default Page;
