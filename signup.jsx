import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 You can send formData to backend here
    console.log(formData);

    // 👉 Clear form after submit
    setFormData({
      fullName: "",
      email: "",
      contact: "",
      address: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Create an account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
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

          <button type="submit" className="primary-btn">
            Create Account →
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
