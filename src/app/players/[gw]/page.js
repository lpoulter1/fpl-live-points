// const pedro = 135; //2367557
// const estupinan = 131;
// const ferguson = 132;
// const steele = 148;
// const igor = 606;
// const veltman = 151;

// const dunk = 129;
// const encio = 130;
// const fati = 700;
// const mitoma = 143;
// const march = 140;
// const gross = 134;
import { getDraftedPlayers } from "../../db/utils";

import { Seagull } from "./Seagull";

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
    throw new Error("Failed to fetch data", res);
  }

  return res.json();
}

function getPlayerLiveData(bootstrapElements, liveData, jamesTeam, laurieTeam) {
  // const jamesTeam = [pedro, estupinan, ferguson, steele, veltman];
  // const laurieTeam = [dunk, fati, mitoma, march, gross];

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

export default async function Page({ params }) {
  const { gw } = params;
  const { elements } = await getBootstrapData();
  const gwPlayerData = await getGwPlayersData(gw);
  // console.log(
  //   "700",
  //   elements.find((e) => e.id === 700)
  // );
  // const brightonTeamCode = "36";
  // const brightonPlayers = getTeamPlayers(brightonTeamCode, elements);
  // console.log("brightonPlayers", brightonPlayers);

  if (gwPlayerData.elements.length === 0) {
    return <div>No GW data</div>;
  }

  const getPlayersData = await getDraftedPlayers();
  const jamesTeam = getPlayersData.filter((p) => p.name === "james");
  const laurieTeam = getPlayersData.filter((p) => p.name === "laurie");

  console.log("jamesTeam", jamesTeam);
  console.log("laurieTeam", laurieTeam);

  const { lauriePlayerData, jamesPlayerData } = getPlayerLiveData(
    elements,
    gwPlayerData,
    jamesTeam,
    laurieTeam
  );

  // console.log("lauriePlayerData", lauriePlayerData);

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
  // const lol = web_name === "Bevan" ? "Fergie" : web_name;
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
