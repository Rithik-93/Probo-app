export interface QueueDataType {
    _id: string;
    endpoint: string;
    req: QUEUE_REQUEST;
}

export interface QUEUE_REQUEST {
    body: {
        userId?: string;
        amount?: string;
        stockSymbol?: string;
        quantity?: number;
        price?: number;
        stockType?: "yes" | "no"
    }
    params: {
        userId?: string;
        stockSymbol?: string
    }
}