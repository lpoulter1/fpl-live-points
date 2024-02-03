import Link from "next/link";

async function getFixturesData() {
  const res = await fetch(`https://fantasy.premierleague.com/api/fixtures/`);

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return res.json();
}

async function getBootstrapData() {
  const res = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return res.json();
}

type Fixture = {
  team_a: number;
  team_h: number;
  event: number;
  finished: boolean;
  started: boolean;
  kickoff_time: string;
  minutes: number;
  provisional_start_time: boolean;
  finished_provisional_start_time: boolean;
  id: number;
  code: number;
  team_h_score: number;
  team_a_score: number;
  stats: [];
  team_h_difficulty: number;
  team_a_difficulty: number;
};

function filterBrightonFixtures(fixtures: Fixture[]) {
  const brightonTeamId = 5;
  return fixtures.filter(
    (fixture) =>
      fixture.team_a === brightonTeamId || fixture.team_h === brightonTeamId
  );
}

function getTeamName(teamId: number, teams: any) {
  return teams.find((team: any) => team.id === teamId).name;
}

export default async function fixtures() {
  const fixtures = await getFixturesData();
  let brightonFixtures = filterBrightonFixtures(fixtures);
  const { teams } = await getBootstrapData();

  return (
    <div>
      Fixtures
      {brightonFixtures.map((fixture) => (
        <div key={fixture.id}>
          <Link href={`/players/${fixture.event}`}>GW: {fixture.event}</Link>
          <br />
          {getTeamName(fixture.team_h, teams)} Vs{" "}
          {getTeamName(fixture.team_a, teams)}
          <div>
            {fixture.team_h_score} - {fixture.team_a_score}
          </div>
        </div>
      ))}
    </div>
  );
}
