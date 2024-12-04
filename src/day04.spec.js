import { describe, it, expect } from "bun:test";

const add = (a, b) => a + b;

const directions = [
  { dx: -1, dy: -1 }, // NW
  { dx: -1, dy: 0 }, // W
  { dx: -1, dy: +1 }, // SW
  { dx: 0, dy: +1 }, // S
  { dx: +1, dy: +1 }, // SE
  { dx: +1, dy: 0 }, // E
  { dx: +1, dy: -1 }, // NE
  { dx: 0, dy: -1 }, // N
]

function part1(data) {
  function countInstances({x, y}, dir, word) {
    if (word.length === 0) return 1;

    if (x < 0 || x >= data[0].length) return 0;
    if (y < 0 || y >= data.length) return 0;

    // console.log(x, y, dir.dx, dir.dy, word);

    const [head, ...tail] = word;
    if (data[y][x] !== head) return 0;

    const newY = y + dir.dy;
    const newX = x + dir.dx;
    
    return countInstances({x: newX, y: newY}, dir, tail);
  }
  
  let result = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      result += directions
        .map(dir => countInstances({x, y}, dir, "XMAS"))
        .reduce(add, 0);
    }
  }
  return result;
}

function part2(data) {
  let result = 0;
  for (let y = 1; y < data.length - 1; y++) {
    for (let x = 1; x < data[0].length - 1; x++) {
      if (data[y][x] !== "A") continue;

      let count = 0;

      if (data[y - 1][x - 1] === "M" && data[y + 1][x + 1] === "S") count++;
      if (data[y + 1][x - 1] === "M" && data[y - 1][x + 1] === "S") count++;
      if (data[y + 1][x + 1] === "M" && data[y - 1][x - 1] === "S") count++;
      if (data[y - 1][x + 1] === "M" && data[y + 1][x - 1] === "S") count++;
      
      if (count === 2) result++;
    }
  }
  return result;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map(x => x.split(""))
    ;
}

describe("day04", async () => {
  const example = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
  `;

  const input = await Bun.file("src/day04.txt").text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log("Day 04, part 1 (example):", result);
    expect(result).toBe(18);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log("Day 04, part 1:", result);
    expect(result).toBe(2571);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log("Day 04, part 2 (example):", result);
    expect(result).toBe(9);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log("Day 04, part 2:", result);
    expect(result).toBe(1992);
  });
});
