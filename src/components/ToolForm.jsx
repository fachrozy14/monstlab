import { useState } from "react";

export default function ToolForm({ jobs, onSaved }) {
  const [jobId, setJobId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const addTool = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setMsg("");
      const res = await fetch("/.netlify/functions/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: Number(jobId), name, description }),
      });
      if (!res.ok) throw new Error("Failed");
      setJobId("");
      setName("");
      setDescription("");
      onSaved && onSaved();
      setMsg("Added!");
      setTimeout(()=>setMsg(""), 1200);
    } catch (e) {
      console.error(e);
      setMsg("Error adding tool");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={addTool} className="space-y-3">
      <select
        className="w-full border rounded-xl p-2"
        value={jobId}
        onChange={(e)=>setJobId(e.target.value)}
        required
      >
        <option value="">Select a job…</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        className="w-full border rounded-xl p-2"
        placeholder="Tool name"
        required
      />
      <textarea
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        className="w-full border rounded-xl p-2"
        placeholder="Short description (optional)"
        rows="3"
      />
      <button disabled={busy} className="bg-black text-white rounded-xl px-4 py-2">
        {busy ? "Saving…" : "Add Tool"}
      </button>
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
    </form>
  );
}
