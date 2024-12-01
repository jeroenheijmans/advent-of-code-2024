import { describe, it, expect } from "bun:test";

const add = (a, b) => a + b;

function valueFor(data, coords) {
  let pointer = 0;
  let stack = [];

  while (true) {
    const [instruction, subject] = data[pointer];
    switch (instruction) {
      case "push":
        const value = /\d+/.test(subject) ? parseInt(subject) : coords[subject];
        stack.push(value);
        break;
      case "add":
        stack.push(stack.pop() + stack.pop());
        break;
      case "jmpos":
        if (stack.pop() >= 0) pointer += parseInt(subject);
        break;
      case "ret":
        return stack.pop();
      default:
        throw `Unknown instruction: ${instruction}`;
    }
    pointer++;
  }
}

function part1(data) {
  let result = 0;

  for (let x = 0; x < 30; x++) {
    for (let y = 0; y < 30; y++) {
      for (let z = 0; z < 30; z++) {
        result += valueFor(data, { x, y, z });
      }
    }
  }

  return result;
}

function part2(data) {
  return 0;
}

async function getDataFrom(file) {
  const input = await Bun.file(file).text();
  return input
    .toLowerCase() // Yikes! Example has lower case "x/y/z" but real data uppercase?!
    .split(/\r?\n/gi)
    .filter((x) => !!x)
    .map((x) => x.split(/\s+/gi));
}

describe("aoc.infi.nl", async () => {
  it("should solve part 1 with example 001", async () => {
    const data = await getDataFrom("src/aoc.infi.nl.example001.txt");
    const result = part1(data);
    expect(result).toBe(5686200);
  });

  it("should solve part 1", async () => {
    const data = await getDataFrom("src/aoc.infi.nl.txt");
    const result = part1(data);
    console.log("Infi AoC Sponsor Puzzle, part 1:", result);
    expect(result).toBe(5108);
  });

  it("should solve part 2", async () => {
    const data = await getDataFrom("src/aoc.infi.nl.txt");
    const result = part2(data);
    console.log("Infi AoC Sponsor Puzzle, part 2:", result);
    expect(result).toBe(0);
  });
});
