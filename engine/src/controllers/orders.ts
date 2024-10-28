import { v4 as uuidv4 } from 'uuid'
import { OrderReqType, QueueReq } from '../types/types';
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from '../DB/DB';
import { ORDERDATA, priceRange } from '../types/global';
import { publishOrderbook } from '../redis';

export const getOrderBook = (req: QueueReq) => {
  const formattedOrderbook = Object.fromEntries(
    Object.entries(ORDERBOOK).map(([key, object]) => {
      const yes = Object.fromEntries(Array.from(object.yes));
      const no = Object.fromEntries(Array.from(object.no));
      return [key, { yes, no }];
    })
  );

  return { statusCode: 200, data: formattedOrderbook };
};


export const viewOrders = (req: QueueReq) => {
  const stockSymbol = req.params.stockSymbol as string;

  const symbolExists = ORDERBOOK[stockSymbol];
  if (!symbolExists) {
    return {
      statusCode: 200,
      data: { error: `Stock with stockSymbol ${stockSymbol} does not exist` },
    };
  }
  return { statusCode: 200, data: ORDERBOOK[stockSymbol] };
};

export const buyOrder = (req: QueueReq) => {
  const { userId, stockSymbol } = req.body as OrderReqType;
  const quantity = Number(req.body.quantity);
  const price: priceRange = Number(req.body.price) as priceRange;
  const stockType = req.body.stockType as "yes" | "no";

  const userExists = INR_BALANCES[userId];
  const symbolExists = ORDERBOOK[stockSymbol];

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with user Id ${userId} does not exist` },
    };
  }
  if (!symbolExists) {
    return {
      statusCode: 400,
      data: { error: `Stock with stockSymbol ${stockSymbol} does not exist` },
    };
  }

  const requiredBalance = quantity * price;
  const userBalance = INR_BALANCES[userId].balance / 100;

  if (requiredBalance > userBalance) {
    return { statusCode: 400, data: { message: "Insufficient INR balance" } };
  }

  const filteredByPrice = new Map(
    Array.from(ORDERBOOK[stockSymbol][stockType]).filter(
      ([key, value]) => key <= price && value.total != 0
    )
  );

  const buyOrderArray = Array.from(filteredByPrice).map(([price, item]) => {
    const orders = item.orders.filter((order) => order.userId !== userId);
    const total = orders.reduce((acc, value) => {
      return acc + value.quantity;
    }, 0);
    return { price, total, orders };
  });

  let availableQuantity = buyOrderArray.reduce(
    (acc, item) => acc + item.total,
    0
  );

  if (availableQuantity == 0) {
    initiateSellOrder(stockSymbol, stockType, price, quantity, userId, "buy");
    return { statusCode: 200, data: { message: "Bid Submitted" } };
  }

  let requiredQuantity = quantity;

  for (const buyOrder in buyOrderArray) {
    const orderPrice = Number(buyOrderArray[buyOrder].price) as priceRange;

    requiredQuantity = matchOrder(
      stockSymbol,
      stockType,
      orderPrice,
      requiredQuantity,
      buyOrderArray[buyOrder],
      userId,
      "buy"
    );

    if (
      ORDERBOOK[stockSymbol][stockType].get(orderPrice) &&
      ORDERBOOK[stockSymbol][stockType].get(orderPrice)!.total == 0
    ) {
      ORDERBOOK[stockSymbol][stockType].delete(orderPrice);
    }

    publishOrderbook(stockSymbol);

    if (requiredQuantity == 0) {
      break;
    }

    availableQuantity = buyOrderArray.reduce(
      (acc, item) => acc + item.total,
      0
    );
    if (availableQuantity == 0) {
      initiateSellOrder(
        stockSymbol,
        stockType,
        price,
        requiredQuantity,
        userId,
        "buy"
      );
      break;
    }
  }

  return {
    statusCode: 200,
    data: {
      message: `Buy order placed and trade executed`,
    },
  };
};

export const sellOrder = (req: QueueReq) => {
  const { userId, stockSymbol } = req.body as OrderReqType;
  const quantity = Number(req.body.quantity);
  const price = Number(req.body.price) as priceRange;
  const stockType = req.body.stockType as "yes" | "no";

  const userExists = INR_BALANCES[userId];
  const symbolExists = ORDERBOOK[stockSymbol];

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with user Id ${userId} does not exist` },
    };
  }
  if (!symbolExists) {
    return {
      statusCode: 400,
      data: { error: `Stock with stockSymbol ${stockSymbol} does not exist` },
    };
  }

  const stockAvailable = STOCK_BALANCES[userId][stockSymbol];
  if (!stockAvailable) {
    return {
      statusCode: 400,
      data: { message: `You do not own any stock of ${stockSymbol}` },
    };
  }

  const stockBalanceOfUser = Number(stockAvailable[stockType]?.quantity) || 0;

  if (quantity > stockBalanceOfUser) {
    return { statusCode: 400, data: { message: "Insufficient stock balance" } };
  }

  let pseudoType: "yes" | "no" = "yes";
  let pseudoPrice: priceRange = Number(10 - price) as priceRange;
  if (stockType == "yes") {
    pseudoType = "no";
  }

  const sellOrderObject = ORDERBOOK[stockSymbol][pseudoType].get(pseudoPrice);

  let totalAvailableQuantity: number = 0;

  if (sellOrderObject) {
    totalAvailableQuantity = sellOrderObject.orders.reduce((acc, item) => {
      if (item.type == "buy") {
        return (acc += item.quantity);
      } else {
        return acc;
      }
    }, 0);
  }

  if (totalAvailableQuantity == 0) {
    initiateSellOrder(stockSymbol, stockType, price, quantity, userId, "exit");

    return {
      statusCode: 200,
      data: {
        message: `Sell order placed for ${quantity} '${stockType}' options at price ${price}.`,
      },
    };
  }

  let sellingQuantity = quantity;

  if (totalAvailableQuantity >= quantity) {
    sellingQuantity = matchOrder(
      stockSymbol,
      stockType,
      price,
      sellingQuantity,
      sellOrderObject!,
      userId,
      "sell"
    );
    publishOrderbook(stockSymbol); 
    return {
      statusCode: 200,
      data: { message: "Sell order filled completely" },
    };
  }

  sellingQuantity = matchOrder(
    stockSymbol,
    stockType,
    price,
    sellingQuantity,
    sellOrderObject!,
    userId,
    "sell"
  );
  publishOrderbook(stockSymbol); 
  return {
    statusCode: 200,
    data: { message: "Sell order partially filled and rest are initiated" },
  };
};

export const cancelOrder = (req: QueueReq) => {
  const { userId, stockSymbol, price } = req.body;
  const stockType = req.body.stockType as "yes" | "no";
  const userExists = INR_BALANCES?.userId;
  const symbolExists = ORDERBOOK?.stockSymbol;

  if (!userExists) {
    return {
      statusCode: 400,
      data: { error: `User with user Id ${userId} does not exist` },
    };
  }
  if (!symbolExists) {
    return {
      statusCode: 400,
      data: { error: `Stock with stockSymbol ${stockSymbol} does not exist` },
    };
  }

  // console.log(ORDERBOOK[stockSymbol][stockType]);

  return { statusCode: 200, data: { message: "Sell order canceled" } };
};

const initiateSellOrder = (
  stockSymbol: string,
  stockType: "yes" | "no",
  price: priceRange,
  quantity: number,
  userId: string,
  orderType: "buy" | "exit"
) => {
  let newPrice: priceRange =
    orderType == "buy" ? ((10 - price) as priceRange) : price;
  let newType: "yes" | "no" =
    orderType == "buy" ? (stockType == "yes" ? "no" : "yes") : stockType;

  if (orderType == "buy") {
    INR_BALANCES[userId].balance -= quantity * price * 100;
    INR_BALANCES[userId].locked += quantity * price * 100;
  }

  if (orderType == "exit") {
    STOCK_BALANCES[userId][stockSymbol][newType]!.quantity -= quantity;
    STOCK_BALANCES[userId][stockSymbol][newType]!.locked += quantity;
  }

  const sellOrderArray = ORDERBOOK[stockSymbol][newType];
  const sellOrder = sellOrderArray.get(newPrice);


  if (sellOrder) {
    sellOrder.total += quantity;
    sellOrder.orders.push({ userId, id: uuidv4(), quantity, type: orderType });
  } else {
    sellOrderArray.set(newPrice, {
      total: quantity,
      orders: [{ userId, id: uuidv4(), quantity, type: orderType }],
    });
  }
  publishOrderbook(stockSymbol);
};

const matchOrder = (
  stockSymbol: string,
  stockType: "yes" | "no",
  orderPrice: priceRange,
  requiredQuantity: number,
  orderObject: ORDERDATA,
  takerId: string,
  takerType: "buy" | "sell"
) => {
  const allOrders = orderObject.orders;
  let remainingQuantity = requiredQuantity;

  let pseudoType: "yes" | "no" = "yes";
  let pseudoPrice: priceRange = Number(10 - orderPrice) as priceRange;
  if (stockType == "yes") {
    pseudoType = "no";
  }

  for (const order in allOrders) {
    if (allOrders[order].quantity > remainingQuantity) {

      allOrders[order].quantity -= remainingQuantity;
      orderObject.total -= remainingQuantity;

      if (takerType == "sell") {
        ORDERBOOK[stockSymbol][pseudoType].get(orderPrice)!.total -=
          remainingQuantity;
      } else {
        ORDERBOOK[stockSymbol][stockType].get(orderPrice)!.total -=
          remainingQuantity;
      }

      updateBalances(
        stockSymbol,
        stockType,
        orderPrice,
        remainingQuantity,
        takerId,
        takerType,
        allOrders[order].userId,
        allOrders[order].type
      );

      remainingQuantity = 0;

      return remainingQuantity;
    } else {
      remainingQuantity -= allOrders[order].quantity;
      orderObject.total -= allOrders[order].quantity;
      ORDERBOOK[stockSymbol][stockType].get(orderPrice)!.total -=
        allOrders[order].quantity;

      updateBalances(
        stockSymbol,
        stockType,
        orderPrice,
        allOrders[order].quantity,
        takerId,
        takerType,
        allOrders[order].userId,
        allOrders[order].type
      );

      allOrders[order].quantity = 0;

      ORDERBOOK[stockSymbol][stockType].get(orderPrice)?.orders.shift();
    }
  }
  return remainingQuantity;
};

const updateBalances = (
  stockSymbol: string,
  stockType: "yes" | "no",
  price: priceRange,
  quantity: number,
  takerId: string,
  takerType: "buy" | "sell",
  makerId: string,
  makerType: "buy" | "exit"
) => {
  const pseudoPrice = 10 - price;
  if (makerType == "buy") {
    INR_BALANCES[makerId].locked -= quantity * pseudoPrice * 100;

    let makerStockType: "yes" | "no" =
      takerType == "buy" ? (stockType == "yes" ? "no" : "yes") : stockType;

    if (STOCK_BALANCES[makerId][stockSymbol]) {
      if (STOCK_BALANCES[makerId][stockSymbol][makerStockType]) {
        STOCK_BALANCES[makerId][stockSymbol][makerStockType].quantity +=
          quantity;
      } else {
        STOCK_BALANCES[makerId][stockSymbol][makerStockType] = {
          quantity: quantity,
          locked: 0,
        };
      }
    } else {
      STOCK_BALANCES[makerId][stockSymbol] = {
        [makerStockType]: { quantity: quantity, locked: 0 },
      };
    }
  } else {
    INR_BALANCES[makerId].balance += quantity * price * 100;
    STOCK_BALANCES[makerId][stockSymbol][stockType]!.locked -= quantity;
  }

  if (takerType == "buy") {
    INR_BALANCES[takerId].balance -= quantity * price * 100;

    if (STOCK_BALANCES[takerId][stockSymbol]) {
      if (STOCK_BALANCES[takerId][stockSymbol][stockType]) {
        STOCK_BALANCES[takerId][stockSymbol][stockType].quantity += quantity;
      } else {
        STOCK_BALANCES[takerId][stockSymbol][stockType] = {
          quantity,
          locked: 0,
        };
      }
    } else {
      STOCK_BALANCES[takerId][stockSymbol] = {
        [stockType]: { quantity, locked: 0 },
      };
    }
  } else {
    INR_BALANCES[takerId].balance += quantity * price * 100;
    STOCK_BALANCES[takerId][stockSymbol][stockType]!.quantity -= quantity;
  }
};