import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedingSchedule.css"; // Import the CSS file

function FeedingSchedule() {
  const [feedingSchedules, setFeedingSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    feedingScheduleId: "",
    animalId: "",
    feedingDate: "",
    feedType: "",
    quantity: "",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error messages

  // Fetch feeding schedules from the API
  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    axios
      .get("http://localhost:5001/api/feeding-schedules")
      .then((response) => {
        setFeedingSchedules(response.data);
        setLoading(false); // Set loading to false after successful fetch
      })
      .catch((error) => {
        console.error("Error fetching feeding schedules:", error);
        setError("Error fetching feeding schedules");
        setLoading(false); // Stop loading even on error
      });
  }, []);

  // Handle adding a new feeding schedule
  const handleAddSchedule = () => {
    setLoading(true); // Set loading to true during post request
    axios
      .post("http://localhost:5001/api/feeding-schedules", newSchedule)
      .then((response) => {
        setFeedingSchedules([...feedingSchedules, response.data]);
        setNewSchedule({
          feedingScheduleId: "",
          animalId: "",
          feedingDate: "",
          feedType: "",
          quantity: "",
          notes: "",
        });
        setShowForm(false);
        setLoading(false); // Stop loading after adding
      })
      .catch((error) => {
        console.error("Error adding feeding schedule:", error);
        setError("Error adding feeding schedule");
        setLoading(false); // Stop loading on error
      });
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of a feeding schedule
  const handleDeleteSchedule = (feedingScheduleId) => {
    setLoading(true); // Set loading to true during delete request
    axios
      .delete(
        `http://localhost:5001/api/feeding-schedules/${feedingScheduleId}`
      )
      .then(() => {
        setFeedingSchedules(
          feedingSchedules.filter(
            (schedule) => schedule.feedingScheduleId !== feedingScheduleId
          )
        );
        setLoading(false); // Stop loading after deletion
      })
      .catch((error) => {
        console.error("Error deleting feeding schedule:", error);
        setError("Error deleting feeding schedule");
        setLoading(false); // Stop loading on error
      });
  };

  // Format the date properly for display
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Disable submit button if any required field is empty
  const isSubmitDisabled =
    !newSchedule.feedingScheduleId ||
    !newSchedule.animalId ||
    !newSchedule.feedingDate ||
    !newSchedule.feedType ||
    !newSchedule.quantity;

  return (
    <div className="feeding-schedule-container">
      <h2>Feeding Schedules</h2>
      <button onClick={() => setShowForm(!showForm)} className="add-btn">
        Add Feeding Schedule
      </button>

      {showForm && (
        <div className="form-container">
          <input
            placeholder="Feeding Schedule ID"
            name="feedingScheduleId"
            value={newSchedule.feedingScheduleId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Animal ID"
            name="animalId"
            value={newSchedule.animalId}
            onChange={handleInputChange}
          />
          <input
            type="date"
            placeholder="Feeding Date"
            name="feedingDate"
            value={newSchedule.feedingDate}
            onChange={handleInputChange}
          />
          <input
            placeholder="Feed Type"
            name="feedType"
            value={newSchedule.feedType}
            onChange={handleInputChange}
          />
          <input
            placeholder="Quantity"
            name="quantity"
            value={newSchedule.quantity}
            onChange={handleInputChange}
          />
          <input
            placeholder="Notes"
            name="notes"
            value={newSchedule.notes}
            onChange={handleInputChange}
          />
          <button
            onClick={handleAddSchedule}
            className="submit-btn"
            disabled={isSubmitDisabled || loading} // Disable button if any input is missing or loading
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading message */}
      {loading && <p className="loading-message">Loading...</p>}

      {/* Table displaying feeding schedules */}
      <table className="feeding-schedules-table">
        <thead>
          <tr>
            <th>Feeding Schedule ID</th>
            <th>Animal ID</th>
            <th>Feeding Date</th>
            <th>Feed Type</th>
            <th>Quantity</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedingSchedules.map((schedule) => (
            <tr key={schedule.feedingScheduleId}>
              <td>{schedule.feedingScheduleId}</td>
              <td>{schedule.animalId}</td>
              <td>{formatDate(schedule.feedingDate)}</td>
              <td>{schedule.feedType}</td>
              <td>{schedule.quantity}</td>
              <td>{schedule.notes}</td>
              <td>
                <button
                  onClick={() =>
                    handleDeleteSchedule(schedule.feedingScheduleId)
                  }
                  className="delete-btn"
                  disabled={loading} // Disable delete button if loading
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedingSchedule;
