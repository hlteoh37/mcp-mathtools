#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "mcp-mathtools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calc",
        description: "Evaluate a mathematical expression with precise arithmetic. Supports +, -, *, /, **, %, parentheses, and common functions (sqrt, abs, ceil, floor, round, sin, cos, tan, log, log2, log10, exp, min, max, PI, E).",
        inputSchema: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Math expression to evaluate, e.g. '(3.14 * 2) + sqrt(16)'" }
          },
          required: ["expression"]
        }
      },
      {
        name: "statistics",
        description: "Calculate statistics for a set of numbers: mean, median, mode, min, max, range, standard deviation, variance, sum, count.",
        inputSchema: {
          type: "object",
          properties: {
            numbers: {
              type: "array",
              items: { type: "number" },
              description: "Array of numbers to analyze"
            }
          },
          required: ["numbers"]
        }
      },
      {
        name: "percentage",
        description: "Percentage calculations: find percentage of a number, find what percentage A is of B, or find percentage change between two values.",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["of", "is_what_percent", "change"],
              description: "of: X% of Y. is_what_percent: X is what % of Y. change: % change from X to Y."
            },
            x: { type: "number", description: "First value" },
            y: { type: "number", description: "Second value" }
          },
          required: ["operation", "x", "y"]
        }
      },
      {
        name: "base_convert",
        description: "Convert a number between bases (binary, octal, decimal, hex, or any base 2-36).",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "string", description: "The number to convert (as string)" },
            from_base: { type: "number", description: "Source base (2-36, default: 10)" },
            to_base: { type: "number", description: "Target base (2-36, default: 16)" }
          },
          required: ["value"]
        }
      },
      {
        name: "unit_convert",
        description: "Convert between common units: length (mm/cm/m/km/in/ft/yd/mi), weight (mg/g/kg/oz/lb), temperature (C/F/K), data (B/KB/MB/GB/TB), time (ms/s/min/hr/day).",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "number", description: "Value to convert" },
            from: { type: "string", description: "Source unit (e.g. 'km', 'lb', 'C', 'GB')" },
            to: { type: "string", description: "Target unit (e.g. 'mi', 'kg', 'F', 'MB')" }
          },
          required: ["value", "from", "to"]
        }
      },
      {
        name: "compound_interest",
        description: "Calculate compound interest. Returns final amount, total interest earned, and period-by-period breakdown.",
        inputSchema: {
          type: "object",
          properties: {
            principal: { type: "number", description: "Initial amount" },
            rate: { type: "number", description: "Annual interest rate as percentage (e.g. 5 for 5%)" },
            years: { type: "number", description: "Number of years" },
            compounds_per_year: { type: "number", description: "Compounding frequency per year (default: 12 for monthly)" },
            monthly_contribution: { type: "number", description: "Additional monthly contribution (default: 0)" }
          },
          required: ["principal", "rate", "years"]
        }
      },
      {
        name: "loan_payment",
        description: "Calculate monthly loan/mortgage payment, total payment, and total interest.",
        inputSchema: {
          type: "object",
          properties: {
            principal: { type: "number", description: "Loan amount" },
            annual_rate: { type: "number", description: "Annual interest rate as percentage (e.g. 6.5 for 6.5%)" },
            years: { type: "number", description: "Loan term in years" }
          },
          required: ["principal", "annual_rate", "years"]
        }
      },
      {
        name: "proportion",
        description: "Solve proportions: if A:B = C:X, find X. Also handles inverse proportions.",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First value of known ratio" },
            b: { type: "number", description: "Second value of known ratio" },
            c: { type: "number", description: "Known value to find proportion for" },
            inverse: { type: "boolean", description: "If true, solve inverse proportion (default: false)" }
          },
          required: ["a", "b", "c"]
        }
      },
      {
        name: "prime_check",
        description: "Check if a number is prime. For composite numbers, returns the prime factorization.",
        inputSchema: {
          type: "object",
          properties: {
            number: { type: "number", description: "Number to check (positive integer)" }
          },
          required: ["number"]
        }
      },
      {
        name: "gcd_lcm",
        description: "Calculate the Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of two or more numbers.",
        inputSchema: {
          type: "object",
          properties: {
            numbers: {
              type: "array",
              items: { type: "number" },
              description: "Array of positive integers"
            }
          },
          required: ["numbers"]
        }
      },
      {
        name: "random_number",
        description: "Generate random numbers (integers or floats) within a range.",
        inputSchema: {
          type: "object",
          properties: {
            min: { type: "number", description: "Minimum value (default: 0)" },
            max: { type: "number", description: "Maximum value (default: 100)" },
            count: { type: "number", description: "How many numbers to generate (default: 1, max: 100)" },
            integer: { type: "boolean", description: "If true, generate integers only (default: true)" }
          }
        }
      },
      {
        name: "matrix",
        description: "Matrix operations: add, multiply, transpose, determinant (2x2 and 3x3).",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["add", "multiply", "transpose", "determinant"],
              description: "Matrix operation"
            },
            a: {
              type: "array",
              items: { type: "array", items: { type: "number" } },
              description: "First matrix (2D array)"
            },
            b: {
              type: "array",
              items: { type: "array", items: { type: "number" } },
              description: "Second matrix (for add/multiply)"
            }
          },
          required: ["operation", "a"]
        }
      }
    ]
  };
});

// Safe math expression evaluator (no eval)
function safeCalc(expr) {
  const fns = {
    sqrt: Math.sqrt, abs: Math.abs, ceil: Math.ceil, floor: Math.floor,
    round: Math.round, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    log: Math.log, log2: Math.log2, log10: Math.log10, exp: Math.exp,
    min: Math.min, max: Math.max
  };
  const constants = { PI: Math.PI, E: Math.E };

  // Tokenizer
  let pos = 0;
  const s = expr.replace(/\s+/g, "");

  function peek() { return s[pos]; }
  function consume(ch) {
    if (s[pos] === ch) { pos++; return true; }
    return false;
  }

  function parseNumber() {
    let start = pos;
    if (s[pos] === "-" || s[pos] === "+") pos++;
    while (pos < s.length && (s[pos] >= "0" && s[pos] <= "9" || s[pos] === ".")) pos++;
    if (pos === start) return null;
    return parseFloat(s.slice(start, pos));
  }

  function parseIdentifier() {
    let start = pos;
    while (pos < s.length && /[a-zA-Z0-9_]/.test(s[pos])) pos++;
    return s.slice(start, pos);
  }

  function parseAtom() {
    // Function call or constant
    if (/[a-zA-Z]/.test(s[pos])) {
      const name = parseIdentifier();
      if (name in constants) return constants[name];
      if (name in fns) {
        if (!consume("(")) throw new Error(`Expected ( after ${name}`);
        const args = [parseExpr()];
        while (consume(",")) args.push(parseExpr());
        if (!consume(")")) throw new Error(`Expected ) after ${name} args`);
        return fns[name](...args);
      }
      throw new Error(`Unknown: ${name}`);
    }
    // Parenthesized expression
    if (consume("(")) {
      const val = parseExpr();
      if (!consume(")")) throw new Error("Mismatched parentheses");
      return val;
    }
    // Number
    const num = parseNumber();
    if (num === null) throw new Error(`Unexpected: ${s[pos]}`);
    return num;
  }

  function parseUnary() {
    if (s[pos] === "-" && (pos === 0 || "(,+-*/%".includes(s[pos - 1]))) {
      pos++;
      return -parseUnary();
    }
    if (s[pos] === "+") { pos++; return parseUnary(); }
    return parseAtom();
  }

  function parsePower() {
    let val = parseUnary();
    while (s.slice(pos, pos + 2) === "**") {
      pos += 2;
      val = Math.pow(val, parseUnary());
    }
    return val;
  }

  function parseMulDiv() {
    let val = parsePower();
    while (pos < s.length && ("*/%".includes(s[pos]) && s.slice(pos, pos + 2) !== "**")) {
      const op = s[pos++];
      const right = parsePower();
      if (op === "*") val *= right;
      else if (op === "/") { if (right === 0) throw new Error("Division by zero"); val /= right; }
      else val %= right;
    }
    return val;
  }

  function parseExpr() {
    let val = parseMulDiv();
    while (pos < s.length && (s[pos] === "+" || s[pos] === "-")) {
      const op = s[pos++];
      const right = parseMulDiv();
      val = op === "+" ? val + right : val - right;
    }
    return val;
  }

  const result = parseExpr();
  if (pos < s.length) throw new Error(`Unexpected character: ${s[pos]}`);
  return result;
}

function statistics(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const freq = {};
  sorted.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  const variance = numbers.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  return { count: n, sum, mean, median, mode: modes, min: sorted[0], max: sorted[n - 1], range: sorted[n - 1] - sorted[0], variance, stddev };
}

// Unit conversion tables
const unitGroups = {
  length: {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  },
  weight: {
    mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592
  },
  data: {
    B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4
  },
  time: {
    ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400
  }
};

function convertUnit(value, from, to) {
  // Temperature special case
  const tempUnits = ["C", "F", "K"];
  if (tempUnits.includes(from) && tempUnits.includes(to)) {
    let celsius;
    if (from === "C") celsius = value;
    else if (from === "F") celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;
    if (to === "C") return celsius;
    if (to === "F") return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }
  for (const group of Object.values(unitGroups)) {
    if (from in group && to in group) {
      return value * group[from] / group[to];
    }
  }
  throw new Error(`Cannot convert ${from} to ${to}. Supported: length (mm/cm/m/km/in/ft/yd/mi), weight (mg/g/kg/oz/lb), temp (C/F/K), data (B/KB/MB/GB/TB), time (ms/s/min/hr/day).`);
}

function primeFactors(n) {
  const factors = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n /= d; }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a / gcd(a, b)) * b; }

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result;

    switch (name) {
      case "calc": {
        const value = safeCalc(args.expression);
        result = { expression: args.expression, result: value };
        break;
      }
      case "statistics": {
        if (!args.numbers?.length) throw new Error("Need at least one number");
        result = statistics(args.numbers);
        break;
      }
      case "percentage": {
        const { operation, x, y } = args;
        if (operation === "of") {
          result = { description: `${x}% of ${y}`, result: (x / 100) * y };
        } else if (operation === "is_what_percent") {
          if (y === 0) throw new Error("Cannot divide by zero");
          result = { description: `${x} is what % of ${y}`, result: (x / y) * 100 };
        } else {
          if (x === 0) throw new Error("Cannot calculate % change from zero");
          const change = ((y - x) / Math.abs(x)) * 100;
          result = { description: `% change from ${x} to ${y}`, result: change };
        }
        break;
      }
      case "base_convert": {
        const fromBase = args.from_base || 10;
        const toBase = args.to_base || 16;
        const decimal = parseInt(args.value, fromBase);
        if (isNaN(decimal)) throw new Error(`Invalid number '${args.value}' for base ${fromBase}`);
        result = { input: args.value, from_base: fromBase, to_base: toBase, result: decimal.toString(toBase).toUpperCase() };
        break;
      }
      case "unit_convert": {
        const converted = convertUnit(args.value, args.from, args.to);
        result = { value: args.value, from: args.from, to: args.to, result: converted };
        break;
      }
      case "compound_interest": {
        const { principal, rate, years } = args;
        const n = args.compounds_per_year || 12;
        const monthly = args.monthly_contribution || 0;
        const r = rate / 100;
        let balance = principal;
        const yearly = [];
        for (let y = 1; y <= years; y++) {
          for (let p = 0; p < n; p++) {
            balance = balance * (1 + r / n) + monthly;
          }
          yearly.push({ year: y, balance: Math.round(balance * 100) / 100 });
        }
        const totalContributed = principal + monthly * n * years;
        result = {
          final_amount: Math.round(balance * 100) / 100,
          total_contributed: Math.round(totalContributed * 100) / 100,
          total_interest: Math.round((balance - totalContributed) * 100) / 100,
          yearly_summary: yearly
        };
        break;
      }
      case "loan_payment": {
        const { principal, annual_rate, years } = args;
        const monthlyRate = annual_rate / 100 / 12;
        const payments = years * 12;
        let monthlyPayment;
        if (monthlyRate === 0) {
          monthlyPayment = principal / payments;
        } else {
          monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
        }
        const totalPayment = monthlyPayment * payments;
        result = {
          monthly_payment: Math.round(monthlyPayment * 100) / 100,
          total_payment: Math.round(totalPayment * 100) / 100,
          total_interest: Math.round((totalPayment - principal) * 100) / 100,
          loan_amount: principal,
          annual_rate: annual_rate,
          term_years: years
        };
        break;
      }
      case "proportion": {
        const { a, b, c, inverse } = args;
        if (a === 0) throw new Error("First value cannot be zero");
        const x = inverse ? (a * b) / c : (b * c) / a;
        result = { description: inverse ? `Inverse: ${a}:${b} = ${c}:X` : `${a}:${b} = ${c}:X`, x };
        break;
      }
      case "prime_check": {
        const n = Math.floor(args.number);
        if (n < 2) { result = { number: n, is_prime: false, reason: "Must be >= 2" }; break; }
        const factors = primeFactors(n);
        const isPrime = factors.length === 1 && factors[0] === n;
        result = { number: n, is_prime: isPrime };
        if (!isPrime) result.prime_factorization = factors;
        break;
      }
      case "gcd_lcm": {
        const nums = args.numbers.map(Math.floor);
        if (nums.length < 2) throw new Error("Need at least 2 numbers");
        let g = nums[0], l = nums[0];
        for (let i = 1; i < nums.length; i++) {
          g = gcd(g, nums[i]);
          l = lcm(l, nums[i]);
        }
        result = { numbers: nums, gcd: g, lcm: l };
        break;
      }
      case "random_number": {
        const min = args.min ?? 0;
        const max = args.max ?? 100;
        const count = Math.min(args.count ?? 1, 100);
        const isInt = args.integer !== false;
        const nums = [];
        for (let i = 0; i < count; i++) {
          const v = Math.random() * (max - min) + min;
          nums.push(isInt ? Math.floor(v) : Math.round(v * 1e6) / 1e6);
        }
        result = count === 1 ? { result: nums[0] } : { results: nums };
        break;
      }
      case "matrix": {
        const { operation, a, b } = args;
        if (operation === "transpose") {
          result = { result: a[0].map((_, i) => a.map(row => row[i])) };
        } else if (operation === "determinant") {
          if (a.length === 2 && a[0].length === 2) {
            result = { result: a[0][0] * a[1][1] - a[0][1] * a[1][0] };
          } else if (a.length === 3 && a[0].length === 3) {
            const det = a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
              - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
              + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
            result = { result: det };
          } else {
            throw new Error("Determinant only supported for 2x2 and 3x3 matrices");
          }
        } else if (operation === "add") {
          if (!b) throw new Error("Second matrix required for add");
          if (a.length !== b.length || a[0].length !== b[0].length) throw new Error("Matrices must have same dimensions");
          result = { result: a.map((row, i) => row.map((v, j) => v + b[i][j])) };
        } else if (operation === "multiply") {
          if (!b) throw new Error("Second matrix required for multiply");
          if (a[0].length !== b.length) throw new Error("Matrix A columns must equal matrix B rows");
          const res = a.map((row, i) =>
            b[0].map((_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0))
          );
          result = { result: res };
        }
        break;
      }
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
