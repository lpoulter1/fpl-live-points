const mitoma = 124;
const macAllister = 116;
const welbeck = 105;
const gross = 104;
const lamptey = 114;

const ferguson = 598;
const march = 107;
const dunk = 106;
const estupinan = 586;
const webster = 108;

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

function getPlayerDataFromResponse(targetIds, players) {
  const playerData = [];
  for (const targetId of targetIds) {
    playerData.push(players[targetId - 1]);
  }
  return playerData;
}

function getPlayersFromBootstrap(data, ids) {
  const playerData = [];
  for (const player of data) {
    if (ids.includes(player.id)) {
      playerData.push(player);
    }
  }

  return playerData;
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

  const moneyWon = (jamesTotalPoints - laurieTotalPoints) * 2;

  return (
    <main className="min-h-[100svh] text-gray-100 mx-4 mx:0">
      <div class="flex justify-center text-2xl align-middle w-[100vw] bg-pink-800 mx-[-16px] mb-6 py-3 mt-[-16px]">
        James owes Laurie £{moneyWon}
      </div>
      <div class="flex flex-col gap-10">
        <div className="flex gap-2">
          <div className="w-1/2">
            <h2 className="mb-3 text-2xl">
              Laurie <span className="">{laurieTotalPoints}</span>
            </h2>
            <div class="flex flex-col gap-6">
              {lauriePlayerData.map((player) => (
                <Player key={player.id} player={player} />
              ))}
            </div>
          </div>
          <div className="">
            <h2 className="mb-3 text-2xl">
              James <span className="">{jamesTotalPoints}</span>
            </h2>
            <div class="flex flex-col gap-6 w-full">
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
  return (
    <div className="grid grid-cols-[1fr_100px] grid-rows-3">
      <div className="col-span-2 font-bold bg-pink-800">{web_name}</div>
      <div>Points:</div>
      <div class="justify-self-center">{total_points}</div>
      <div>Mins:</div>
      <div class="justify-self-center">{minutes}</div>
    </div>
  );
}
