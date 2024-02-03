const { db } = require("@vercel/postgres");

async function seed(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`DELETE FROM drafters;`;
    await client.sql`DROP TABLE drafters;`;
    const createTable = await client.sql`
    CREATE TABLE drafters (
        name varchar(255),
        fpl_bootstrap_id int
    );
`;

    console.log(`Created "drafters" table`);
    return {
      createTable,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seed(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
