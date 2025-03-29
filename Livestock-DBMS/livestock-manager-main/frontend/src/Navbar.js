import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.websiteName}>HeardWise</div>
      <div style={styles.navLinks}>
        <Link to="/animal" style={styles.link}>
          <button style={styles.navButton}>Animals</button>
        </Link>
        <Link to="/breeding-records" style={styles.link}>
          <button style={styles.navButton}>Breeding Records</button>
        </Link>
        <Link to="/feeding-schedules" style={styles.link}>
          <button style={styles.navButton}>Feeding Schedules</button>
        </Link>
        <Link to="/production-performances" style={styles.link}>
          <button style={styles.navButton}>Production Performances</button>
        </Link>
        <Link to="/Veterinarians" style={styles.link}>
          <button style={styles.navButton}>Veterinarians</button>
        </Link>
        <Link to="/profile" style={styles.link}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
            alt="Profile"
            style={styles.profileImage}
          />
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", // Ensure vertical alignment of the title and buttons
    padding: "1rem",
    backgroundColor: "#2f855a", // Navbar background color (green)
    color: "white",
    fontSize: "1.2rem",
  },
  websiteName: {
    fontWeight: "bold",
    fontSize: "1.5rem", // Increase font size of the title if needed
  },
  navLinks: {
    display: "flex",
    alignItems: "center", // Vertically aligns the buttons with the website name
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    marginLeft: "20px", // Add some spacing to the right of the buttons
  },
  navButton: {
    backgroundColor: "transparent", // Transparent background
    color: "white", // White text color to stand out on the green background
    padding: "10px 20px",
    border: "2px solid #2f855a", // Green border to match navbar background
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s, border-color 0.3s", // Smooth transition for hover effect
    marginLeft: "10px", // Add space between buttons
  },
  link: {
    textDecoration: "none",
  },
};

export default Navbar;
