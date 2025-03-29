import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await axios.get("http://localhost:5001/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is successful, set the user data
        setUserData(response.data);
      } catch (error) {
        // Handle errors
        if (error.response) {
          // The request was made and the server responded with a status code
          setError(
            `Error: ${error.response.status} - ${error.response.data.message}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          setError("No response from server. Please check the backend.");
        } else {
          // Something went wrong setting up the request
          setError("Error fetching data");
        }
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Profile Information</h1>
      <div style={styles.info}>
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {userData.phoneNumber}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f8f8f8",
  },
  info: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Profile;
