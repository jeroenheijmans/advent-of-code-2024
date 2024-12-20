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
    point.cheats = [
      `${point.x + 2};${point.y}`,
      `${point.x - 2};${point.y}`,
      `${point.x};${point.y + 2}`,
      `${point.x};${point.y - 2}`,
    ]
      .map((key) => map[key])
      .filter((p) => !!p && p.score - point.score > 2);
  });

  return points
    .map((p) => p.cheats.map((c) => c.score - p.score))
    .flat()
    .filter((score) => score > minimumSavedPicoSeconds).length;
}

function part2(points, minimumSavedPicoSeconds = 100) {
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

  let result = 0;

  points.forEach((point) => {
    point.cheats = [];
    for (let dy = -20; dy <= 20; dy++) {
      for (let dx = -20; dx <= 20; dx++) {
        if (Math.abs(dy) + Math.abs(dx) > 20) continue;
        const target = map[`${point.x + dx};${point.y + dy}`];
        if (!target) continue;
        if (target === point) continue;
        const cost = Math.abs(dy) + Math.abs(dx);
        if (target.score - point.score - cost >= minimumSavedPicoSeconds) {
          result++;
        }
      }
    }
  });

  return result;
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

  // it("should solve part 1 (example)", () => {
  //   const result = part1(parseInput(example1), 10);
  //   console.log(`Day ${day}, part 1 (example):`, result);
  //   expect(result).toBe(10);
  // });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(1332);
  // });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example1), 50);
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(285);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(0);
  });
});
