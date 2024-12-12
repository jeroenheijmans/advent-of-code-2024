import { describe, it, expect } from "bun:test";

const day = "12";

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y); 
const key = (p) => `${p.x};${p.y}`;

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
  const areas = getAreas(data);

  const map = data.reduce((result, next) => {
    result[key(next)] = next;
    return result;
  }, {});


  const adhocMerging = (result, next) => {
    const candidate = result.find(wall => next.some(side => wall.some(s => {
      if (s.type !== side.type) return false;
      if (s.type === "hor" && s.x === side.x && Math.abs(s.y - side.y) === 1) return true;
      if (s.type === "ver" && s.y === side.y && Math.abs(s.x - side.x) === 1) return true;
      return false;
    })));

    if (candidate) candidate.push(next)
    else result.push(next);

    return result;
  };

  const sides = area => area.map(p1 => {
      const sides = []
      if (!area.some(p2 => p2.x === p1.x && p2.y === p1.y - 1)) sides.push({ type: 'ver', x: p1.x, y: p1.y - 0.1 });
      if (!area.some(p2 => p2.x === p1.x && p2.y === p1.y + 1)) sides.push({ type: 'ver', x: p1.x, y: p1.y + 0.1 });
      if (!area.some(p2 => p2.y === p1.y && p2.x === p1.x - 1)) sides.push({ type: 'hor', y: p1.y, x: p1.x - 0.1 });
      if (!area.some(p2 => p2.y === p1.y && p2.x === p1.x + 1)) sides.push({ type: 'hor', y: p1.y, x: p1.x + 0.1 });
      return sides;
    })
    .flat()
    .reduce((result, side) => {
      const candidate = result.find(wall => wall.some(s => {
        if (s.type !== side.type) return false;
        if (s.type === "hor" && s.x === side.x && Math.abs(s.y - side.y) === 1) return true;
        if (s.type === "ver" && s.y === side.y && Math.abs(s.x - side.x) === 1) return true;
        return false;
      }));
      
      if (candidate) candidate.push(side);
      else result.push([side]);

      return result;
    }, [])
    // Merge wall segments that accidentally got split up by the above crappy algorithm
    .reduce(adhocMerging, [])
    .reduce(adhocMerging, [])
    .reduce(adhocMerging, [])
    .reduce(adhocMerging, []);

  // areas.forEach(a => console.log("Area", a[0].plant, " = length ", a.length, " *  sides", sides(a).length));
  // console.log();
  // sides(areas.find(a => a[0].plant === "E")).forEach(s => {
  //   const base = s[0].type === "ver" ? "y = " + s[0].y : "x = " + s[0].x;
  //   const coords = s.map(p => s[0].type === "ver" ? p.x : p.y).join(", ");
  //   console.log(s[0].type, "", base.toString().padEnd(6, " "), "   =>   ", coords);
  // });
  // console.log();

  return areas.map(a => a.length * sides(a).length).reduce((a,b) => a + b, 0);
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

  const example2 = `
AAAA
BBCD
BBCC
EEEC
  `;

  const example3 = `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
  `;

  const example4 = `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  // it("should solve part 1 (example)", () => {
  //   const result = part1(parseInput(example));
  //   console.log(`Day ${day}, part 1 (example):`, result);
  //   expect(result).toBe(1930);
  // });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(1449902);
  // });

  // it("should solve part 2 (example)", () => {
  //   const result = part2(parseInput(example));
  //   console.log(`Day ${day}, part 2 (example):`, result);
  //   expect(result).toBe(1206);
  // });

  // it("should solve part 2 (example 2)", () => {
  //   const result = part2(parseInput(example2));
  //   console.log(`Day ${day}, part 2 (example 2):`, result);
  //   expect(result).toBe(80);
  // });

  // it("should solve part 2 (example 3)", () => {
  //   const result = part2(parseInput(example3));
  //   console.log(`Day ${day}, part 2 (example 3):`, result);
  //   expect(result).toBe(236);
  // });

  // it("should solve part 2 (example 4)", () => {
  //   const result = part2(parseInput(example4));
  //   console.log(`Day ${day}, part 2 (example 4):`, result);
  //   expect(result).toBe(368);
  // });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBeGreaterThan(903391);
    expect(result).toBeGreaterThan(906157);
    expect(result).toBeLessThan(908755);    
    expect(result).toBe(0);
  });
});
