import { useEffect, useState } from "react";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newJob, setNewJob] = useState("");

  async function loadJobs() {
    setLoading(true);
    const res = await fetch("/.netlify/functions/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  async function addJob() {
    if (!newJob.trim()) return;
    await fetch("/.netlify/functions/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newJob }),
    });
    setNewJob("");
    loadJobs();
  }

  async function deleteJob(id) {
    await fetch(`/.netlify/functions/jobs?id=${id}`, { method: "DELETE" });
    loadJobs();
  }

  async function addTool(jobId, name, description) {
    await fetch("/.netlify/functions/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId, name, description }),
    });
    loadJobs();
  }

  async function deleteTool(id) {
    await fetch(`/.netlify/functions/tools?id=${id}`, { method: "DELETE" });
    loadJobs();
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jobs & Tools</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={newJob}
          onChange={(e) => setNewJob(e.target.value)}
          placeholder="New job title"
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={addJob}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Job
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="border rounded p-4 mb-4 shadow">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{job.title}</h2>
              <button
                onClick={() => deleteJob(job.id)}
                className="text-red-500"
              >
                Delete Job
              </button>
            </div>

            <ul className="mt-2">
              {job.tools?.map((tool) => (
                <li key={tool.id} className="flex justify-between">
                  <span>
                    {tool.name} – {tool.description}
                  </span>
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="text-sm text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <AddToolForm jobId={job.id} onAdded={loadJobs} />
          </div>
        ))
      )}
    </div>
  );
}

function AddToolForm({ jobId, onAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/.netlify/functions/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId, name, description }),
    });
    setName("");
    setDescription("");
    onAdded();
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mt-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tool name"
        className="border rounded p-2 flex-1"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border rounded p-2 flex-1"
      />
      <button className="bg-green-500 text-white px-3 rounded">Add</button>
    </form>
  );
}
