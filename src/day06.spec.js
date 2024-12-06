import { describe, it, expect } from "bun:test";

const day = "06";

function part1(data) {
  const maxx = Math.max(...data.map((p) => p.x));
  const maxy = Math.max(...data.map((p) => p.y));
  const obstacles = data.filter((p) => p.char === "#");
  const map = new Map(obstacles.map((p) => [p.key, p]));

  let { x, y } = data.find((p) => p.char === "^");
  let dir = { dx: 0, dy: -1 };
  const visited = new Set();

  while (x >= 0 && y >= 0 && x <= maxx && y <= maxy) {
    const key = `${x};${y}`;
    const next = `${x + dir.dx};${y + dir.dy}`;
    visited.add(key);

    if (map.get(next)) {
      if (dir.dy === -1) dir = { dx: +1, dy: 0 };
      else if (dir.dy === +1) dir = { dx: -1, dy: 0 };
      else if (dir.dx === -1) dir = { dx: 0, dy: -1 };
      else if (dir.dx === +1) dir = { dx: 0, dy: +1 };
    } else {
      x += dir.dx;
      y += dir.dy;
    }
  }
  return visited.size;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((line) => line.split(""))
    .map((line, y) =>
      line.map((char, x) => ({
        key: `${x};${y}`,
        x,
        y,
        char,
      }))
    )
    .flat();
}

describe(`day${day}`, async () => {
  const example = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(41);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(0);
  });

  // it("should solve part 2 (example)", () => {
  //   const result = part2(parseInput(example));
  //   console.log(`Day ${day}, part 2 (example):`, result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});
