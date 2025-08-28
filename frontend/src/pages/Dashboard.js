import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Dashboard = ({ onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          X
        </button>
        <h2>Parental Dashboard--&gt;</h2>
        {data ? (
          <div>
            <h3>Last 3 Days Summary:</h3>
            <p>Total Sessions: {data.totalSessions}</p>
            <p>Overall Average Score: {data.overallAvg.toFixed(2)}</p>

            <h4>Average Scores by Game Type:</h4>
            <ul>
              {Object.keys(data.gameAverages).map((gameType) => (
                <li key={gameType}>
                  {gameType}: {data.gameAverages[gameType].toFixed(2)}
                </li>
              ))}
            </ul>

            <h4>Session Timestamps:</h4>
            <ul>
              {data.sessions && data.sessions.length > 0 ? (
                data.sessions.map((session, index) => (
                  <li key={index}>
                    {new Date(session.date).toLocaleString()}: Score : {session.score}
                  </li>
                ))
              ) : (
                <p>No sessions found.</p>
              )}
            </ul>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;