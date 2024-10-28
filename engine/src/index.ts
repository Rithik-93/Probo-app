import express from "express";
import dotenv from "dotenv";
import { redisConnect } from "./redis";

export const queueName: string = "apiToEngine"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

redisConnect();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;