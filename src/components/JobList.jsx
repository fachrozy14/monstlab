export default function JobList({ jobs }) {
  if (!jobs.length) return <p className="text-gray-600">No jobs yet.</p>;
  return (
    <ul className="space-y-2">
      {jobs.map(j => (
        <li key={j.id} className="border rounded-xl p-3">
          #{j.id} • {j.title}
        </li>
      ))}
    </ul>
  );
}
