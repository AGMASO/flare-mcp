import { z } from "zod";

// Zod schemas for FtsoV2 price feed tools (no input needed, but must be valid object)

export const GetFlrUsdPriceSchema = z.object({
  pricefeed: z.string().describe("Get FLR/USD price"),
});

export const GetBtcUsdPriceSchema = z.object({
  pricefeed: z.string().describe("Get BTC/USD price"),
});

export const GetEthUsdPriceSchema = z.object({
  pricefeed: z.string().describe("Get ETH/USD price"),
});
