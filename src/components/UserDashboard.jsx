import { auth } from "../firebase";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [walletEntries, setWalletEntries] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchWallet = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "walletVouchers"),
        where("userId", "==", user.uid),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setWalletEntries(data);
    };

    fetchWallet();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const calculateLedger = () => {
    let balance = 0;

    const updatedEntries = walletEntries.map(entry => {
      let debit = "";
      let credit = "";

      if (entry.type === "debit") {
        balance -= entry.amount;
        debit = entry.amount.toFixed(2);
      } else {
        balance += entry.amount;
        credit = entry.amount.toFixed(2);
      }

      const absBal = Math.abs(balance).toFixed(2);
      const suffix = balance >= 0 ? "Cr" : "Dr";

      return {
        ...entry,
        debit,
        credit,
        balance: balance === 0 ? "0.00" : `${absBal} ${suffix}`
      };
    });

    return updatedEntries.reverse();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">Divine ERP</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <ul>
          <li className="active">💰 Wallet</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">Wallet</h1>

        <div className="table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Document</th>
                <th>Narration</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {calculateLedger().map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.document}</td>
                  <td>{item.narration}</td>
                  <td>{item.debit}</td>
                  <td>{item.credit}</td>
                  <td>{item.balance}</td>
                </tr>
              ))}

              {walletEntries.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No wallet records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
