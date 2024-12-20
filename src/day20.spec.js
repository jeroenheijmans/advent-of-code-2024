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
    const target = [
      `${current.x + 1};${current.y}`,
      `${current.x - 1};${current.y}`,
      `${current.x};${current.y + 1}`,
      `${current.x};${current.y - 1}`,
    ]
      .map((key) => map[key])
      .find((p) => !!p && p !== current.previous);
    current.next = target;
    target.previous = current;
    target.score = current.score + 1;
    current = target;
  }

  let result = 0;

  points.forEach((point) => {
    result += [
      `${point.x + 2};${point.y}`,
      `${point.x - 2};${point.y}`,
      `${point.x};${point.y + 2}`,
      `${point.x};${point.y - 2}`,
    ]
      .map((key) => map[key])
      .filter(
        (p) => !!p && p.score - point.score > minimumSavedPicoSeconds
      ).length;
  });

  return result;
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
    const target = [
      `${current.x + 1};${current.y}`,
      `${current.x - 1};${current.y}`,
      `${current.x};${current.y + 1}`,
      `${current.x};${current.y - 1}`,
    ]
      .map((key) => map[key])
      .find((p) => !!p && p !== current.previous);
    current.next = target;
    target.previous = current;
    target.score = current.score + 1;
    current = target;
  }

  let result = 0;

  points.forEach((point) => {
    for (let dy = -20; dy <= 20; dy++) {
      for (let dx = -20; dx <= 20; dx++) {
        const cost = Math.abs(dy) + Math.abs(dx);
        if (cost > 20) continue;
        const target = map[`${point.x + dx};${point.y + dy}`];
        if (!target || target === point) continue;
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

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example1), 50);
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(285);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(987695);
  });
});
