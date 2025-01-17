import { INR_BALANCES, STOCK_BALANCES } from "../DB/DB";
import { QueueReq } from "../types/types";

export const getInrBalances = () => {
  return { statusCode: 200, data: INR_BALANCES };
};

export const getInrBalanceByUserId = (req: QueueReq) => {
  const userId = req.params.userId as string;

  const userExists = INR_BALANCES[userId];

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with ID ${userId} does not exist` },
    };
  }

  const balance = INR_BALANCES[userId];
  return { statusCode: 200, data: { balance } };
};

export const getStockBalances = (req: QueueReq) => {
  return { statusCode: 200, data: STOCK_BALANCES };
};

export const getStockBalancebyUserId = (req: QueueReq) => {
  const userId = req.params.userId as string;

  const userExists = INR_BALANCES[userId];
  const stocksExists = STOCK_BALANCES[userId];

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with Id ${userId} does not exist` },
    };
  }
  if (!stocksExists) {
    return {
      statusCode: 200,
      data: { message: `No stocks for user with userId ${userId}` },
    };
  }

  return { statusCode: 200, data: STOCK_BALANCES[userId] };
};

export const onRamp = (req: QueueReq) => {
  const userId = req.body.userId as string;
  const amount = req.body.amount as number;

  const userExists = INR_BALANCES[userId];

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with ID ${userId} does not exist` },
    };
  }

  INR_BALANCES[userId].balance += amount;

  return {
    statusCode: 200,
    data: {
      message: `Onramped ${userId} with amount ${amount}`,
    },
  };
};