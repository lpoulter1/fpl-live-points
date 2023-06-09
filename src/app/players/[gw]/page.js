const mitoma = 124;
const macAllister = 116;
const welbeck = 103;
const gross = 104;
const lamptey = 114;

const ferguson = 596;
const march = 107;
const dunk = 106;
const estupinan = 586;
const webster = 108;

import { Seagull } from "./Seagull";

async function getBootstrapData() {
  const res = await fetch(
    `https://draft.premierleague.com/api/bootstrap-static`
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
    throw new Error("Failed to fetch data", res);
  }

  return res.json();
}

function getPlayerLiveData(bootstrapElements, liveData) {
  const laurieTeam = [mitoma, macAllister, welbeck, gross, lamptey];
  const jamesTeam = [ferguson, march, dunk, estupinan, webster];

  const lauriePlayerData = [];
  const jamesPlayerData = [];

  for (const player of bootstrapElements) {
    if (laurieTeam.includes(player.id)) {
      const { id, web_name, src } = player;
      const { stats } = liveData.elements[id - 1];

      lauriePlayerData.push({
        id,
        web_name,
        stats,
        src,
      });
    }

    if (jamesTeam.includes(player.id)) {
      const { id, web_name, src } = player;
      const { stats } = liveData.elements[id - 1];

      jamesPlayerData.push({
        id,
        web_name,
        src,
        stats,
      });
    }
  }

  return { lauriePlayerData, jamesPlayerData };
}

export default async function Page({ params }) {
  const { gw } = params;
  const { elements } = await getBootstrapData();
  const gwPlayerData = await getGwPlayersData(gw);

  const { lauriePlayerData, jamesPlayerData } = getPlayerLiveData(
    elements,
    gwPlayerData
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
    <main className="h-[100svh] text-gray-100 mx-4 mx:0">
      <div className="flex justify-center text-2xl align-middle  bg-sky-800 mx-[-16px] mb-6 py-3 mt-[-16px]">
        James owes Laurie £{moneyWon}
      </div>
      <div className="relative flex flex-col gap-10">
        <div className="absolute inset-0 flex items-center self-end justify-center mt-5 opacity-10">
          <Seagull />
        </div>
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
      </div>
    </main>
  );
}

function Player({ player }) {
  const { web_name } = player;
  const { total_points, minutes } = player.stats;
  const lol = web_name === "Bevan" ? "Fergie" : web_name;
  return (
    <div className="grid grid-cols-[1fr_fit_content] grid-rows-3">
      <div className="col-span-2 bg-white text-sky-800">{lol}</div>
      <div>Points:</div>
      <div className="justify-self-center">{total_points}</div>
      <div>Mins:</div>
      <div className="justify-self-center">{minutes}</div>
    </div>
  );
}
