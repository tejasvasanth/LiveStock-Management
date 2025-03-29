import React, { useState, useEffect } from "react";
import axios from "axios";
import "./breeding.css"; // Import the CSS file

function BreedingRecord() {
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    breedingRecordId: "",
    animalId: "",
    partnerAnimalId: "",
    breedingDate: "",
    result: "",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch breeding records from the API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/breeding-records")
      .then((response) => setBreedingRecords(response.data))
      .catch((error) =>
        console.error("Error fetching breeding records:", error)
      );
  }, []);

  // Handle adding a new breeding record
  const handleAddRecord = () => {
    axios
      .post("http://localhost:5001/api/breeding-records", newRecord)
      .then((response) => {
        setBreedingRecords([...breedingRecords, response.data]);
        setNewRecord({
          breedingRecordId: "",
          animalId: "",
          partnerAnimalId: "",
          breedingDate: "",
          result: "",
          notes: "",
        });
        setShowForm(false);
      })
      .catch((error) => console.error("Error adding breeding record:", error));
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of a breeding record
  const handleDeleteRecord = (breedingRecordId) => {
    axios
      .delete(`http://localhost:5001/api/breeding-records/${breedingRecordId}`)
      .then(() => {
        setBreedingRecords(
          breedingRecords.filter(
            (record) => record.breedingRecordId !== breedingRecordId
          )
        );
      })
      .catch((error) =>
        console.error("Error deleting breeding record:", error)
      );
  };

  return (
    <div className="breeding-container">
      <h2>Breeding Records</h2>
      <button onClick={() => setShowForm(!showForm)} className="add-button">
        Add Breeding Record
      </button>

      {showForm && (
        <div className="form">
          <input
            placeholder="Breeding Record ID"
            name="breedingRecordId"
            value={newRecord.breedingRecordId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Animal ID"
            name="animalId"
            value={newRecord.animalId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Partner Animal ID"
            name="partnerAnimalId"
            value={newRecord.partnerAnimalId}
            onChange={handleInputChange}
          />
          <input
            type="date"
            placeholder="Breeding Date"
            name="breedingDate"
            value={newRecord.breedingDate}
            onChange={handleInputChange}
          />
          <input
            placeholder="Result"
            name="result"
            value={newRecord.result}
            onChange={handleInputChange}
          />
          <input
            placeholder="Notes"
            name="notes"
            value={newRecord.notes}
            onChange={handleInputChange}
          />
          <button onClick={handleAddRecord} className="submit-button">
            Submit
          </button>
        </div>
      )}

      {/* Table for displaying breeding records */}
      <table className="breeding-table">
        <thead>
          <tr>
            <th>Breeding Record ID</th>
            <th>Animal ID</th>
            <th>Partner Animal ID</th>
            <th>Breeding Date</th>
            <th>Result</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {breedingRecords.map((record) => (
            <tr key={record.breedingRecordId}>
              <td>{record.breedingRecordId}</td>
              <td>{record.animalId}</td>
              <td>{record.partnerAnimalId}</td>
              <td>{new Date(record.breedingDate).toLocaleDateString()}</td>
              <td>{record.result}</td>
              <td>{record.notes}</td>
              <td>
                <button
                  onClick={() => handleDeleteRecord(record.breedingRecordId)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BreedingRecord;
