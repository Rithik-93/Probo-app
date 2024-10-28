export interface OnrampType {
    userId: string;
    amount: number;
  }
  
  export interface OrderReqType {
    userId: string;
    stockSymbol: string;
    quantity: number;
    price: number;
    stockType: "yes" | "no";
  }
  
  export interface MintReqType {
    userId: string;
    stockSymbol: string;
    quantity: number;
  }
  
  export interface QueueDataEle {
    _id: string;
    endpoint: string;
    req: QueueReq;
  }
  
  export interface QueueReq {
    body: {
      userId?: string;
      amount?: number;
      stockSymbol?: string;
      quantity?: number;
      price?: number;
      stockType?: "yes" | "no";
    };
    params: { userId?: string; stockSymbol?: string };
  }