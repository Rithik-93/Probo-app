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
exports.listenQueues = exports.redisConnect = exports.publisher = void 0;
const redis_1 = require("redis");
exports.publisher = (0, redis_1.createClient)();
const consumer = (0, redis_1.createClient)();
const queueName = "apiToEngine";
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield consumer.connect();
        yield exports.publisher.connect();
        (0, exports.listenQueues)(queueName);
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
            matchUrl(data);
        }
    }
});
exports.listenQueues = listenQueues;
const matchUrl = (data) => {
    let response;
    switch (data.endpoint) {
        case "/asd":
            response = respond(data.req);
            break;
    }
};
const respond = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return { statuscode: 400, data: "pararar" };
});
