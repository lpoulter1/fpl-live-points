import { getDraftedPlayers } from "../../_db/utils";
import { notFound } from "next/navigation";

async function getBootstrapData() {
  const res = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data", res);
  }

  return res.json();
}

async function getGwPlayersData(gw) {
  const res = await fetch(
    `https://fantasy.premierleague.com/api/event/${gw}/live/`
  );

  if (!res.ok) {
    console.log(`failed to fetcth ${gw} gw data`, res);
    notFound();
  }

  return res.json();
}

function getPlayerLiveData(bootstrapElements, liveData, jamesTeam, laurieTeam) {
  const lauriePlayerData = [];
  const jamesPlayerData = [];

  bootstrapElements.forEach((player) => {
    const { id: bootstrapId } = player;

    if (laurieTeam.find((p) => p.fpl_bootstrap_id === bootstrapId)) {
      const element = liveData.elements.find((e) => e.id === bootstrapId);
      if (element) {
        const { web_name, src } = player;
        const { stats } = element;
        lauriePlayerData.push({
          bootstrapId,
          liveId: element.id,
          web_name,
          stats,
          src,
        });
      }
    }

    if (jamesTeam.find((p) => p.fpl_bootstrap_id === bootstrapId)) {
      const element = liveData.elements.find((e) => e.id === bootstrapId);
      if (element) {
        const { web_name, src } = player;
        const { stats } = element;
        jamesPlayerData.push({
          bootstrapId,
          web_name,
          stats,
          src,
        });
      }
    }
  });

  return { lauriePlayerData, jamesPlayerData };
}

async function getFixturesData() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures/`);

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return res.json();
}

function findTopBps(fixture) {
  const bps = fixture.stats.find((s) => s.identifier === "bps");
  const { a, h } = bps;
  return [...a, ...h].sort((a, b) => b.value - a.value);
}

function filterBrightonFixtures(fixtures) {
  const brightonTeamId = 5;
  return fixtures.filter(
    (fixture) =>
      fixture.team_a === brightonTeamId || fixture.team_h === brightonTeamId
  );
}

function findPlayerById(id, elements) {
  return elements.find((e) => e.id === id);
}

function mapTeamById(teams, id) {
  return teams.find((t) => t.id === id);
}

export default async function Page({ params }) {
  const { gw } = params;
  const { elements, teams } = await getBootstrapData();
  const gwPlayerData = await getGwPlayersData(gw);
  const fixtures = await getFixturesData();

  let brightonFixtures = filterBrightonFixtures(fixtures);
  const thisGwFixture = brightonFixtures.find((f) => f.event === Number(gw));

  const { team_a, team_h } = thisGwFixture;
  const homeTeam = mapTeamById(teams, team_h);
  const awayTeam = mapTeamById(teams, team_a);
  if (thisGwFixture.started === false) {
    return <div>Gameweek game not started</div>;
  }

  const playersByBps = findTopBps(thisGwFixture).map((p) => {
    return { value: p.value, element: findPlayerById(p.element, elements) };
  });

  if (gwPlayerData.elements.length === 0) {
    return <div>No GW data</div>;
  }

  const getPlayersData = await getDraftedPlayers();
  const jamesTeam = getPlayersData.filter((p) => p.name === "james");
  const laurieTeam = getPlayersData.filter((p) => p.name === "laurie");

  const { lauriePlayerData, jamesPlayerData } = getPlayerLiveData(
    elements,
    gwPlayerData,
    jamesTeam,
    laurieTeam
  );

  const jamesTotalPoints = jamesPlayerData.reduce(
    (acc, player) => acc + player.stats.total_points,
    0
  );

  const laurieTotalPoints = lauriePlayerData.reduce(
    (acc, player) => acc + player.stats.total_points,
    0
  );

  const moneyWon = (laurieTotalPoints - jamesTotalPoints) * 2;

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-2 px-4 py-3 mb-6 text-2xl align-middle bg-sky-800">
        <p className="text-sm">
          GW:{gw} - {homeTeam.name} vs {awayTeam.name}
        </p>
        <h1>James owes Laurie £{moneyWon}</h1>
      </div>
      <main className="min-h-[100svh] text-gray-100 mx-4">
        <div className="relative flex flex-col gap-10">
          <div className="flex items-center justify-center gap-2 sm:gap-10">
            <div className="w-[45%] max-w-md">
              <h2 className="mb-3 text-2xl">
                Laurie <span className="">{laurieTotalPoints}</span>
              </h2>
              <div className="flex flex-col gap-6">
                {lauriePlayerData.map((player) => (
                  <Player key={player.id} player={player} />
                ))}
              </div>
            </div>
            <div className="w-[45%] max-w-md">
              <h2 className="mb-3 text-2xl">
                James <span className="">{jamesTotalPoints}</span>
              </h2>
              <div className="flex flex-col w-full gap-6">
                {jamesPlayerData.map((player) => (
                  <Player key={player.id} player={player} />
                ))}
              </div>
            </div>
          </div>
          <div>
            BPS Kings:
            {playersByBps.slice(0, 3).map((p) => (
              <div key={p.element.id}>
                {p.element.web_name} - {p.value}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Player({ player }) {
  const { web_name } = player;
  const { total_points, minutes } = player.stats;

  return (
    <div className="grid grid-cols-[1fr_fit_content] grid-rows-3">
      <div className="col-span-2 bg-white text-sky-800">{web_name}</div>
      <div>Points:</div>
      <div className="justify-self-center">{total_points}</div>
      <div>Mins:</div>
      <div className="justify-self-center">{minutes}</div>
    </div>
  );
}
