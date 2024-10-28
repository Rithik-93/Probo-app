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
exports.queuePush = exports.subscriber = void 0;
const redis_1 = require("redis");
exports.subscriber = (0, redis_1.createClient)();
const client = (0, redis_1.createClient)();
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.subscriber.connect();
        yield client.connect();
        console.log("connected to redis");
    }
    catch (e) {
        console.error("failed to connect redis", e);
    }
});
const queuePush = (queueName, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.lPush(queueName, data);
    }
    catch (e) {
        console.log("failed to push to queue", e);
    }
});
exports.queuePush = queuePush;
exports.default = connectRedis;
