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

  return (
    <div>
      <PlayerSelectForm
        items={formattedBrightonPlayers}
        updateDrafters={updateDrafters}
      />

      <div>
        {rows.map((row) => (
          <div key={row.id}>
            {row.name} -
            {
              brightonPlayers.find(
                (player) => player.id === row.fpl_bootstrap_id
              ).web_name
            }
          </div>
        ))}
      </div>
    </div>
  );
}
