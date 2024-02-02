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
  const updateDrafters = async (e) => {
    "use server";
    await sql`INSERT INTO drafters (name, players) VALUES 
    ('Laurie', 
    '[{"id": 1, "name": "Adringa"}, {"id": 2, "name": "Player 2"}]'
    );`;
  };

  return (
    <div>
      <PlayerSelectForm
        items={formattedBrightonPlayers}
        updateDrafters={updateDrafters}
      />
    </div>
  );
}
