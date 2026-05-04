export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            {note.title || "Untitled note"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {note.created_at ? new Date(note.created_at).toLocaleString() : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-cyan-500 hover:text-cyan-300"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-rose-900/60 px-3 py-1 text-xs text-rose-200 hover:border-rose-500"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
        {note.content || "No content"}
      </p>

      {Array.isArray(note.tags) && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
