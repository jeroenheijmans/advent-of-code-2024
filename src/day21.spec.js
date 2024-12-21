import { describe, it, expect } from "bun:test";

const day = "21";

const numLengths = {
  0: [0, 2, 1, 2, 3, 2, 3, 4, 3, 4, 1],
  1: [2, 0, 1, 2, 1, 2, 3, 2, 3, 4, 3],
  2: [1, 1, 0, 1, 2, 1, 2, 3, 2, 3, 2],
  3: [2, 2, 1, 0, 3, 2, 1, 4, 3, 2, 1],
  4: [3, 1, 2, 3, 0, 1, 2, 1, 2, 3, 4],
  5: [2, 2, 1, 2, 1, 0, 1, 2, 1, 2, 3],
  6: [3, 3, 2, 1, 2, 1, 0, 3, 2, 1, 2],
  7: [4, 2, 3, 4, 1, 2, 3, 0, 1, 2, 5],
  8: [3, 3, 2, 3, 2, 1, 2, 1, 0, 1, 4],
  9: [4, 4, 3, 2, 3, 2, 1, 2, 1, 0, 3],
  10: [1, 3, 2, 1, 4, 3, 2, 5, 4, 3, 0],
};

const padLengths = {
  "^": [0, 2, 1, 2, 1],
  "<": [2, 0, 1, 2, 3],
  "V": [1, 1, 0, 1, 2],
  ">": [2, 2, 1, 0, 1],
  "A": [1, 3, 2, 1, 0],
};

function part1(data) {
  return data.length;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input.trim().split(/\r?\n/g);
}

describe(`day${day}`, async () => {
  const example1 = `
029A
980A
179A
456A
379A
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(0);
  });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(0);
  // });

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
