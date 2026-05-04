import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard.jsx";
import NoteForm from "../components/NoteForm.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/notes`, {
        withCredentials: true,
      });
      setNotes(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to load notes",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async (values) => {
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/notes`, values, {
        withCredentials: true,
      });
      setNotes((current) => [res.data, ...current]);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to create note",
      );
    }
  };

  const handleUpdate = async (values) => {
    if (!editingNote) return;
    setError("");
    try {
      const res = await axios.put(
        `${API_BASE}/notes/${editingNote.id}`,
        values,
        { withCredentials: true },
      );
      setNotes((current) =>
        current.map((note) => (note.id === editingNote.id ? res.data : note)),
      );
      setEditingNote(null);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to update note",
      );
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await axios.delete(`${API_BASE}/notes/${id}`, { withCredentials: true });
      setNotes((current) => current.filter((note) => note.id !== id));
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to delete note",
      );
    }
  };

  const emptyState = !loading && notes.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
          <NoteForm
            key={editingNote ? editingNote.id : "new"}
            note={editingNote}
            onSubmit={editingNote ? handleUpdate : handleCreate}
            onCancel={editingNote ? () => setEditingNote(null) : undefined}
          />
          {error && (
            <p className="mt-4 rounded-xl border border-rose-900/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Your notes
              </h1>
              <p className="text-sm text-slate-400">
                Create, edit, and manage notes in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={loadNotes}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500 hover:text-cyan-300"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
              Loading notes...
            </div>
          ) : emptyState ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center text-slate-400">
              No notes yet. Create your first note on the left.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => setEditingNote(note)}
                  onDelete={() => handleDelete(note.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
