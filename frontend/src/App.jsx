import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [color, setColor] = useState("#f9f9fb");

  const textareaRef = useRef(null);

  // THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // FETCH NOTES
  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, [user]);

  // AUTH FUNCTIONS
  const authenticate = async () => {
    const endpoint = isSignup ? "signup" : "login";
    const res = await fetch(`http://localhost:5000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setError("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // NOTES FUNCTIONS
  const handleTextChange = (e) => {
    setText(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const saveNote = async () => {
    if (!text.trim()) return;

    if (editingId) {
      const res = await fetch(`http://localhost:5000/notes/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, color }),
      });
      const updated = await res.json();
      setNotes(notes.map((n) => (n.id === editingId ? updated : n)));
      setEditingId(null);
    } else {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, color }),
      });
      const newNote = await res.json();
      setNotes([...notes, newNote]);
    }

    setText("");
    textareaRef.current.style.height = "80px";
  };

  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" });
    setNotes(notes.filter((n) => n.id !== id));
  };

  const startEdit = (note) => {
    setText(note.text);
    setEditingId(note.id);
    setColor(note.color || "#f9f9fb");
    setTimeout(() => {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }, 0);
  };

  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  // LOGIN / SIGNUP SCREEN
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
          {isSignup
            ? "Already have an account? Login"
            : "No account? Create one"}
        </p>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="app-container">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{
          background: "transparent",
          border: "2px",
          fontSize: "12px",
          float: "right",
          cursor: "pointer",
        }}
      >
        {theme === "light" ? "Light mode" : "Dark mode"}
      </button>
      <button
        onClick={logout}
        style={{
          background: "transparent",
          border: "2px",
          fontSize: "12px",
          float: "left",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <h2>Welcome, {user.name} 🎀!</h2>

      {/* SEARCH */}
      <div className="section">
        <div className="section-title">Search</div>
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COMPOSER */}
      <div className="section composer-card">
        <div className="section-title">Write a note</div>
        <textarea
          ref={textareaRef}
          placeholder="Start typing..."
          value={text}
          onChange={handleTextChange}
        />
        <div style={{ margin: "2px 0" }}>
          <label style={{ marginRight: "2px" }}>Pick color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <button className="primary-btn" onClick={saveNote}>
          {editingId ? "Update Note" : "Save Note"}
        </button>
      </div>

      {/* NOTES */}
      <ul className="notes-list">
        {filteredNotes.length === 0 && <p className="empty">No notes found</p>}
        {filteredNotes.map((note) => (
          <li
            key={note.id}
            className="note-item"
            style={{ background: note.color }}
          >
            <span className="note-text">{note.text}</span>
            <div className="note-actions">
              <button onClick={() => startEdit(note)}>Edit note</button>
              <button onClick={() => deleteNote(note.id)}>Delete Note</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
