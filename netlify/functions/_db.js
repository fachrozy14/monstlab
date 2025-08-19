import { neon } from '@neondatabase/serverless';

// Expect NEON_DATABASE_URL to be set in Netlify (use a pooled connection string if available)
const sql = neon(process.env.NEON_DATABASE_URL);

export async function query(text, params = []) {
  // Simple adapter to emulate parameterized queries, using template literal fallback when no params.
  // For safety, we rely on neon parameter support using $1, $2... in template strings.
  if (!params.length) {
    return await sql.unsafe(text);
  }
  // Build a template string with parameter placeholders for neon
  // Example: text = "select * from jobs where id = $1"
  // neon supports sql`...` with interpolations. We'll map placeholders to actual params.
  // We'll split on placeholders and rebuild with template tag.
  // Simpler: replace $1..$n with positional interpolations using template tag.
  // We'll parse indices and build an array.
  // But for simplicity and safety, expose dedicated helpers below and avoid generic paramization.
  throw new Error("Use the specialized helpers in the functions instead of query(text, params).");
}

export { sql };
