import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", { username, password });
      localStorage.setItem("token", data.token); // Store token
  
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: `url("/home_tom_jerry.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "89.9vh",
        width: "99.99vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={styles.container}>
        <h2 style={styles.title}>Parent Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            autoComplete="off"
          />
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <button type="submit" style={styles.submitButton}>
            Sign Up
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.signupText}>
          Already have an account?{" "}
          <a href="/login" style={styles.signupLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "5x",
    backgroundColor: "#509b8e",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    minWidth: "550px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "white",
    fontFamily:"Candara",
  },
  title: {
    marginBottom: "20px",
    fontSize: "29px",
    fontWeight: "bold",
  },
  form: {
    display: "inline-block",
    textAlign: "left",
    width: "100%",
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "95.6%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "white",
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
    display: "inline-block",
    width: "100%",
  },
  toggleButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  submitButton: {
    padding: "10px",
    width: "100%",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#509b8e",
    marginTop: "10px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
  },
  error: {
    color: "#ff6b6b",
    marginTop: "10px",
  },
  signupText: {
    marginTop: "10px",
    color: "white",
  },
  signupLink: {
    color: "white",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Signup;
