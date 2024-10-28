import express from "express";
import dotenv from "dotenv";
import { redisConnect } from "./redis";
// import  {redisConnect}  from ""
// import { connectToRedis } from "./services/redis";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;

// Connect to redis client
redisConnect();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;