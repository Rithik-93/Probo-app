import express from 'express'
import connectRedis from './redis';
import { router } from './route';

const app = express()
app.use(express.json())

connectRedis()
app.post("/api/v1", router)

const port = 3000;

app.listen(port, () => {
    console.log("server running ",port )
})

