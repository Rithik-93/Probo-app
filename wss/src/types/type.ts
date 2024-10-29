import { WebSocket } from "ws";

export interface ORDERBOOK_TYPE {
  [event: string]: {
    yes: { price: number; quantity: number }[];
    no: { price: number; quantity: number }[];
  };
}

export interface SUBSCRIBELIST_TYPE {
  [event: string]: WebSocket[];
}