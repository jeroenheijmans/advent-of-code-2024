import { describe, it, expect } from "bun:test";

function part1(data) {
  let result = 0;
  const as = data.map(x => x.first).toSorted((a,b) => a - b);
  const bs = data.map(x => x.second).toSorted((a,b) => a - b);
  as.forEach((a, idx) => result += Math.abs(bs[idx] - a))
  return result
}

function part2(data) {
  return 0;
} 

describe("day01", async () => {
  const input = await Bun.file("src/day01.txt").text();
  const data = input
    .split(/\r?\n/gi)
    .filter((x) => !!x)
    .map(x => x.split(/\s+/ig))
    .map(x => ({
      first: parseInt(x[0]),
      second: parseInt(x[1]),
    }))

  it("should solve part 1", () => {
    const result = part1(data);
    console.log("Day 01, part 1:", result)
    expect(result).toBe(1879048);
  });

  it("should solve part 2", () => {
    const result = part2(data);
    console.log("Day 01, part 2:", result)
    expect(result).toBe(0);
  });
});
