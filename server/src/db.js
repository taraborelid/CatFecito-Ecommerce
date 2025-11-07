import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
  database: process.env.DB_NAME || process.env.PGDATABASE || "postgres",
  user: process.env.DB_USER || process.env.PGUSER || "postgres",
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "",
  ssl:
    process.env.NODE_ENV === "production" || process.env.PGSSLMODE
      ? { rejectUnauthorized: false }
      : false,
});

export async function testDB() {
  const r = await pool.query("SELECT 1 as ok");
  return r.rows[0]?.ok === 1;
}

// opcional: mantener default por compatibilidad
export default pool;
