import { createSymbol, createUser } from "./controllers/auth";
import { getInrBalanceByUserId, getInrBalances, getStockBalancebyUserId, getStockBalances, onRamp } from "./controllers/balance";
import { getOrderBook, viewOrders } from "./controllers/orders";
import { publisher } from "./redis";
import { QueueDataEle } from "./types/types";

export const matchUrl = async (data: QueueDataEle) => {
    let response;
    try {
        switch (data.endpoint) {
            case "/user/create/:userId":
                response = createUser(data.req);
                break;
            case "/symbol/create/:stockSymbol":
                response = createSymbol(data.req);
                break;
            case "/balances/inr":
                response = getInrBalances();
                break;
            case "/balances/inr/:userId":
                response = getInrBalanceByUserId(data.req);
                break;
            case "/balances/stock":
                response = getStockBalances(data.req);
                break;
            case "/balances/stock/:userId":
                response = getStockBalancebyUserId(data.req);
                break;
            case "/onramp/inr":
                response = onRamp(data.req);
                break;
            case "/orderbook":
                response = getOrderBook(data.req);
                break;
            case "/orderbook/:stockSymbol":
                response = viewOrders(data.req);
                break;
        }
        console.log("Publishing response:", response);
        await publisher.publish(data._id, JSON.stringify(response));
    } catch (e) {
        console.error("Error in matchUrl:", e);
    }
}