const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let notes = [];

// GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// POST new note
app.post("/notes", (req, res) => {
  const newNote = {
    id: Date.now(),
    text: req.body.text,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});
// UPDATE note
app.patch("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.text = text;
  res.json(note);
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.json({ message: "Note deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
