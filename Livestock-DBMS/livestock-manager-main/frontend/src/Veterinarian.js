import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Veterinarian.css"; // Assuming you have a CSS file for styling

function Veterinarian() {
  const [veterinarians, setVeterinarians] = useState([]);
  const [newVeterinarian, setNewVeterinarian] = useState({
    veterinarianId: "",
    name: "",
    contactInfo: "",
    specialization: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch the list of veterinarians from the API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/veterinarians")
      .then((response) => setVeterinarians(response.data))
      .catch((error) => console.error("Error fetching veterinarians:", error));
  }, []);

  // Handle the addition of a new veterinarian
  const handleAddVeterinarian = () => {
    axios
      .post("http://localhost:5001/api/veterinarians", newVeterinarian)
      .then((response) => {
        setVeterinarians([...veterinarians, response.data]); // Add the new veterinarian to the list
        setNewVeterinarian({
          veterinarianId: "",
          name: "",
          contactInfo: "",
          specialization: "",
        }); // Reset the form fields
        setShowForm(false); // Close the form
      })
      .catch((error) => console.error("Error adding veterinarian:", error));
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVeterinarian((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of a veterinarian
  const handleDeleteVeterinarian = (veterinarianId) => {
    axios
      .delete(`http://localhost:5001/api/veterinarians/${veterinarianId}`)
      .then((response) => {
        console.log("Delete response:", response);
        // Remove the deleted veterinarian from the state
        setVeterinarians((prevVeterinarians) =>
          prevVeterinarians.filter(
            (vet) => vet.veterinarianId !== veterinarianId
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting veterinarian:", error);
      });
  };

  // Filter veterinarians based on the search query
  const filteredVeterinarians = veterinarians.filter(
    (vet) =>
      vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="veterinarian-container">
      <h2>Veterinarians</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          Add Veterinarian
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <input
            placeholder="Veterinarian ID"
            name="veterinarianId"
            value={newVeterinarian.veterinarianId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Name"
            name="name"
            value={newVeterinarian.name}
            onChange={handleInputChange}
          />
          <input
            placeholder="Contact Info"
            name="contactInfo"
            value={newVeterinarian.contactInfo}
            onChange={handleInputChange}
          />
          <input
            placeholder="Specialization"
            name="specialization"
            value={newVeterinarian.specialization}
            onChange={handleInputChange}
          />
          <button onClick={handleAddVeterinarian} className="submit-btn">
            Submit
          </button>
        </div>
      )}

      {/* Table displaying veterinarians */}
      <table className="veterinarian-table">
        <thead>
          <tr>
            <th>Veterinarian ID</th>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVeterinarians.map((vet) => (
            <tr key={vet.veterinarianId}>
              <td>{vet.veterinarianId}</td>
              <td>{vet.name}</td>
              <td>{vet.contactInfo}</td>
              <td>{vet.specialization}</td>
              <td>
                <button
                  onClick={() => handleDeleteVeterinarian(vet.veterinarianId)}
                  className="delete-btn"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Veterinarian;
