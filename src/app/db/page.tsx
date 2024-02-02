import { sql } from "@vercel/postgres";

export default async function Cart({
  params,
}: {
  params: { user: string };
}): Promise<JSX.Element> {
  const { rows } = await sql`SELECT * from DRAFTERS`;
  // delete rows
  //   await sql`DELETE FROM DRAFTERS;`;

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          {row.players[0].name} - {row.name}
        </div>
      ))}
    </div>
  );
}
