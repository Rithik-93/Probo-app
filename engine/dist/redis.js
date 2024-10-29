"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOrderbook = exports.listenQueues = exports.redisConnect = exports.publisher = void 0;
const redis_1 = require("redis");
const router_1 = require("./router");
const _1 = require(".");
const DB_1 = require("./DB/DB");
exports.publisher = (0, redis_1.createClient)();
const consumer = (0, redis_1.createClient)();
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield consumer.connect();
        yield exports.publisher.connect();
        (0, exports.listenQueues)(_1.queueName);
    }
    catch (e) {
        console.log("err", e);
    }
});
exports.redisConnect = redisConnect;
const listenQueues = (queueNames) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        const payload = yield consumer.brPop(queueNames, 0);
        if (payload) {
            const data = JSON.parse(payload.element);
            (0, router_1.matchUrl)(data);
        }
    }
});
exports.listenQueues = listenQueues;
const publishOrderbook = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (DB_1.ORDERBOOK[eventId]) {
            const orderbook = getOrderBookByEvent(eventId);
            yield exports.publisher.publish(eventId, JSON.stringify(orderbook));
        }
        return;
    }
    catch (err) {
        console.log(err);
        return;
    }
});
exports.publishOrderbook = publishOrderbook;
const getOrderBookByEvent = (eventId) => {
    let orderbook;
    const symbolExists = DB_1.ORDERBOOK[eventId];
    if (symbolExists) {
        orderbook = Object.fromEntries(Object.entries(symbolExists).map(([type, ordersMap]) => {
            const orders = Array.from(ordersMap).map(([price, orders]) => {
                return { price, quantity: orders.total };
            });
            return [[type], orders];
        }));
    }
    else {
        orderbook = { eventId: {} };
    }
    return orderbook;
};
