import express, { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import connectRedis, { queuePush, subscriber } from './redis';

const queueName = 'apiToEngine';

interface QueueData {
    _id: string;
    endpoint: string;
    req: {
      body: {};
      params: {};
    };
  }

const app = express()
app.use(express.json())

connectRedis()
app.post("/asd", async (req, res) => {
    const data = forwardReq(req, res, "/asd")
    return 
})

const forwardReq = async (
    req: Request,
    res: Response,
    endpoint: string
) => {
  const payload: QueueData = {
    _id: uuidv4(),
    req: {
        body: req.body,
        params: req.params
    },
    endpoint: endpoint
  }
  
  try {
    await new Promise(async(resolve) => {
      const callbackFunc = (message: string) => {
        const { statusCode, data } = JSON.parse(message);
        res.status(statusCode).send(data);
        subscriber.unsubscribe(payload._id, callbackFunc);
        resolve(undefined);
      };
         subscriber.subscribe(payload._id, callbackFunc);
        console.log(payload, queueName)
        await queuePush(queueName, JSON.stringify(payload))
    })
  } catch(e) {
    console.error("Failed to send data to Engine")
  }
}

const port = 3000;

app.listen(port, () => {
    console.log("server running ",port )
})

export default forwardReq;