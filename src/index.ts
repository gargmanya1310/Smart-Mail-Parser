import express, { Request, Response } from "express";
import cors from "cors";
import googleAuthRouter from "./googleAuth/auth-route.js";
import geminiRouter from "./geminiGPT/gemini-route.js";
import { addJobs } from "./queue/config.js";

const app = express();
const port = 3001;

// handling cors
app.use(cors());

// routes
app.use("/api/auth", googleAuthRouter);
app.use("/api/gemini", geminiRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello app is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
