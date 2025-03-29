import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Production.css";

function ProductionPerformance() {
  const [performances, setPerformances] = useState([]);
  const [newPerformance, setNewPerformance] = useState({
    performanceId: "",
    animalId: "",
    date1: "", // Change from 'date' to 'date1'
    productionYield: "",
    weightGain: "",
    otherMetrics: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch production performances from the API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/production-performances")
      .then((response) => {
        const data = response.data.map((performance) => ({
          ...performance,
          date: performance.date1, // Rename 'date1' to 'date'
        }));
        setPerformances(data);
      })
      .catch((error) =>
        console.error("Error fetching production performances:", error)
      );
  }, []);

  // Handle adding a new production performance
  const handleAddPerformance = () => {
    if (
      !newPerformance.performanceId ||
      !newPerformance.animalId ||
      !newPerformance.date1 || // Validate 'date1' instead of 'date'
      !newPerformance.productionYield ||
      !newPerformance.weightGain
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    axios
      .post("http://localhost:5001/api/production-performances", newPerformance)
      .then((response) => {
        setPerformances([...performances, response.data]);
        setNewPerformance({
          performanceId: "",
          animalId: "",
          date1: "", // Reset 'date1' instead of 'date'
          productionYield: "",
          weightGain: "",
          otherMetrics: "",
        });
        setShowForm(false);
      })
      .catch((error) =>
        console.error("Error adding production performance:", error)
      );
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerformance((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle deletion of a production performance
  const handleDeletePerformance = (performanceId) => {
    axios
      .delete(
        `http://localhost:5001/api/production-performances/${performanceId}`
      )
      .then(() => {
        setPerformances(
          performances.filter(
            (performance) => performance.performanceId !== performanceId
          )
        );
      })
      .catch((error) =>
        console.error("Error deleting production performance:", error)
      );
  };

  // Function to calculate summary by animal
  const calculateSummaryByAnimal = () => {
    const summary = {};

    performances.forEach((performance) => {
      const { animalId, productionYield, weightGain } = performance;

      if (!summary[animalId]) {
        summary[animalId] = { count: 0, totalYield: 0, totalWeightGain: 0 };
      }

      summary[animalId].count += 1;
      summary[animalId].totalYield += Number(productionYield || 0);
      summary[animalId].totalWeightGain += Number(weightGain || 0);
    });

    return Object.entries(summary).map(([animalId, data]) => ({
      animalId,
      count: data.count,
      avgYield: (data.totalYield / data.count).toFixed(2),
      avgWeightGain: (data.totalWeightGain / data.count).toFixed(2),
    }));
  };

  const summaryByAnimal = calculateSummaryByAnimal();

  return (
    <div className="production-performance-container">
      <h2>Production Performances</h2>
      <button onClick={() => setShowForm(!showForm)} className="add-btn">
        Add Production Performance
      </button>

      {showForm && (
        <div className="form-container">
          <input
            placeholder="Performance ID"
            name="performanceId"
            value={newPerformance.performanceId}
            onChange={handleInputChange}
          />
          <input
            placeholder="Animal ID"
            name="animalId"
            value={newPerformance.animalId}
            onChange={handleInputChange}
          />
          <input
            type="date"
            placeholder="Date"
            name="date1" // Use 'date1'
            value={newPerformance.date1} // Use 'date1'
            onChange={handleInputChange}
          />
          <input
            placeholder="Production Yield"
            name="productionYield"
            value={newPerformance.productionYield}
            onChange={handleInputChange}
          />
          <input
            placeholder="Weight Gain"
            name="weightGain"
            value={newPerformance.weightGain}
            onChange={handleInputChange}
          />
          <input
            placeholder="Other Metrics"
            name="otherMetrics"
            value={newPerformance.otherMetrics}
            onChange={handleInputChange}
          />
          <button onClick={handleAddPerformance} className="submit-btn">
            Submit
          </button>
        </div>
      )}

      <table className="production-performance-table">
        <thead>
          <tr>
            <th>Performance ID</th>
            <th>Animal ID</th>
            <th>Date</th>
            <th>Production Yield</th>
            <th>Weight Gain</th>
            <th>Other Metrics</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {performances.map((performance) => (
            <tr key={performance.performanceId}>
              <td>{performance.performanceId}</td>
              <td>{performance.animalId}</td>
              <td>{new Date(performance.date).toLocaleDateString()}</td>{" "}
              {/* Display date */}
              <td>{performance.productionYield}</td>
              <td>{performance.weightGain}</td>
              <td>{performance.otherMetrics}</td>
              <td>
                <button
                  onClick={() =>
                    handleDeletePerformance(performance.performanceId)
                  }
                  className="delete-btn"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-per-animal">
        <h3>Summary by Animal ID</h3>
        <table className="animal-summary-table">
          <thead>
            <tr>
              <th>Animal ID</th>
              <th>Total Performances</th>
              <th>Average Production Yield</th>
              <th>Average Weight Gain</th>
            </tr>
          </thead>
          <tbody>
            {summaryByAnimal.map((summary) => (
              <tr key={summary.animalId}>
                <td>{summary.animalId}</td>
                <td>{summary.count}</td>
                <td>{summary.avgYield} units</td>
                <td>{summary.avgWeightGain} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductionPerformance;
