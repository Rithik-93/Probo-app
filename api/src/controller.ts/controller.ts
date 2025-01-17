import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { queuePush, subscriber } from '../redis';
import { QueueData } from '../types/types';
const queueName = 'apiToEngine';


export const forwardReq = async (
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
    await new Promise(async (resolve) => {
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
  } catch (e) {
    console.error("Failed to send data to Engine")
  }
}