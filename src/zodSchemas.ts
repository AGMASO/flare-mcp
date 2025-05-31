import { z } from "zod";

// Zod schemas for FtsoV2 price feed tools (no input needed, but must be valid object)

export const GetFlrUsdPriceSchema = z
  .object({})
  .strict()
  .describe("Get FLR/USD price (no input)");

export const GetBtcUsdPriceSchema = z
  .object({})
  .strict()
  .describe("Get BTC/USD price (no input)");

export const GetEthUsdPriceSchema = z
  .object({})
  .strict()
  .describe("Get ETH/USD price (no input)");
