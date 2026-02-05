import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
  try {
    const result = await sql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Tables in database:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error checking tables:", error);
  }
}

checkTables();
