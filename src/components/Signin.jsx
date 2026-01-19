import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "../styles/auth.css";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

import { collection, query, where, getDocs } from "firebase/firestore";

const Signin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔍 Find user by username
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Username not found ❌");
        return;
      }

      // Get user data
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;
      const role = userData.role;

      // 🔐 Login with email + password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Save login info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("uid", user.uid);

      // 🔁 Redirect by role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="primary-btn" type="submit">
          Sign In →
        </button>

        <p className="bottom-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signin;
