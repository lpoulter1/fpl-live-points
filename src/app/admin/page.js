import { PlayerSelectForm } from "./PlayerSelectForm";
import { sql } from "@vercel/postgres";

async function getBootstrapData() {
  const res = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data", res);
  }

  return res.json();
}

function findBrightonPlayers(elements) {
  const brightonTeamId = 5;
  return elements.filter((player) => player.team === brightonTeamId);
}

export default async function Admin() {
  const { elements } = await getBootstrapData();
  const brightonPlayers = findBrightonPlayers(elements);

  const formattedBrightonPlayers = brightonPlayers.map((player) => {
    return {
      id: player.id,
      name: player.web_name,
    };
  });

  let { rows } = await sql`SELECT * from DRAFTERS`;
  const updateDrafters = async ({ drafter, player }) => {
    "use server";
    console.log(player.id);
    console.log(JSON.stringify(player));
    await sql`
      INSERT INTO drafters (name, fpl_bootstrap_id)
      VALUES (${drafter}, ${player.id});
    `;

    // rows = await sql`SELECT * from DRAFTERS`;
  };

  const deleteAllPlayers = async () => {
    "use server";
    console.log("deleting all players");
    await sql`DELETE FROM drafters`;
    const rows = await sql`SELECT * from DRAFTERS`;
  };

  const deletePlayer = async (fpl_bootstrap_id) => {
    "use server";
    console.log(`Deleting player with fpl_bootstrap_id: ${fpl_bootstrap_id}`);
    await sql`DELETE FROM drafters WHERE fpl_bootstrap_id = ${fpl_bootstrap_id}`;
    const rows = await sql`SELECT * from DRAFTERS`;
  };

  return (
    <div>
      <PlayerSelectForm
        items={formattedBrightonPlayers}
        updateDrafters={updateDrafters}
      />
      <form action={deleteAllPlayers}>
        <button
          type="submit"
          className="p-2 mt-4 text-white bg-red-500 rounded cursor-pointer"
        >
          Delete All Players
        </button>
      </form>
      <div>
        {rows.map((row) => (
          <div
            key={row.fpl_bootstrap_id}
            className="flex items-center justify-between mb-2"
          >
            <span>
              {row.fpl_bootstrap_id} - {row.name} -
              {
                brightonPlayers.find(
                  (player) => player.id === row.fpl_bootstrap_id
                )?.web_name
              }
            </span>
            <form action={deletePlayer.bind(null, row.fpl_bootstrap_id)}>
              <button
                type="submit"
                className="px-2 py-1 text-white bg-red-500 rounded cursor-pointer"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
