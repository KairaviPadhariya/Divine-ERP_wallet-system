import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ Hooks MUST be inside the component
  const [activeMenu, setActiveMenu] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Divine ERP</h2>

        <ul>
          <li
            className={activeMenu === "wallet" ? "active" : ""}
            onClick={() => setActiveMenu("wallet")}
          >
            💰 Wallet
          </li>

          <li
            className={activeMenu === "voucher" ? "active" : ""}
            onClick={() => setActiveMenu("voucher")}
          >
            🎟 Wallet Voucher
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="topbar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* DEFAULT */}
        {activeMenu === "" && (
          <div className="content">
            <h1>Admin Dashboard</h1>
            <p>Select an option from the sidebar.</p>
          </div>
        )}

        {/* WALLET */}
        {activeMenu === "wallet" && (
          <div className="content">
            <h2>Wallet</h2>
            <p>Wallet overview will appear here.</p>
          </div>
        )}

        {/* WALLET VOUCHER FORM */}
        {activeMenu === "voucher" && (
          <div className="voucher-form">
            <h2>Wallet Voucher</h2>

            <div className="form-row">
              <input type="date" />
              <input type="text" placeholder="User Name" />
            </div>

            <div className="form-row">
              <select>
                <option>Receipt</option>
                <option>Bank Receipt</option>
                <option>Development Charges</option>
                <option>Subscription</option>
                <option>Rewards</option>
                <option>Custom Development</option>
                <option>Cloud Space</option>
                <option>Additional User</option>
                <option>Mobile App Renewal</option>
                <option>Additional Mobile Users</option>
              </select>

              <input type="number" placeholder="Amount" />
            </div>

            <textarea placeholder="Narration"></textarea>

            <div className="form-actions">
              <button className="save-btn">Save</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
