import { query, sql } from './_db.js';

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: corsHeaders(),
        body: ''
      };
    }

    if (event.httpMethod === 'GET') {
      const rows = await sql`select id, title from jobs order by id desc`;
      return json(rows);
    }

    if (event.httpMethod === 'POST') {
      const { title } = JSON.parse(event.body || '{}');
      if (!title || !title.trim()) return badRequest('Title is required');
      await sql`insert into jobs (title) values (${title})`;
      const rows = await sql`select id, title from jobs order by id desc`;
      return json(rows, 201);
    }

    return { statusCode: 405, headers: corsHeaders(), body: 'Method Not Allowed' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: corsHeaders(), body: 'Server Error' };
  }
}

function json(data, statusCode = 200) {
  return {
    statusCode,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

function badRequest(msg) {
  return {
    statusCode: 400,
    headers: corsHeaders(),
    body: msg
  };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
