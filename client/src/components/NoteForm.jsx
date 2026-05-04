import { useEffect, useState } from "react";

export default function NoteForm({ note, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags(Array.isArray(note?.tags) ? note.tags.join(", ") : "");
  }, [note]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, tags });
    if (!note) {
      setTitle("");
      setContent("");
      setTags("");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {note ? "Edit note" : "Create note"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Keep it simple. Title, content, and tags.
        </p>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows="8"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
      />

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags separated by commas"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 hover:bg-cyan-300"
        >
          {note ? "Update" : "Create"}
        </button>
        {note && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 px-4 py-3 text-slate-200 hover:border-cyan-500 hover:text-cyan-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
