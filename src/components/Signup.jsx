import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "../styles/auth.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      address,
    } = formData;

    // 🔐 Password check
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 🔍 Check if username already exists
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("Username already taken. Choose another one.");
        return;
      }

      // 🔐 Create user using Firebase Auth (email + password)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 💾 Save user data in Firestore with UID as document ID
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        phone,
        address,
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("Account created successfully ✅");
      navigate("/"); // go to Sign In

      // Reset form
      setFormData({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
      });

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <button className="primary-btn">Create Account</button>

        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
