import React, { useState, useEffect } from "react";
import axios from "axios";
import "./healthrecords.css"; // Importing the CSS file

function HealthRecord() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    healthRecordId: "",
    animalId: "",
    date1: "",
    description: "",
    treatment: "",
    veterinarianId: "", // New field for Veterinarian
    nextCheckupDate: "", // New field for Next Checkup Date
  });
  const [showForm, setShowForm] = useState(false);

  // Function to fetch health records from the API
  const fetchHealthRecords = () => {
    axios
      .get("http://localhost:5001/api/health-records")
      .then((response) => {
        setHealthRecords(response.data); // Set the fetched data in state
      })
      .catch((error) => console.error("Error fetching health records:", error));
  };

  // Fetch health records on initial load
  useEffect(() => {
    fetchHealthRecords();
  }, []);

  // Handle the addition of a new health record
  const handleAddRecord = () => {
    // Check if all required fields are filled
    if (
      !newRecord.animalId ||
      !newRecord.date1 ||
      !newRecord.description ||
      !newRecord.treatment ||
      !newRecord.veterinarianId ||
      !newRecord.nextCheckupDate
    ) {
      alert("Please fill in all the fields!");
      return;
    }

    // Post the new record to the API
    axios
      .post("http://localhost:5001/api/health-records", newRecord)
      .then((response) => {
        // Add the new record to the list and reset form
        setHealthRecords((prevState) => [...prevState, response.data]);
        setNewRecord({
          healthRecordId: "",
          animalId: "",
          date1: "",
          description: "",
          treatment: "",
          veterinarianId: "",
          nextCheckupDate: "",
        }); // Reset the form fields
        setShowForm(false); // Close the form
      })
      .catch((error) => console.error("Error adding health record:", error));
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of a health record
  const handleDeleteRecord = (healthRecordId) => {
    axios
      .delete(`http://localhost:5001/api/health-records/${healthRecordId}`)
      .then(() => {
        // Remove the deleted record from the list
        setHealthRecords(
          healthRecords.filter(
            (record) => record.healthRecordId !== healthRecordId
          )
        );
      })
      .catch((error) => console.error("Error deleting health record:", error));
  };

  return (
    <div className="animal-container">
      <h2>Health Records</h2>
      <button className="add-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Health Record"}
      </button>

      {showForm && (
        <div className="form">
          <input
            placeholder="Record ID"
            name="healthRecordId"
            value={newRecord.healthRecordId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Animal ID"
            name="animalId"
            value={newRecord.animalId}
            onChange={handleInputChange}
          />
          <input
            type="date"
            placeholder="Date"
            name="date1"
            value={newRecord.date1}
            onChange={handleInputChange}
          />
          <input
            placeholder="Description"
            name="description"
            value={newRecord.description}
            onChange={handleInputChange}
          />
          <input
            placeholder="Treatment"
            name="treatment"
            value={newRecord.treatment}
            onChange={handleInputChange}
          />
          <input
            placeholder="Veterinarian ID"
            name="veterinarianId"
            value={newRecord.veterinarianId}
            onChange={handleInputChange}
          />
          <input
            type="date"
            placeholder="Next Check-Up Date"
            name="nextCheckupDate"
            value={newRecord.nextCheckupDate}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={handleAddRecord}>
            Submit
          </button>
        </div>
      )}

      <h3>Existing Health Records:</h3>
      <table className="animal-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Treatment</th>
            <th>Veterinarian</th>
            <th>Next Check-Up</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {healthRecords.length === 0 ? (
            <tr>
              <td colSpan="6">No health records found.</td>
            </tr>
          ) : (
            healthRecords.map((record) => (
              <tr key={record.healthRecordId}>
                <td>{record.date1 ? record.date1.substring(0, 10) : "N/A"}</td>
                <td>{record.description}</td>
                <td>{record.treatment}</td>
                <td>{record.veterinarianId}</td>
                <td>
                  {record.nextCheckupDate
                    ? record.nextCheckupDate.substring(0, 10)
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRecord(record.healthRecordId)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HealthRecord;
