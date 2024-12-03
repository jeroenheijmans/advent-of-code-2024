import { describe, it, expect } from "bun:test";

const add = (a, b) => a + b;

function part1(data) {
  const matches = data.match(/mul\(\d+,\d+\)/g);
  return matches ? matches.map(match => {
    const [a, b] = match.match(/\d+/g).map(Number);
    return a * b;
  }).reduce(add, 0) : 0;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input.trim();
}

describe("day03", async () => {
  const example1 = `
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
  `;
  const example2 = `
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
  `;

  const input = await Bun.file("src/day03.txt").text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example1));
    console.log("Day 03, part 1 (example):", result);
    expect(result).toBe(161);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log("Day 03, part 1:", result);
    expect(result).toBe(183669043);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example2));
    console.log("Day 03, part 2 (example):", result);
    expect(result).toBe(48);
  });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log("Day 03, part 2:", result);
  //   expect(result).toBe(0);
  // });
});
