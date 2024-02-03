import { sql } from "@vercel/postgres";

export async function getDraftedPlayers() {
  const { rows } = await sql`SELECT * from DRAFTERS`;
  return rows;
}
