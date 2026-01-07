import React from "react";

const Login = () => {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f7f7;
          font-family: Arial, sans-serif;
        }

        .container {
          width: 350px;
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0,0,0,0.2);

          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        input, select {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #bbb;
          border-radius: 5px;
        }

        button {
          width: 100%;
          padding: 10px;
          background: #0174BE;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover {
          background: #015a99;
        }

        .small-text {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
        }

        a {
          text-decoration: none;
        }
      `}</style>

      <div className="container">
        <h2>Login</h2>

        <form action="dashboard.php" method="POST">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />

          <select name="role" required>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <p className="small-text">
          New user? <a href=" ">Register here</a>
        </p>
      </div>
    </>
  );
};

export default Login;
