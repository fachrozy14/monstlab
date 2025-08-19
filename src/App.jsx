import { useEffect, useMemo, useState } from "react";
import JobForm from "./components/JobForm.jsx";
import ToolForm from "./components/ToolForm.jsx";
import JobList from "./components/JobList.jsx";
import ToolList from "./components/ToolList.jsx";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [jobsRes, toolsRes] = await Promise.all([
        fetch("/.netlify/functions/jobs"),
        fetch("/.netlify/functions/tools"),
      ]);
      setJobs(await jobsRes.json());
      setTools(await toolsRes.json());
    } catch (e) {
      console.error(e);
      setError("Failed to load data. Check your API or environment variables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const toolsByJobId = useMemo(() => {
    const map = {};
    for (const t of tools) {
      map[t.job_id] = map[t.job_id] || [];
      map[t.job_id].push(t);
    }
    return map;
  }, [tools]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job & Tool Recommender</h1>
        <a className="text-sm underline" href="https://neon.tech" target="_blank" rel="noreferrer">Neon Postgres</a>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add a Job</h2>
          <JobForm onSaved={fetchAll} />
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add a Tool</h2>
          <ToolForm jobs={jobs} onSaved={fetchAll} />
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Jobs</h2>
            <JobList jobs={jobs} />
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tools</h2>
            <ToolList tools={tools} />
          </div>
        </div>
      )}

      <footer className="text-xs text-gray-500">
        Deployed on Netlify • Data lives in Neon Postgres
      </footer>
    </div>
  );
}
