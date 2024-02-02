import { PlayerSelectForm } from "./PlayerSelectForm";

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

  return (
    <div>
      <PlayerSelectForm items={formattedBrightonPlayers} />
    </div>
  );
}
