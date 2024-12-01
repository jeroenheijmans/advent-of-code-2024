import { describe, it, expect } from "bun:test";

function part1(data) {
  return data.length;
}

function part2(data) {
  return 0;
}

describe("day02", async () => {
  const input = await Bun.file("src/day02.txt").text();
  const data = input
    .split(/\r?\n/gi)
    .filter((x) => !!x);

  it("should solve part 1", () => {
    const result = part1(data);
    console.log("Day 01, part 1:", result);
    expect(result).toBe(0);
  });

  it("should solve part 2", () => {
    const result = part2(data);
    console.log("Day 01, part 2:", result);
    expect(result).toBe(0);
  });
});
