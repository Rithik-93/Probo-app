import express from "express"
import { forwardReq } from "./controllers/controller";

export const router = express.Router();

router.post("/user/create/:userId", async (req, res) => {
    await forwardReq(req, res, "/user/create/:userId");
});

router.post("/symbol/create/:stockSymbol", async (req, res) => {
    await forwardReq(req, res, "/symbol/create/:stockSymbol");
});

router.post("/onramp/inr", async (req, res) => {
    await forwardReq(req, res, "/onramp/inr");
});

router.post("/trade/mint", async (req, res) => {
    await forwardReq(req, res, "/trade/mint");
});

router.post("/reset", async (req, res) => {
    await forwardReq(req, res, "/reset");
});

router.get("/balances/inr", async (req, res) => {
    await forwardReq(req, res, "/balances/inr");
});
router.get("/balances/inr/:userId", async (req, res) => {
    await forwardReq(req, res, "/balances/inr/:userId");
});
router.get("/balances/stock", async (req, res) => {
    await forwardReq(req, res, "/balances/stock");
});
router.get("/balances/stock/:userId", async (req, res) => {
    await forwardReq(req, res, "/balances/stock/:userId");
});

router.get("/orderbook", async (req, res) => {
    await forwardReq(req, res, "/orderbook")
})

router.get("/orderbook/:stockSymbol", async (req, res) => {
    await forwardReq(req, res, "/orderbook/:stockSymbol")
});

router.post("/order/buy", async (req, res) => {
    await forwardReq(req, res, "/order/buy")
})

router.post("/order/sell", async (req, res) => {
    await forwardReq(req, res, "/order/sell")
})

router.post("/order/cancel", async (req, res) => {
    await forwardReq(req, res, "/order/cancel")
})