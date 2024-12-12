import { describe, it, expect } from "bun:test";

const day = "12";

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y); 

function getAreas(data) {
  const areas = [];
  const todo = new Set(data);
  while (todo.size > 0) {
    const start = todo.values().next().value;
    const area = new Set();
    area.add(start);
    todo.delete(start);

    function keepAddingFrom(lead) {
      const extras = data
        .filter(e => todo.has(e) && e.plant === lead.plant && distance(e, lead) === 1);
      
      extras.forEach(e => {
        area.add(e);
        todo.delete(e);
        keepAddingFrom(e);
      });
    }

    keepAddingFrom(start);
    areas.push([...area]);
  }
  return areas;
}

function part1(data) {
  const areas = getAreas(data);

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

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(1449902);
  // });

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
