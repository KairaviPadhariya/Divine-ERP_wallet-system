import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Divine ERP</h2>
        <ul>
          <li className="active">💰 Wallet</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="topbar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="content">
          <h1>Wallet</h1>
          <p>Your wallet details will appear here.</p>
        </div>
      </main>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="whatsapp"
        >
          💬
        </a>
        <a href="tel:+919999999999" className="call">
          📞
        </a>
      </div>
    </div>
  );
};

export default UserDashboard;
