import { describe, it, expect } from "bun:test";

const day = "17";

function part1({ a, b, c, program }) {
  let pos = 0;

  function combo(val) {
    if (val < 4) return val;
    if (val === 4) return a;
    if (val === 5) return b;
    if (val === 6) return c;
    throw "Unexpected combo: " + val
  }

  let result = [];

  while (true) {
    if (pos >= program.length) break;

    const operation = program[pos];
    const operand = program[pos + 1];

    // console.log([a,b,c], pos, operation, operand);

    switch (operation) {
      case 0: // adv
        a = Math.trunc(a / Math.pow(2, combo(operand)));
        pos += 2;
        break;

      case 1: // bxl
        b = b ^ operand;
        pos += 2;
        break;

      case 2: // bst
        b = combo(operand) % 8;
        pos += 2;
        break;
      
      case 3: // jnz
        if (a !== 0) pos = operand;
        else pos += 2;
        break;

      case 4: // bxc
        b = b ^ c;
        pos += 2;
        break;

      case 5: // out
        result.push(combo(operand) % 8);
        pos += 2;
        break;

      case 6: // bdv
        b = Math.trunc(a / Math.pow(2, combo(operand)));
        pos += 2;
        break;
      
      case 7: // cdv
        c = Math.trunc(a / Math.pow(2, combo(operand)));
        pos += 2;
        break;

      default:
        throw "Unknown opcode";
    }
  }

  return result.join(",");
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return {
    a: parseInt(input.match(/Register A: (\d+)/)[1]),
    b: parseInt(input.match(/Register B: (\d+)/)[1]),
    c: parseInt(input.match(/Register C: (\d+)/)[1]),
    program: input
      .match(/Program: (\S+)/)[1]
      .split(",")
      .map((d) => parseInt(d)),
  };
}

describe(`day${day}`, async () => {
  const example1 = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe("4,6,3,5,6,3,5,2,1,0");
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe("7,4,2,5,1,4,6,0,4");
  });

  // it("should solve part 2 (example 1)", () => {
  //   const result = part2(parseInput(example1));
  //   console.log(`Day ${day}, part 2 (example 1):`, result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});
