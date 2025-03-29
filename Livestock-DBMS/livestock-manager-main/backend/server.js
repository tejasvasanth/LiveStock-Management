const express = require("express");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db/connection.js");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 5001;
app.use(cors());
app.use(bodyParser.json());
connectDB();

// Database connection function
async function getDbConnection() {
  try {
    return await oracledb.getConnection({
      user: "system",
      password: "Cookie12", // Replace with your actual password
      connectString: "localhost:1521/FREEPDB1",
    });
  } catch (err) {
    console.error("Database connection error:", err);
    return null;
  }
}

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", async (req, res) => {
  res.send("Healthy server running on" + port);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  //Checking fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Required field/s empty",
    });
  }

  //Parsing through zod types
  try {
    //Checking if email exists already
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const hashedPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!existingUser || !hashedPassword) {
        return res.status(400).json({
          message: "Email or password is incorrect",
        });
      }
      const jwtToken = jwt.sign(
        { email: existingUser.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        message: "SignIn successful!",
        token: jwtToken,
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "Field/s are not of requirements",
    });
  }

  res.status(200).json({
    message: "SignIn unsuccessful, Try again!",
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;
    console.log("here", req.body); // Corrected line

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log("existing", existingUser);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hash,
      name,
      phoneNumber,
    });

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Signup successful!",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during signup. Please try again." });
  }
});
app.get("/api/user", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Add a log to check decoded token

    // Check if the email exists in the database
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const { password, ...userData } = user.toObject();
      return res.json(userData);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during JWT verification or fetching user:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// GET and POST endpoints for each table

// 1. Animal
app.get("/api/animals", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM Animal");
    res.json(
      result.rows.map((row) => ({
        animalid: row[0],
        name: row[1],
        species: row[2],
        breed: row[3],
        dateOfBirth: row[4],
        gender: row[5],
        healthStatus: row[6],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/animals", async (req, res) => {
  const { animalid, name, species, breed, dateOfBirth, gender, healthStatus } =
    req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO Animal (AnimalID, Name, Species, Breed, DateOfBirth, Gender, HealthStatus)
       VALUES (:animalid, :name, :species, :breed, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :healthStatus)`,
      { animalid, name, species, breed, dateOfBirth, gender, healthStatus },
      { autoCommit: true }
    );
    res.status(201).send("Animal record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 2. HealthRecord
app.get("/api/health-records", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM HealthRecord");
    res.json(
      result.rows.map((row) => ({
        healthRecordId: row[0],
        animalId: row[1],
        date1: row[2],
        description: row[3],
        treatment: row[4],
        veterinarianId: row[5],
        nextCheckupDate: row[6],
      }))
    );
  } finally {
    await connection.close();
  }
});
app.post("/api/health-records", async (req, res) => {
  const {
    healthRecordId,
    animalId,
    date1,
    description,
    treatment,
    veterinarianId,
    nextCheckupDate,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO HealthRecord (HealthRecordID, AnimalID, Date1, Description, Treatment, VeterinarianID, NextCheckupDate)
       VALUES (:healthRecordId, :animalId, TO_DATE(:date1, 'YYYY-MM-DD'), :description, :treatment, :veterinarianId, TO_DATE(:nextCheckupDate, 'YYYY-MM-DD'))`,
      {
        healthRecordId,
        animalId,
        date1,
        description,
        treatment,
        veterinarianId,
        nextCheckupDate,
      },
      { autoCommit: true }
    );
    res.status(201).send("Health record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 3. BreedingRecord
app.get("/api/breeding-records", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM BreedingRecord");
    res.json(
      result.rows.map((row) => ({
        breedingRecordId: row[0],
        animalId: row[1],
        partnerAnimalId: row[2],
        breedingDate: row[3],
        result: row[4],
        notes: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/breeding-records", async (req, res) => {
  const {
    breedingRecordId,
    animalId,
    partnerAnimalId,
    breedingDate,
    result,
    notes,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO BreedingRecord (BreedingRecordID, AnimalID, PartnerAnimalID, BreedingDate, Result, Notes)
       VALUES (:breedingRecordId, :animalId, :partnerAnimalId, TO_DATE(:breedingDate, 'YYYY-MM-DD'), :result, :notes)`,
      {
        breedingRecordId,
        animalId,
        partnerAnimalId,
        breedingDate,
        result,
        notes,
      },
      { autoCommit: true }
    );
    res.status(201).send("Breeding record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 4. FeedingSchedule
app.get("/api/feeding-schedules", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM FeedingSchedule");
    res.json(
      result.rows.map((row) => ({
        feedingScheduleId: row[0],
        animalId: row[1],
        feedingDate: row[2],
        feedType: row[3],
        quantity: row[4],
        notes: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/feeding-schedules", async (req, res) => {
  const {
    feedingScheduleId,
    animalId,
    feedingDate,
    feedType,
    quantity,
    notes,
  } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO FeedingSchedule (FeedingScheduleID, AnimalID, FeedingDate, FeedType, Quantity, Notes)
       VALUES (:feedingScheduleId, :animalId, TO_DATE(:feedingDate, 'YYYY-MM-DD'), :feedType, :quantity, :notes)`,
      { feedingScheduleId, animalId, feedingDate, feedType, quantity, notes },
      { autoCommit: true }
    );
    res.status(201).send("Feeding schedule inserted successfully");
  } finally {
    await connection.close();
  }
});

// 5. ProductionPerformance
app.get("/api/production-performances", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "SELECT * FROM ProductionPerformance"
    );
    res.json(
      result.rows.map((row) => ({
        performanceId: row[0],
        animalId: row[1],
        date1: row[2],
        productionYield: row[3],
        weightGain: row[4],
        otherMetrics: row[5],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/production-performances", async (req, res) => {
  const {
    performanceId,
    animalId,
    date1,
    productionYield,
    weightGain,
    otherMetrics,
  } = req.body;

  // Log incoming request data for debugging
  console.log("Received data:", req.body);

  // Validate required fields
  if (
    !performanceId ||
    !animalId ||
    !date1 ||
    !productionYield ||
    !weightGain
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    // Prepare the SQL query and bind parameters
    const result = await connection.execute(
      `INSERT INTO ProductionPerformance (PerformanceID, AnimalID, Date1, ProductionYield, WeightGain, OtherMetrics)
       VALUES (:performanceId, :animalId, TO_DATE(:date1, 'YYYY-MM-DD'), :productionYield, :weightGain, :otherMetrics)`,
      {
        performanceId,
        animalId,
        date1,
        productionYield,
        weightGain,
        otherMetrics,
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("No records were inserted");
    }

    res.status(201).send("Production performance record inserted successfully");
  } catch (error) {
    console.error("Error inserting record:", error);
    res.status(500).send("An error occurred while inserting the record");
  } finally {
    await connection.close();
  }
});

// 6. Veterinarian
app.get("/api/veterinarians", async (req, res) => {
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute("SELECT * FROM Veterinarian");
    res.json(
      result.rows.map((row) => ({
        veterinarianId: row[0],
        name: row[1],
        contactInfo: row[2],
        specialization: row[3],
      }))
    );
  } finally {
    await connection.close();
  }
});

app.post("/api/veterinarians", async (req, res) => {
  const { veterinarianId, name, contactInfo, specialization } = req.body;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    await connection.execute(
      `INSERT INTO Veterinarian (VeterinarianID, Name, ContactInfo, Specialization)
       VALUES (:veterinarianId, :name, :contactInfo, :specialization)`,
      { veterinarianId, name, contactInfo, specialization },
      { autoCommit: true }
    );
    res.status(201).send("Veterinarian record inserted successfully");
  } finally {
    await connection.close();
  }
});

// 1. Animal
app.delete("/api/animals/:animalid", async (req, res) => {
  const { animalid } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM Animal WHERE AnimalID = :animalid",
      { animalid },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Animal record not found");
    }
    res.send("Animal record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 2. HealthRecord
app.delete("/api/health-records/:healthRecordId", async (req, res) => {
  const { healthRecordId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM HealthRecord WHERE HealthRecordID = :healthRecordId",
      { healthRecordId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Health record not found");
    }
    res.send("Health record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 3. BreedingRecord
app.delete("/api/breeding-records/:breedingRecordId", async (req, res) => {
  const { breedingRecordId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM BreedingRecord WHERE BreedingRecordID = :breedingRecordId",
      { breedingRecordId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Breeding record not found");
    }
    res.send("Breeding record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 4. FeedingSchedule
app.delete("/api/feeding-schedules/:feedingScheduleId", async (req, res) => {
  const { feedingScheduleId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM FeedingSchedule WHERE FeedingScheduleID = :feedingScheduleId",
      { feedingScheduleId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Feeding schedule not found");
    }
    res.send("Feeding schedule deleted successfully");
  } finally {
    await connection.close();
  }
});

// 5. ProductionPerformance
app.delete("/api/production-performances/:performanceId", async (req, res) => {
  const { performanceId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM ProductionPerformance WHERE PerformanceID = :performanceId",
      { performanceId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Production performance record not found");
    }
    res.send("Production performance record deleted successfully");
  } finally {
    await connection.close();
  }
});

// 6. Veterinarian
app.delete("/api/veterinarians/:veterinarianId", async (req, res) => {
  const { veterinarianId } = req.params;
  const connection = await getDbConnection();
  if (!connection) return res.status(500).send("Database connection error");

  try {
    const result = await connection.execute(
      "DELETE FROM Veterinarian WHERE VeterinarianID = :veterinarianId",
      { veterinarianId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).send("Veterinarian record not found");
    }
    res.send("Veterinarian record deleted successfully");
  } finally {
    await connection.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
