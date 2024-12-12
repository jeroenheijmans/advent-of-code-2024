import { describe, it, expect } from "bun:test";

const day = "12";

function part1(data) {
  let areas = data.map((point) => [point]);

  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const isAdjacentTo = (one, two) =>
    one.some((a1) => two.some((a2) => distance(a1, a2) === 1));
  const merge = (one, two) => [...one, ...two];

  let hasJustFolded = false;
  do {
    hasJustFolded = false;

    for (const one of areas) {
      const two = areas.find(
        (a) => a !== one && a[0].plant === one[0].plant && isAdjacentTo(a, one)
      );
      if (two) {
        areas = [
          ...areas.filter((a) => a !== one && a !== two),
          merge(one, two),
        ];
        hasJustFolded = true;
        break;
      }
    }
  } while (hasJustFolded);

  // console.log(areas.map((a) => ({ plant: a[0].plant, len: a.length })));

  const perimeter = (area) =>
    area
      .map(
        (p) => 4 - area.filter((p2) => p2 !== p && distance(p, p2) === 1).length
      )
      .reduce((a, b) => a + b, 0);

  return areas.map((a) => a.length * perimeter(a)).reduce((a, b) => a + b, 0);
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((line, y) => line.split("").map((plant, x) => ({ x, y, plant })))
    .flat();
}

describe(`day${day}`, async () => {
  const example = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(1930);
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
