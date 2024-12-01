import { describe, it, expect } from "bun:test";

const add = (a, b) => a + b;

function part1(data) {
  const as = data.map((x) => x[0]).toSorted((a, b) => a - b);
  const bs = data.map((x) => x[1]).toSorted((a, b) => a - b);
  return as.map((a, idx) => Math.abs(bs[idx] - a)).reduce(add, 0);
}

function part2(data) {
  const bs = data.map((x) => x[1]);
  return data
    .map((x) => x[0])
    .map((a) => a * bs.filter((b) => b === a).length)
    .reduce(add, 0);
}

describe("day01", async () => {
  const input = await Bun.file("src/day01.txt").text();
  const data = input
    .split(/\r?\n/gi)
    .filter((x) => !!x)
    .map((x) => x.split(/\s+/gi).map((y) => parseInt(y)));

  it("should solve part 1", () => {
    const result = part1(data);
    console.log("Day 01, part 1:", result);
    expect(result).toBe(1879048);
  });

  it("should solve part 2", () => {
    const result = part2(data);
    console.log("Day 01, part 2:", result);
    expect(result).toBe(21024792);
  });
});
