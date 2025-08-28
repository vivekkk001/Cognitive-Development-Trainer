import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = process.env.BACKEND_URL;
const Login = ({ setIsLoggedIn, setShowDashboard, setShowLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true); // Update login state
      setShowDashboard(true); // Show dashboard popup
      setShowLoginSuccess(true); // Show login success popup

      // Hide login success popup after 3 seconds
      setTimeout(() => {
        setShowLoginSuccess(false);
      }, 3000);

      navigate("/"); // Redirect to home page
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
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
        <h2 style={styles.title}>Parent Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
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
          <button
            type="submit"
            style={styles.submitButton}
          >
            Login
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.signupText}>
          Don't have an account? <a href="/signup" style={styles.signupLink}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "5x",
    backgroundColor: "linear-gradient(135deg, #418f8d, #68c5b5, #2c3e50)",
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

export default Login;