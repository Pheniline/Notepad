const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -------- USERS ----------
let users = [];

// Signup
app.post("/signup", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).json({ message: "All fields required" });

  const userExists = users.find((u) => u.name === name);
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const newUser = { id: Date.now(), name, password };
  users.push(newUser);
  res.status(201).json({ message: "Account created", user: newUser });
});

// Login
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => u.name === name && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

// -------- NOTES ----------
let notes = [];

// GET all notes
app.get("/notes", (req, res) => res.json(notes));

// POST note
app.post("/notes", (req, res) => {
  const { text, color } = req.body;
  const newNote = { id: Date.now(), text, color: color || "#f9f9fb" };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// PATCH note
app.patch("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const { text, color } = req.body;
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  note.text = text;
  if (color) note.color = color;
  res.json(note);
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.json({ message: "Note deleted" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
