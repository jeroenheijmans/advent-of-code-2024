import { describe, it, expect } from "bun:test";

function part1(data) {
  return 0 + 1;
}

function part2(data) {
  return 0;
}

describe("day01", async () => {
  const input = await Bun.file("src/day01.txt").text();
  const data = input.split(/\r?\n/gi).filter((x) => !!x);

  it("should solve part 1", () => {
    const result = part1(data);
    expect(result).toBe(0);
  });

  it("should solve part 2", () => {
    const result = part2(data);
    expect(result).toBe(0);
  });
});
