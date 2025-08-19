import pg from "pg";

const { Client } = pg;

export async function query(sql, params) {
  const client = new Client({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const result = await client.query(sql, params);
  await client.end();
  return result;
}
