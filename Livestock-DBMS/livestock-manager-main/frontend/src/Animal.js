import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Animal.css";

function Animal() {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    animalid: "",
    name: "",
    species: "",
    breed: "",
    dateOfBirth: "",
    gender: "",
    healthStatus: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch the list of animals from the API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/animals")
      .then((response) => setAnimals(response.data))
      .catch((error) => console.error("Error fetching animals:", error));
  }, []);

  // Handle the addition of a new animal
  const handleAddAnimal = () => {
    axios
      .post("http://localhost:5001/api/animals", newAnimal)
      .then((response) => {
        setAnimals([...animals, newAnimal]); // Add the new animal to the list
        setNewAnimal({
          animalid: "",
          name: "",
          species: "",
          breed: "",
          dateOfBirth: "",
          gender: "",
          healthStatus: "",
        }); // Reset the form
        setShowForm(false); // Close the form
      })
      .catch((error) => console.error("Error adding animal:", error));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of an animal
  const handleDeleteAnimal = (animalid) => {
    axios
      .delete(`http://localhost:5001/api/animals/${animalid}`)
      .then(() => {
        // Remove the deleted animal from the state
        setAnimals(animals.filter((animal) => animal.animalid !== animalid));
      })
      .catch((error) => console.error("Error deleting animal:", error));
  };

  return (
    <div className="animal-container">
      <button className="add-button" onClick={() => setShowForm(!showForm)}>
        Add Animal
      </button>

      {showForm && (
        <div className="form">
          <input
            placeholder="Animal ID"
            name="animalid"
            value={newAnimal.animalid}
            onChange={handleInputChange}
          />
          <input
            placeholder="Name"
            name="name"
            value={newAnimal.name}
            onChange={handleInputChange}
          />
          <input
            placeholder="Species"
            name="species"
            value={newAnimal.species}
            onChange={handleInputChange}
          />
          <input
            placeholder="Breed"
            name="breed"
            value={newAnimal.breed}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            value={newAnimal.dateOfBirth}
            onChange={handleInputChange}
          />
          <select
            name="gender"
            value={newAnimal.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            placeholder="Health Status"
            name="healthStatus"
            value={newAnimal.healthStatus}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={handleAddAnimal}>
            Submit
          </button>
        </div>
      )}

      <table className="animal-table">
        <thead>
          <tr>
            <th>Animal ID</th>
            <th>Name</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Health Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.animalid}>
              <td>{animal.animalid}</td>
              <td>{animal.name}</td>
              <td>{animal.species}</td>
              <td>{animal.breed}</td>
              <td>
                {animal.dateOfBirth ? animal.dateOfBirth.slice(0, 10) : "N/A"}
              </td>
              <td>{animal.gender}</td>
              <td>
                {/* Add link to Health Record Page */}
                <Link to={`/health-records/${animal.animalid}`}>
                  {animal.healthStatus}
                </Link>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAnimal(animal.animalid)}
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

export default Animal;
