import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const Signup = () => {
  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Create an account</h2>

        <input type="text" placeholder="Full Name" />
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />

        <button className="primary-btn">Create Account →</button>

        <p className="bottom-text">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
