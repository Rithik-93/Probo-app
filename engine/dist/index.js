"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueName = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./redis");
exports.queueName = "apiToEngine";
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
(0, redis_1.redisConnect)();
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
exports.default = app;
