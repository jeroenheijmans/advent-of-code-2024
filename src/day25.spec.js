import { describe, it, expect } from "bun:test";

const day = "25";

function part1(data) {
  return data
    .filter((d) => d.isKey)
    .map((key) =>
      data
        .filter((d) => !d.isKey)
        .filter((lock) => lock.pins.every((pin, x) => pin + key.pins[x] <= 5))
    )
    .flat().length;
}

function part2(_) {
  return "⭐️";
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n\r?\n/g)
    .map((data) => ({
      count: data.match(/#/g)?.length - 5,
      points: data
        .split(/\r?\n/g)
        .map((line, y) =>
          line.split("").map((char, x) => ({
            char,
            x,
            y,
          }))
        )
        .flat(),
    }))
    .map(({ count, points }) => ({
      count,
      points,
      pins: [0, 1, 2, 3, 4].map(
        (x) => points.filter((p) => p.char === "#" && p.x === x).length - 1
      ),
      isKey: points.some((p) => p.char === "." && p.x === 0 && p.y === 0),
    }));
}

describe(`day${day}`, async () => {
  const example1 = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(3);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(3057);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe("⭐️");
  });
});
