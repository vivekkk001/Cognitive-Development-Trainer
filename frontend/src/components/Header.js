import { useNavigate } from "react-router-dom";
import "./Header.css";
const Header = ({ isLoggedIn, setIsLoggedIn, setShowDashboard }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      setShowDashboard(true); // Open dashboard popup
    } else {
      navigate("/login"); // Redirect to login
    }
  };

  return (
    <header className="navbar">
      <h1 className="title">Thanmay's Area</h1>
      <button className="home-button" onClick={() => navigate("/Home")}>Home</button>
      <button className="dashboard-btn" onClick={handleDashboardClick}> Parental Dashboard</button>
    </header>
  );
};

export default Header;