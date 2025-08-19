export default function ToolList({ tools }) {
  if (!tools.length) return <p className="text-gray-600">No tools yet.</p>;
  return (
    <ul className="space-y-2">
      {tools.map(t => (
        <li key={t.id} className="border rounded-xl p-3">
          <div className="font-medium">{t.name}</div>
          <div className="text-sm text-gray-600">Job: {t.job_title} (#{t.job_id})</div>
          {t.description && <div className="text-sm mt-1">{t.description}</div>}
        </li>
      ))}
    </ul>
  );
}
