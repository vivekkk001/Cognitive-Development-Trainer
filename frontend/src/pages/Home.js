import { useNavigate } from "react-router-dom";
import "./Home.css";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div style={{
        backgroundImage: `url("/home_tom_jerry.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "89.9vh",
        width: "99.99vw"
      }}>
        <div className="play-btn">
          <button className="plbutto" onClick={() => navigate("/game")}>
          Let’s Play ! ! !
        </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
