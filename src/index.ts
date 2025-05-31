#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ethers } from "ethers";
import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";
import dotenv from "dotenv";
import {
  GetFlrUsdPriceSchema,
  GetBtcUsdPriceSchema,
  GetEthUsdPriceSchema,
} from "./zodSchemas.js";

dotenv.config();
// Verificar que las variables de entorno existen
if (!process.env.FLARE_RPC_URL) {
  throw new Error("FLARE_RPC_URL no está definida en el archivo .env");
}
if (!process.env.FTSOV2_ADDRESS) {
  throw new Error("FTSOV2_ADDRESS no está definida en el archivo .env");
}
// FtsoV2 setup
const FTSOV2_ADDRESS = process.env.FTSOV2_ADDRESS; //mainNet
const RPC_URL = process.env.RPC_URL; //mainNet
const FEED_IDS = [
  "0x01464c522f55534400000000000000000000000000", // FLR/USD
  "0x014254432f55534400000000000000000000000000", // BTC/USD
  "0x014554482f55534400000000000000000000000000", // ETH/USD
];

// Server setup
const server = new Server(
  { name: "flare-ftso-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Lista de herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const flrSchema = zodToJsonSchema(GetFlrUsdPriceSchema);
  const btcSchema = zodToJsonSchema(GetBtcUsdPriceSchema);
  const ethSchema = zodToJsonSchema(GetEthUsdPriceSchema);
  return {
    tools: [
      {
        name: "get_flr_usd_price",
        description:
          "Get current FLR/USD price feed from Flare's FtsoV2 contract (MainNet).",
        inputSchema: flrSchema,
        // fallback legacy field
        schema: flrSchema,
      },
      {
        name: "get_btc_usd_price",
        description:
          "Get current BTC/USD price feed from Flare's FtsoV2 contract (MainNet).",
        inputSchema: btcSchema,
        schema: btcSchema,
      },
      {
        name: "get_eth_usd_price",
        description:
          "Get current ETH/USD price feed from Flare's FtsoV2 contract (MainNet).",
        inputSchema: ethSchema,
        schema: ethSchema,
      },
    ],
  };
});

// Handler de cada herramienta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  if (!name) throw new Error("Missing tool name");

  switch (name) {
    case "get_flr_usd_price":
      return await fetchFtsoPrice(0, "FLR/USD");
    case "get_btc_usd_price":
      return await fetchFtsoPrice(1, "BTC/USD");
    case "get_eth_usd_price":
      return await fetchFtsoPrice(2, "ETH/USD");
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Función auxiliar para obtener precio por índice y etiqueta
async function fetchFtsoPrice(index: any, label: any) {
  const abi = interfaceToAbi("FtsoV2Interface", "flare");
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const ftsov2 = new ethers.Contract(FTSOV2_ADDRESS, abi, provider);

  try {
    const [prices, decimals, timestamp] = await ftsov2.getFeedsById.staticCall(
      FEED_IDS
    );
    const value = Number(prices[index]) / 10 ** decimals[index];

    return {
      content: [
        {
          type: "text",
          text: `Precio actual de ${label}: $${value.toFixed(
            6
          )}\n Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`,
        },
      ],
    };
  } catch (err: any) {
    return {
      content: [
        {
          type: "text",
          text: ` Error fetching ${label} price: ${err.message}`,
        },
      ],
    };
  }
}

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Flare Ftso MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
