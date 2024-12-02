import { describe, it, expect } from "bun:test";

function isSafe(report) {
  const clone = [...report];
  const isIncreasing = clone[1] > clone[0];
  while (clone.length > 1) {
    const head = clone.shift();
    const diff = clone[0] - head;
    if (isIncreasing) {
      if (diff <= 0 || diff > 3) return false;
    } else {
      if (diff >= 0 || diff < -3) return false;
    }
  }
  return true;
}

function part1(data) {
  return data.filter(r => isSafe(r)).length;
}

function part2(data) {
  return data.filter(r => {
    if (isSafe(r)) return true;
    for (let i = 0; i < data.length; i++) {
      const clone = [...r];
      clone.splice(i, 1);
      if (isSafe(clone)) return true;
    }
  }).length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/gi)
    .filter((x) => !!x)
    .map(x => x.split(/\s+/ig).map(x => parseInt(x)));
}

describe("day02", async () => {
  const example = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
  `;

  const input = await Bun.file("src/day02.txt").text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log("Day 02, part 1 (example):", result);
    expect(result).toBe(2);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log("Day 02, part 1:", result);
    expect(result).toBe(306);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log("Day 02, part 2 (example):", result);
    expect(result).toBe(4);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log("Day 02, part 2:", result);
    expect(result).toBe(366);
  });
});
