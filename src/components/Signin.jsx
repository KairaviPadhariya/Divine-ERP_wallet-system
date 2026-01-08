import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "../styles/auth.css";

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Fake role logic
    let role = "user";
    if (username.toLowerCase() === "admin") {
      role = "admin";
    }

    // ✅ Store login info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);

    // ✅ Redirect correctly
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
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
