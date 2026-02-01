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

  /* ================= MENU ================= */
  const [activeMenu, setActiveMenu] = useState("wallet");

  /* ================= USERS ================= */
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(list);
      setFilteredUsers(list);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchUsername.trim()) {
      setFilteredUsers(users); // 🔥 show all users on first click
      return;
    }

    setFilteredUsers(
      users.filter(u =>
        u.username?.toLowerCase().includes(searchUsername.toLowerCase())
      )
    );
  }, [searchUsername, users]);

  /* ================= WALLET ================= */
  const [walletEntries, setWalletEntries] = useState([]);

  useEffect(() => {
    if (activeMenu !== "wallet" || !selectedUserId) {
      setWalletEntries([]);
      return;
    }

    const fetchWallet = async () => {
      const q = query(
        collection(db, "walletVouchers"),
        where("userId", "==", selectedUserId),
        orderBy("date", "asc")
      );
      const snapshot = await getDocs(q);
      setWalletEntries(snapshot.docs.map(doc => doc.data()));
    };

    fetchWallet();
  }, [activeMenu, selectedUserId]);

  /* ================= VOUCHER ================= */
  const [voucherData, setVoucherData] = useState({
    date: "",
    voucherType: "Receipt",
    amount: "",
    narration: "",
    type: "credit"
  });

  const getVoucherType = (docType) =>
    ["Receipt", "Bank Receipt", "Rewards"].includes(docType)
      ? "credit"
      : "debit";

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;

    setVoucherData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "voucherType") {
        updated.type = getVoucherType(value);
      }
      return updated;
    });
  };

  const handleSaveVoucher = async () => {
    if (!selectedUserId || !voucherData.date || !voucherData.amount) {
      alert("Please fill all required fields");
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

    return walletEntries
      .map(entry => {
        let debit = "";
        let credit = "";

        if (entry.type === "debit") {
          balance -= entry.amount;
          debit = entry.amount.toFixed(2);
        } else {
          balance += entry.amount;
          credit = entry.amount.toFixed(2);
        }

        return {
          ...entry,
          debit,
          credit,
          balance: balance.toFixed(2)
        };
      })
      .reverse();
  };

  /* ================= SHARED USER SEARCH ================= */
  const UserSearch = () => (
    <div
      className="user-select-container"
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
    >
      <input
        type="text"
        placeholder="Search or select username"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
      />

      {showSuggestions && (
        <ul className="suggestions">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li
                key={user.id}
                onMouseDown={() => {
                  setSearchUsername(user.username);
                  setSelectedUserId(user.id);
                  setShowSuggestions(false);
                }}
              >
                {user.username}
              </li>
            ))
          ) : (
            <li className="no-results">No users found</li>
          )}
        </ul>
      )}
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
  <div className="sidebar-header">
    <h2 className="logo">Divine ERP</h2>

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>

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


      <main className="main-content">

        {activeMenu === "wallet" && (
          <div className="ledger-wrapper">
            <div className="content">
              <h2>Wallet Ledger</h2>

              <label>Select User *</label>
              <UserSearch />

              {selectedUserId && (
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
                    {calculateLedger().map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.document}</td>
                        <td>{row.narration}</td>
                        <td>{row.debit}</td>
                        <td>{row.credit}</td>
                        <td>{row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeMenu === "voucher" && (
          <div className="voucher-form">
            <h2>Wallet Voucher</h2>

            <label>Select User *</label>
            <UserSearch />

            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={voucherData.date}
              onChange={handleVoucherChange}
            />

            <label>Voucher Type *</label>
            <select
              name="voucherType"
              value={voucherData.voucherType}
              onChange={handleVoucherChange}
            >
              <option>Receipt</option>
              <option>Bank Receipt</option>
              <option>Development Charges</option>
              <option>Subscription</option>
              <option>Rewards</option>
              <option>Custom Development</option>
            </select>

            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={voucherData.amount}
              onChange={handleVoucherChange}
            />

            <label>Narration (Optional)</label>
            <textarea
              name="narration"
              value={voucherData.narration}
              onChange={handleVoucherChange}
            />

            <button className="save-btn" onClick={handleSaveVoucher}>
              Save
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
