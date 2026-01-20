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

  /* ================= WALLET ================= */
  const [walletEntries, setWalletEntries] = useState([]);
  const [selectedWalletUserId, setSelectedWalletUserId] = useState("");

  useEffect(() => {
    if (activeMenu !== "wallet") return;

    const fetchWallet = async () => {
      let q;

      if (selectedWalletUserId) {
        q = query(
          collection(db, "walletVouchers"),
          where("userId", "==", selectedWalletUserId),
          orderBy("date", "asc")
        );
      } else {
        // If no user selected, maybe show nothing or clear list
        // Or if you really want to show something, but without balance it's confusing
        setWalletEntries([]);
        return;
      }

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
    type: "credit" // Default to credit for Receipt
  });

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;

    setVoucherData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-set type based on voucherType selection (only if user changes voucherType)
      if (name === "voucherType") {
        const creditTypes = ["Receipt", "Bank Receipt", "Rewards"];
        const isCredit = creditTypes.includes(value);
        newData.type = isCredit ? "credit" : "debit";
      }

      return newData;
    });
  };

  const handleSaveVoucher = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    await addDoc(collection(db, "walletVouchers"), {
      userId: selectedUserId,
      date: voucherData.date,
      document: voucherData.voucherType,
      narration: voucherData.narration,
      amount: Number(voucherData.amount),
      type: voucherData.type, // Use selected type
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

    // Calculate running balance
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

      // Format balance with Dr/Cr
      const absBal = Math.abs(balance).toFixed(2);
      const suffix = balance >= 0 ? "Cr" : "Dr";

      return {
        ...entry,
        debit,
        credit,
        balance: balance === 0 ? "0.00" : `${absBal} ${suffix}`
      };
    });

    // CHANGE: Reverse for display (Newest First)
    return updatedEntries.reverse();
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
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

      <main className="main-content">
        <div className="topbar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {activeMenu === "wallet" && (
          <div className="content">
            <h2>Wallet Ledger</h2>

            {/* User Filter for Wallet View */}
            <div style={{ marginBottom: "20px" }}>
              <select
                value={selectedWalletUserId}
                onChange={(e) => setSelectedWalletUserId(e.target.value)}
                style={{ padding: "10px", width: "300px" }}
              >
                <option value="">Select User to View Ledger</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

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
                  {walletEntries.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <p>Please select a user to view their wallet ledger.</p>
            )}
          </div>
        )}

        {activeMenu === "voucher" && (
          <div className="voucher-form">
            <h2>Wallet Voucher</h2>

            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select User</option>

              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>


            <div className="form-row">
              <input
                type="date"
                name="date"
                value={voucherData.date}
                onChange={handleVoucherChange}
              />
            </div>

            <div className="form-row">
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
                <option>Cloud Space</option>
                <option>Additional User</option>
                <option>Mobile App Renewal</option>
                <option>Additional Mobile Users</option>
              </select>

              {/* Transaction Type Selector */}
              <select
                name="type"
                value={voucherData.type}
                onChange={handleVoucherChange}
                style={{ width: "120px" }}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={voucherData.amount}
                onChange={handleVoucherChange}
              />
            </div>

            <textarea
              name="narration"
              placeholder="Narration"
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
