import express from 'express'
import connectRedis from './redis';
import { router } from './route';
import cors from 'cors';
import route from './swagger';

const app = express()
app.use(express.json())

connectRedis()
app.use(cors());
app.use("/api/v1", router)

app.use('/docs', route)

const port = 3000;

app.listen(port, () => {
    console.log("server running ", port)
})

