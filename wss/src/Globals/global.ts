import { ORDERBOOK_TYPE, SUBSCRIBELIST_TYPE } from "../interface";

export const EVENTS: string[] = [];

export const CLIENTS_LIST: SUBSCRIBELIST_TYPE = {
  eth: [],
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
