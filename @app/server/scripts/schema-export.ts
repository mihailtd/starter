import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { Pool } from "pg";
import { createPostGraphileSchema } from "postgraphile";
import { getPostGraphileOptions } from "../src/middleware/installPostGraphile";

async function main() {
  const rootPgPool = new Pool({
    connectionString: process.env.ROOT_DATABASE_URL!,
  });
  try {
    const schema = await createPostGraphileSchema(
      process.env.DATABASE_AUTHENTICATOR_URL!,
      process.env.DB_SCHEMA_NAME!,
      getPostGraphileOptions({ rootPgPool })
    );
    // TODO: fix type error
    // @ts-ignore
    const sorted = lexicographicSortSchema(schema);
    writeFileSync(
      `${__dirname}/../../../schemas/schema.graphql`,
      printSchema(sorted)
    );
    console.log("GraphQL schema exported");
  } finally {
    rootPgPool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
