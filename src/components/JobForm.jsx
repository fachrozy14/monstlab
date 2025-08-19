import { useState } from "react";

export default function JobForm({ onSaved }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const addJob = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setBusy(true);
      setMsg("");
      const res = await fetch("/.netlify/functions/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed");
      setTitle("");
      onSaved && onSaved();
      setMsg("Added!");
      setTimeout(()=>setMsg(""), 1200);
    } catch (e) {
      console.error(e);
      setMsg("Error adding job");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={addJob} className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-xl p-2"
        placeholder="e.g., Frontend Developer"
        required
      />
      <button disabled={busy} className="bg-black text-white rounded-xl px-4 py-2">
        {busy ? "Saving…" : "Add Job"}
      </button>
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
    </form>
  );
}
