import { MongoClient } from "mongodb";

let clientPromise;

export function databaseConfigured() {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export async function database() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, {
      appName: "Mabrig PublishAI Backend",
      serverSelectionTimeoutMS: 10000,
    }).connect();
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB?.trim() || "publishai");
}
