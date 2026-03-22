# mcp-mathtools

MCP server with **12 math & statistics tools** for Claude Desktop, Cursor, and any MCP-compatible AI assistant. Precise arithmetic, statistics, unit conversion, financial calculations, and more.

## Install

```json
{
  "mcpServers": {
    "mathtools": {
      "command": "npx",
      "args": ["-y", "mcp-mathtools"]
    }
  }
}
```

## Tools (12)

| Tool | Description |
|------|-------------|
| `calc` | Evaluate math expressions safely (no eval) — supports sqrt, trig, log, etc. |
| `statistics` | Mean, median, mode, stddev, variance, range, sum |
| `percentage` | Percentage of, is-what-percent, percent change |
| `base_convert` | Convert between number bases (2–36) |
| `unit_convert` | Length, weight, temperature, data size, time |
| `compound_interest` | Compound interest with optional contributions |
| `loan_payment` | Monthly payment and total interest for loans |
| `proportion` | Solve direct and inverse proportions |
| `prime_check` | Primality test with factorization |
| `gcd_lcm` | Greatest common divisor and least common multiple |
| `random_number` | Random integers or floats in a range |
| `matrix` | Add, multiply, transpose, determinant |

## Zero dependencies

Only requires `@modelcontextprotocol/sdk`. All tools use Node.js built-ins.

## Part of the MCP Toolkit

Want all 60+ tools in one server? Try [mcp-all-tools](https://www.npmjs.com/package/mcp-all-tools).

## Support

If this tool saves you time, consider supporting development:

- [Buy me a coffee](https://buymeacoffee.com/gl89tu25lp)
- [Tip via Stripe ($3)](https://buy.stripe.com/dRm8wP8R295Z9VyeN59Zm00)

## License

MIT
