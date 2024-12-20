import { describe, it, expect } from "bun:test";

const day = "18";

const dirs = [
  { dx: -1, dy: 0 },
  { dx: +1, dy: 0 },
  { dx: 0, dy: +1 },
  { dx: 0, dy: -1 },
];

function part1(data, max = 70, count = 1024) {
  const walls = new Set(data.slice(0, count).map(p => `${p[0]};${p[1]}`));
  const target = `${max};${max}`;
  
  let result = 0;
  let edges = [[0,0]];
  const visited = new Set();
  while (edges.length > 0) {
    const newEdges = [];
    
    for (const edge of edges) {
      const key = `${edge[0]};${edge[1]}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (key === target) return result;

      for (const dir of dirs) {
        const x = edge[0] + dir.dx;
        const y = edge[1] + dir.dy;
        if (x < 0 || y < 0) continue;
        if (x > max || y > max) continue;
        const newKey = `${x};${y}`;
        if (walls.has(newKey)) continue;
        newEdges.push([x,y]);
      }
    }
    result++;
    edges = newEdges;
  }

  throw "No solution found!";
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map(line => line.split(",").map(i => parseInt(i)));
}

describe(`day${day}`, async () => {
  const example1 = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1), 6, 12);
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(22);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(0);
  });

  // it("should solve part 2 (example 1)", () => {
  //   const result = part2(parseInput(example1));
  //   console.log(`Day ${day}, part 2 (example 1):`, result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});