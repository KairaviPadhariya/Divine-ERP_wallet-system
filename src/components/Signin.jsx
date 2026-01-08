import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Welcome back</h2>

        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />

        <button className="primary-btn">Sign In →</button>

        <p className="bottom-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
