import { describe, it, expect } from "bun:test";

const day = "06";

function findRouteSize(data) {
  const maxx = Math.max(...data.map((p) => p.x));
  const maxy = Math.max(...data.map((p) => p.y));
  const obstacles = data.filter((p) => p.char === "#");
  const map = new Map(obstacles.map((p) => [p.key, p]));

  let { x, y } = data.find((p) => p.char === "^");
  let dir = { dx: 0, dy: -1 };
  const visited = new Set();
  const visitsWithDirection = new Set();

  while (x >= 0 && y >= 0 && x <= maxx && y <= maxy) {
    const key = `${x};${y}`;
    const next = `${x + dir.dx};${y + dir.dy}`;
    visited.add(key);

    const masterKey = `${key};${dir.dx};${dir.dy}`;
    if (visitsWithDirection.has(masterKey)) throw "Loop found!";
    visitsWithDirection.add(masterKey);

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

function part1(data) {
  return findRouteSize(data);
}

function part2(data) {
  const maxx = Math.max(...data.map((p) => p.x));
  const maxy = Math.max(...data.map((p) => p.y));
  const obstacles = data.filter((p) => p.char === "#");
  const map = new Map(obstacles.map((p) => [p.key, p]));

  let { x, y } = data.find((p) => p.char === "^");
  let result = 0;

  for (let y2 = 0; y2 <= maxy; y2++) {
    for (let x2 = 0; x2 <= maxx; x2++) {
      const newKey = `${x2};${y2}`;

      if (x2 === x && y2 === y) continue;
      if (map.get(newKey)) continue;

      try {
        const newData = [...data, { x: x2, y: y2, key: newKey, char: "#"}];
        const _size = findRouteSize(newData);
      } catch (error) {
        if (error === "Loop found!") result++;
        else throw error;
      }
    }
  }
  return result;
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
    expect(result).toBe(5531);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(6);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(2165);
  });
});
