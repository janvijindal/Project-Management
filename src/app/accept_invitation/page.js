"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/config/api"; // Ensure BASE_URL is correctly imported

const AcceptInvitationPage = () => {
  const router = useRouter(); // Initialize router
  const [jwt, setJwt] = useState(null); // State to store JWT
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [token, setToken] = useState(""); // State to store token from URL

  useEffect(() => {
    // Retrieve JWT only on the client side
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
    }

    // Extract token from URL query
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const handleAcceptInvitation = async () => {
    if (!jwt || !token) {
      toast.error("JWT or token is missing.");
      return; // Ensure JWT and token are available
    }

    setIsLoading(true); // Set loading state

    try {
      const response = await axios.get(`${BASE_URL}/api/projects/accept_invitation`, {
        params: { token },
        headers: {
          Authorization: `Bearer ${jwt}`, // Ensure correct formatting
        },
      });

      console.log(response)
      const { redirectUrl } = response.data; // Extract redirect URL from response

      if (response.status === 200 && redirectUrl) { // Check for successful response
        toast.success("Invitation accepted successfully!");
        router.push(redirectUrl); // Redirect to the project page or another page after acceptance
      } else {
        toast.error("Failed to accept invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleAcceptInvitation}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  );
};

export default AcceptInvitationPage;
