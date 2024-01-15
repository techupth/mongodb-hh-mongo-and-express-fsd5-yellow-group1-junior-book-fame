// Set up db connection here
import { MongoClient } from "mongodb";

const connectionString = "mongodb://127.0.0.1:27017";

console.log("------- Start connecting to MongDB -------");
export const client = new MongoClient(connectionString);

await client.connect();
console.log("------- Connecting to MongoDB Successfully -------");

export const db = await client.db("practice-mongo");
console.log("------- Create database successfully -------");

try {
  await db.createCollection("products");
  console.log("------- Create collection successfully -------");
} catch {
  console.log("Collection already exists !");
}
