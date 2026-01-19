import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
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

  useEffect(() => {
    if (activeMenu !== "wallet") return;

    const fetchWallet = async () => {
      const q = query(
        collection(db, "walletVouchers"),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setWalletEntries(data);
    };

    fetchWallet();
  }, [activeMenu]);

  /* ================= VOUCHER ================= */
  const [voucherData, setVoucherData] = useState({
    date: "",
    voucherType: "Receipt",
    amount: "",
    narration: ""
  });

  const handleVoucherChange = (e) => {
    setVoucherData({
      ...voucherData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveVoucher = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    const isCredit =
      voucherData.voucherType === "Receipt" ||
      voucherData.voucherType === "Bank Receipt";

    await addDoc(collection(db, "walletVouchers"), {
      userId: selectedUserId,
      date: voucherData.date,
      document: voucherData.voucherType,
      narration: voucherData.narration,
      amount: Number(voucherData.amount),
      type: isCredit ? "credit" : "debit",
      createdBy: "admin",
      createdAt: Timestamp.now()
    });

    alert("Voucher saved successfully ✅");

    setVoucherData({
      date: "",
      voucherType: "Receipt",
      amount: "",
      narration: ""
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

    return walletEntries.map(entry => {
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
        balance:
          balance >= 0
            ? `${balance.toFixed(2)} Cr`
            : `${Math.abs(balance).toFixed(2)} Dr`
      };
    });
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
