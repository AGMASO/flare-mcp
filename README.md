# Flare Ftso MCP Server

MCP server for accessing Flare FtsoV2 price feeds.

## Installation

```bash
npm install flare-ftso-mcp
```

## Usage

1. Create a `.env` file:
```env
FLARE_RPC_URL=https://flare-api.flare.network/ext/C/rpc
FTSOV2_ADDRESS=0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20
```

2. Run the server:
```bash
npx flare-ftso-mcp
```

## Available Tools

- `get_flr_usd_price`: Get current FLR/USD price
- `get_btc_usd_price`: Get current BTC/USD price
- `get_eth_usd_price`: Get current ETH/USD price

## n8n Integration

To use with n8n, add the following to your n8n MCP configuration:

```json
{
  "mcpServers": {
    "flare-ftso-mcp": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "env": {
        "FLARE_RPC_URL": "https://flare-api.flare.network/ext/C/rpc",
        "FTSOV2_ADDRESS": "0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20"
      }
    }
  }
}
```
```

5. **Mejoras en el código**
Tu código actual necesita algunas mejoras:

```typescript
// src/types.ts
export interface FtsoResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// src/index.ts
import { FtsoResponse } from './types';

// Añadir validación de tipos más estricta
async function fetchFtsoPrice(index: number, label: string): Promise<FtsoResponse> {
  // ... resto del código ...
}

// Añadir manejo de errores más robusto
try {
  // ... código existente ...
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.error(`Error fetching ${label} price:`, errorMessage);
  return {
    content: [
      {
        type: "text",
        text: `Error fetching ${label} price: ${errorMessage}`,
      },
    ],
  };
}
```

6. **Para publicar en npm**
```bash
# Login a npm
npm login

# Publicar el paquete
npm publish
```

7. **Para usar en n8n**
1. Instalar el paquete:
```bash
npm install flare-ftso-mcp
```

2. Configurar en n8n:
- Añadir la configuración MCP en n8n
- Usar las herramientas en tus workflows

8. **Consideraciones adicionales**
- Añadir tests unitarios
- Añadir CI/CD
- Añadir logging más detallado
- Considerar añadir más feeds de precios
- Añadir rate limiting
- Añadir caché para los precios

¿Quieres que te ayude a implementar alguno de estos cambios específicos?