// netlify/functions/_db.js
import { neon } from '@neondatabase/serverless';

// Uses the Neon Database URL you set in Netlify env variables
const sql = neon(process.env.NEON_DATABASE_URL);

// Helper to run queries with or without params
export async function query(text, params = []) {
  if (!params.length) {
    return await sql.unsafe(text);
  }

  // Replace $1, $2 with actual params safely using template strings
  // Example: query("select * from jobs where id = $1", [id])
  const queryParts = text.split(/\$\d+/); 
  const builtQuery = sql`${queryParts.reduce((acc, part, i) => 
    sql.join([acc, part, params[i-1] ?? ""]), sql``)}`;

  return builtQuery;
}

export { sql };
