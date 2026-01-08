// frontend/src/Login.jsx
import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const authenticate = async () => {
    if (!name || !password) {
      setError("Please enter both name and password");
      return;
    }

    const endpoint = isSignup ? "signup" : "login";

    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Authentication failed");
        return;
      }

      onLogin(data.user); // pass logged-in user back to App
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="app-container">
      <h2>{isSignup ? "Create Account" : "Login"}</h2>

      {/* Row: name + password + button */}
      <div className="auth-row">
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary-btn" onClick={authenticate}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </div>

      {/* Error message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Toggle link */}
      <p
        style={{
          marginTop: "15px",
          cursor: "pointer",
          color: "var(--primary)",
          textAlign: "center",
        }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? "Already have an account? Login" : "No account? Create one"}
      </p>
    </div>
  );
}
