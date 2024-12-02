import { describe, it, expect } from "bun:test";

function part1(data) {
  function isSafe(report) {
    // console.log(report);
    const isIncreasing = report[1] > report[0];
    for (let i = 0; i < report.length - 1; i++) {
      const diff = report[i + 1] - report[i];
      const isMovingCorrectly = isIncreasing ? diff > 0 : diff < 0;
      const absDiff = Math.abs(diff);
      if (isMovingCorrectly && absDiff <= 3) continue;
      return false;
    }
    return true;
  }
  const safeReports = data.filter(r => isSafe(r));
  // console.log(safeReports);
  return safeReports.length;
}

function part2(data) {
  function isSafe(report) {
    let errors = 0;
    // console.log(report);
    const isIncreasing = report[1] > report[0];
    for (let i = 0; i < report.length - 1; i++) {
      const diff = report[i + 1] - report[errors > 0 ? i -1 : i];
      const isMovingCorrectly = isIncreasing ? diff > 0 : diff < 0;
      const absDiff = Math.abs(diff);
      if (isMovingCorrectly && absDiff <= 3) continue;
      errors++;
      if (errors > 1) return false;
    }
    return true;
  }
  const safeReports = data.filter(r => isSafe(r));
  // console.log(safeReports);
  return safeReports.length;
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
    console.log("Day 02, part 1:", result);
    expect(result).toBe(2);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log("Day 02, part 1:", result);
    expect(result).toBe(0);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log("Day 02, part 2:", result);
    expect(result).toBe(0);
  });
});
