import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Connect native MongoDB client to same DB
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    usePlural: true, // Auto pluralization (user -> users, session -> sessions, account -> accounts)
  }),
  advanced: {
    database: {
      generateId: false, // Let MongoDB generate native ObjectId
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_google_secret",
    },
  },
});
