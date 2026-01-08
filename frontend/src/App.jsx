import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const textareaRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // Auto-resize textarea
  const handleTextChange = (e) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const saveNote = async () => {
    if (!text.trim()) return;

    if (editingId) {
      const res = await fetch(`http://localhost:5000/notes/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const updatedNote = await res.json();
      setNotes(notes.map((n) => (n.id === editingId ? updatedNote : n)));
      setEditingId(null);
    } else {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const newNote = await res.json();
      setNotes([...notes, newNote]);
    }

    setText("");
    textareaRef.current.style.height = "80px";
  };

  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    });

    setNotes(notes.filter((note) => note.id !== id));
  };

  const startEdit = (note) => {
    setText(note.text);
    setEditingId(note.id);

    setTimeout(() => {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }, 0);
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h2>NotePad!🎀</h2>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{
          background: "transparent",
          border: "2px",
          cursor: "pointer",
          fontSize: "12px",
          float: "right",
        }}
      >
        {theme === "light" ? "Darkmode" : "Light mode"}
      </button>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COMPOSER */}
      <div className="composer">
        <textarea
          ref={textareaRef}
          placeholder="Write a note..."
          value={text}
          onChange={handleTextChange}
        />

        <button className="primary-btn" onClick={saveNote}>
          {editingId ? "Update Note" : "Save Note"}
        </button>
      </div>

      {/* NOTES */}
      <ul className="notes-list">
        {filteredNotes.length === 0 && <p className="empty">No notes found</p>}

        {filteredNotes.map((note) => (
          <li key={note.id} className="note-item">
            <span className="note-text">{note.text}</span>

            <div className="note-actions">
              <button onClick={() => startEdit(note)}>Edit note</button>
              <button onClick={() => deleteNote(note.id)}>Delete note</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
