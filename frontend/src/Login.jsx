if (!user) {
  return (
    <div className="app-container">
      <h2>{isSignup ? "Create Account" : "Login"}</h2>

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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="primary-btn" onClick={authenticate}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p
        style={{ marginTop: "10px", cursor: "pointer", color: "#6c63ff" }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? "Already have an account? Login" : "No account? Create one"}
      </p>
    </div>
  );
}
