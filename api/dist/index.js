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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const redis_1 = require("./redis");
const queueName = 'apiToEngine';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/asd", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    forwardReq(req, res, "/asd");
}));
const forwardReq = (req, res, endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        _id: (0, uuid_1.v4)(),
        req: {
            body: req.body,
            params: req.params
        },
        endpoint: endpoint
    };
    try {
        yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            const callbackFunc = (message) => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, data } = JSON.parse(message);
                res.status(statusCode).send(data);
                redis_1.subscriber.unsubscribe(payload._id, callbackFunc);
                resolve(undefined);
            });
            redis_1.subscriber.subscribe(payload._id, callbackFunc);
            yield (0, redis_1.queuePush)(queueName, JSON.stringify(payload));
        }));
    }
    catch (e) {
        console.error("Failed to send data to Engine");
    }
});
const port = 3000;
app.listen(port, () => {
    console.log("server running ", port);
});
exports.default = forwardReq;
