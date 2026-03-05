import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

const app = express();

const __dirname = path.resolve();

// Important: ensure you add JSON middleware to process incoming JSON POST payloads.
app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under the req => req.auth
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

//make the app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("server is up and running");
  });
};

startServer();
