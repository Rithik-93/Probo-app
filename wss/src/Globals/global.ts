import { ORDERBOOK_TYPE, SUBSCRIBELIST_TYPE } from "../types/type";

export const EVENTS: string[] = [];

export const CLIENTS_LIST: { [key: string]: Set<WebSocket> } = {
  eth:new Set<WebSocket>(),
};

export const ORDERBOOK: ORDERBOOK_TYPE = {
  Eth: {
    yes: [
      { price: 10, quantity: 100 },
      { price: 10, quantity: 100 },
    ],
    no: [{ price: 10, quantity: 100 }],
  },
  Bit: {
    yes: [
      { price: 10, quantity: 100 },
      { price: 10, quantity: 100 },
    ],
    no: [{ price: 10, quantity: 100 }],
  },
  Hello: {
    yes: [
      { price: 10, quantity: 100 },
      { price: 10, quantity: 100 },
    ],
    no: [{ price: 10, quantity: 100 }],
  },
};
