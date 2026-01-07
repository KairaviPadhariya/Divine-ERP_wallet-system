import "../styles/auth.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      {/* Left Section */}
      <div className="auth-left">
        <div className="icon-box">👤+</div>
        <h1>Join our exclusive community today.</h1>
        <p>
          Experience a new standard of digital interaction. Create your
          account to access premium features, connect with peers, and
          streamline your workflow.
        </p>
      </div>

      {/* Right Section */}
      <div className="auth-right">{children}</div>
    </div>
  );
};

export default AuthLayout;
