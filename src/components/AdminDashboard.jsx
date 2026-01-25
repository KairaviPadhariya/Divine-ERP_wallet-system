import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("");

  /* ================= USERS ================= */
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  // 🔍 Username search states
  const [searchUsername, setSearchUsername] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(list);
    };
    fetchUsers();
  }, []);

  /* 🔍 AUTOCOMPLETE LOGIC */
  useEffect(() => {
    if (!searchUsername) {
      setFilteredUsers([]);
      return;
    }

    const matches = users.filter(user =>
      user.username?.toLowerCase().includes(searchUsername.toLowerCase())
    );

    setFilteredUsers(matches);
  }, [searchUsername, users]);

  /* ================= WALLET ================= */
  const [walletEntries, setWalletEntries] = useState([]);
  const [selectedWalletUserId, setSelectedWalletUserId] = useState("");

  useEffect(() => {
    if (activeMenu !== "wallet" || !selectedWalletUserId) {
      setWalletEntries([]);
      return;
    }

    const fetchWallet = async () => {
      const q = query(
        collection(db, "walletVouchers"),
        where("userId", "==", selectedWalletUserId),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setWalletEntries(data);
    };

    fetchWallet();
  }, [activeMenu, selectedWalletUserId]);

  /* ================= VOUCHER ================= */
  const [voucherData, setVoucherData] = useState({
    date: "",
    voucherType: "Receipt",
    amount: "",
    narration: "",
    type: "credit"
  });

  const getVoucherType = (docType) => {
    const creditTypes = ["Receipt", "Bank Receipt", "Rewards"];
    return creditTypes.includes(docType) ? "credit" : "debit";
  };

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;

    setVoucherData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "voucherType") {
        newData.type = getVoucherType(value);
      }
      return newData;
    });
  };

  const handleSaveVoucher = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    if (!voucherData.date || !voucherData.amount || !voucherData.narration) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "walletVouchers"), {
      userId: selectedUserId,
      date: voucherData.date,
      document: voucherData.voucherType,
      narration: voucherData.narration,
      amount: Number(voucherData.amount),
      type: voucherData.type,
      createdBy: "admin",
      createdAt: Timestamp.now()
    });

    alert("Voucher saved successfully ✅");

    setVoucherData({
      date: "",
      voucherType: "Receipt",
      amount: "",
      narration: "",
      type: "credit"
    });

    setSearchUsername("");
    setSelectedUserId("");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ================= LEDGER ================= */
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

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">Divine ERP</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <ul>
          <li className={activeMenu === "wallet" ? "active" : ""} onClick={() => setActiveMenu("wallet")}>
            💰 Wallet
          </li>
          <li className={activeMenu === "voucher" ? "active" : ""} onClick={() => setActiveMenu("voucher")}>
            🎟 Wallet Voucher
          </li>
        </ul>
      </aside>

      <main className="main-content">

        {/* 🔍 USER SEARCH (Reusable) */}
        {(activeMenu === "wallet" || activeMenu === "voucher") && (
          <div style={{ position: "relative", width: "300px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search username"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />

            {filteredUsers.length > 0 && (
              <ul className="suggestions">
                {filteredUsers.map(user => (
                  <li
                    key={user.id}
                    onClick={() => {
                      setSearchUsername(user.username);
                      setSelectedUserId(user.id);
                      setSelectedWalletUserId(user.id);
                      setFilteredUsers([]);
                    }}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeMenu === "wallet" && (
          <div className="content">
            <h2>Wallet Ledger</h2>

            {selectedWalletUserId ? (
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
                  {calculateLedger().map((item, i) => (
                    <tr key={i}>
                      <td>{item.date}</td>
                      <td>{item.document}</td>
                      <td>{item.narration}</td>
                      <td>{item.debit}</td>
                      <td>{item.credit}</td>
                      <td>{item.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Please search and select a user.</p>
            )}
          </div>
        )}

        {activeMenu === "voucher" && (
          <div className="voucher-form">
            <h2>Wallet Voucher</h2>

            <input type="date" name="date" value={voucherData.date} onChange={handleVoucherChange} />

            <select name="voucherType" value={voucherData.voucherType} onChange={handleVoucherChange}>
              <option>Receipt</option>
              <option>Bank Receipt</option>
              <option>Rewards</option>
              <option>Subscription</option>
              <option>Development Charges</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={voucherData.amount}
              onChange={handleVoucherChange}
            />

            <textarea
              name="narration"
              placeholder="Narration"
              value={voucherData.narration}
              onChange={handleVoucherChange}
            />

            <button className="save-btn" onClick={handleSaveVoucher}>Save</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
