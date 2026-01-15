import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "../styles/auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

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

  // 1️⃣ Password validation
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    // 2️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 3️⃣ Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      username,
      email,
      phone,
      address,
      role: "user", // default role
      createdAt: serverTimestamp(),
    });

    alert("Account created successfully");
    navigate("/"); // go to Signin page

    // 4️⃣ Reset form
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
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
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
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
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
