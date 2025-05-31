import { z } from "zod";

// Zod schemas for FtsoV2 price feed tools (no input needed, but must be valid object)

export const GetFlrUsdPriceSchema = z.object({
  pricefeed: z.string().optional().describe("Get FLR/USD price (no input)"),
});

export const GetBtcUsdPriceSchema = z.object({
  pricefeed: z.string().optional().describe("Get BTC/USD price (no input)"),
});

export const GetEthUsdPriceSchema = z.object({
  pricefeed: z.string().optional().describe("Get ETH/USD price (no input)"),
});
