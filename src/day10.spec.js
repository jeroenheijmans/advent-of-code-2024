import { describe, it, expect } from "bun:test";

const day = "10";

function recursivelySolve(data) {
  const maxx = Math.max(...data.map((p) => p.x));
  const maxy = Math.max(...data.map((p) => p.y));

  const map = data.reduce((result, next) => {
    result[next.key] = next;
    return result;
  }, {});

  function neighbors({ x, y }) {
    const result = [];
    if (x > 0 && y >= 0 && y <= maxy) result.push(map[`${x - 1};${y}`]);
    if (y > 0 && x >= 0 && x <= maxx) result.push(map[`${x};${y - 1}`]);
    if (x < maxx && y >= 0 && y <= maxy) result.push(map[`${x + 1};${y}`]);
    if (y < maxy && x >= 0 && x <= maxy) result.push(map[`${x};${y + 1}`]);
    return result;
  }

  function recursivelyFindEnds(current) {
    if (current.value === 9) return [current.key];
    const target = current.value + 1;
    return neighbors(current)
      .filter((neighbor) => neighbor.value === target)
      .map((neighbor) => recursivelyFindEnds(neighbor))
      .flat();
  }

  return data.filter((p) => p.value === 0).map((z) => recursivelyFindEnds(z));
}

function part1(data) {
  return recursivelySolve(data).reduce((p, c) => p + new Set(c).size, 0);
}

function part2(data) {
  return recursivelySolve(data).reduce((p, c) => p + c.length, 0);
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .map((line, y) =>
      line.split("").map((value, x) => ({
        x,
        y,
        key: `${x};${y}`,
        value: parseInt(value),
      }))
    )
    .flat();
}

describe(`day${day}`, async () => {
  const example = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(36);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(688);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(81);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(1459);
  });
});
