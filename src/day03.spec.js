import { describe, it, expect } from "bun:test";

function part1(data) {
  return data.length;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/)
    .filter((x) => !!x);
}

describe("day03", async () => {
  const example = `
  `;

  const input = await Bun.file("src/day03.txt").text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log("Day 03, part 1 (example):", result);
    expect(result).toBe(0);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log("Day 03, part 1:", result);
    expect(result).toBe(0);
  });

  // it("should solve part 2 (example)", () => {
  //   const result = part2(parseInput(example));
  //   console.log("Day 03, part 2 (example):", result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log("Day 03, part 2:", result);
  //   expect(result).toBe(0);
  // });
});
