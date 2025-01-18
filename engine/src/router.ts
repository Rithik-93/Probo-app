import { createSymbol, createUser } from "./controllers/auth";
import { getInrBalanceByUserId, getInrBalances, getStockBalancebyUserId, getStockBalances, onRamp } from "./controllers/balance";
import { buyOrder, getOrderBook, viewOrders } from "./controllers/orders";
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
            case "/order/buy":
                response = buyOrder(data.req);
        }
        // if(response === undefined) return
        if (!response) {
            console.warn("No response for endpoint:", data.endpoint);
            return;
        }

        let formattedData = {};
        if (response) {
           formattedData = deepConvertMapToObject(response);
        }

        await publisher.publish(data._id, JSON.stringify(formattedData));
    } catch (e) {
        console.error("Error in matchUrl:", e);
    }
}

const deepConvertMapToObject = (data: any): any => {
    if (data instanceof Map) {
      return Object.fromEntries(
        Array.from(data.entries()).map(([key, value]) => [key, deepConvertMapToObject(value)])
      );
    } else if (Array.isArray(data)) {
      return data.map(deepConvertMapToObject);
    } else if (typeof data === 'object' && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, deepConvertMapToObject(value)])
      );
    }
    return data;
  };
  