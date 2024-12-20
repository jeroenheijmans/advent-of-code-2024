import { describe, it, expect } from "bun:test";

const day = "20";

function part1(points, minimumSavedPicoSeconds = 100) {
  const map = Object.fromEntries(points.map((p) => [p.key, p]));
  const start = points.find((p) => p.char === "S");
  const finish = points.find((p) => p.char === "E");
  const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  // Make it a linked list
  let current = start;
  start.score = 0;
  while (current !== finish) {
    const target = points.find(
      (p) => dist(p, current) === 1 && p !== current.previous
    );
    current.next = target;
    target.previous = current;
    target.score = current.score + 1;
    current = target;
  }

  // Add cheat routes
  points.forEach((point) => {
    point.cheats = points.filter(
      (p) =>
        (p.y === point.y &&
          p.x - point.x === +2 &&
          !map[`${p.x - 1};${p.y}`]) ||
        (p.y === point.y &&
          p.x - point.x === -2 &&
          !map[`${p.x + 1};${p.y}`]) ||
        (p.x === point.x &&
          p.y - point.y === +2 &&
          !map[`${p.x};${p.y - 1}`]) ||
        (p.x === point.x && p.y - point.y === -2 && !map[`${p.x};${p.y + 1}`])
    );
  });

  return points
    .map((p) => p.cheats.map((c) => c.score - p.score))
    .flat()
    .filter((score) => score > minimumSavedPicoSeconds).length;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((line, y) =>
      line
        .trim()
        .split("")
        .map((char, x) => ({
          key: `${x};${y}`,
          x,
          y,
          char,
        }))
    )
    .flat()
    .filter((c) => c.char !== "#");
}

describe(`day${day}`, async () => {
  const example1 = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example1), 10);
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(10);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(1332);
  });

  // it("should solve part 2 (example)", () => {
  //   const result = part2(parseInput(example1));
  //   console.log(`Day ${day}, part 2 (example):`, result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});
