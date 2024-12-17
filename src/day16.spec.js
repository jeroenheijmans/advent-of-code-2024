import { describe, it, expect } from "bun:test";

const day = "16";

const getKey = (x, y) => `${x};${y}`;
const dirs = [
  { dx: -1, dy: +0, key: "west" },
  { dx: +0, dy: +1, key: "south" },
  { dx: +1, dy: +0, key: "east" },
  { dx: +0, dy: -1, key: "north" },
];

function part1(data) {
  const start = data.find((p) => p.char === "S");
  const finish = data.find((p) => p.char === "E");
  const getLabel = (p) =>
    p === start ? "START" : p === finish ? "FINISH" : p.key.replace(";", "_");

  const maze = data.reduce((result, next) => {
    next.links = [];
    next.label = getLabel(next);
    result[next.key] = next;
    return result;
  }, {});

  for (const point of Object.values(maze)) {
    dirs.forEach((dir) => {
      const targetKey = getKey(point.x + dir.dx, point.y + dir.dy);
      const target = maze[targetKey];
      if (target)
        point.links.push({
          target,
          dir,
          weight: 1,
        });
    });
  }

  function findFoldable() {
    return Object.values(maze).find(
      (p) =>
        p !== start &&
        p !== finish &&
        p.links.length === 2 &&
        (p.links.every((l) => l.dir.dx === 0) ||
          p.links.every((l) => l.dir.dy === 0))
    );
  }

  let next = findFoldable();
  do {
    const left = next.links[0].target;
    const right = next.links[1].target;
    const weight = next.links.reduce((a, b) => a + b.weight, 0);
    left.links = [
      ...left.links.filter((l) => l.target !== next),
      {
        target: right,
        weight,
        dir: left.links.find((l) => l.target === next).dir,
      },
    ];
    right.links = [
      ...right.links.filter((l) => l.target !== next),
      {
        target: left,
        weight,
        dir: right.links.find((l) => l.target === next).dir,
      },
    ];
    delete maze[next.key];
  } while ((next = findFoldable()));

  // https://mermaid.live/
  // console.log("flowchart TD");
  // Object.values(maze).forEach((p) => {
  //   p.links.forEach((l) => {
  //     console.log(`  ${p.label} --> |${l.weight}| ${l.target.label}`);
  //   });
  // });

  function findCheapestPath() {
    let dir = dirs.find((d) => d.key === "east");
    let edges = [{ target: start, dir, cost: 0 }];
    const seen = new Set();
    while (edges.length > 0) {
      let newEdges = [];
      const cheapestCost = Math.min(...edges.map((e) => e.cost));

      // console.log("Considering cheapest cost", cheapestCost);
      // console.log(edges);

      for (const edge of edges) {
        if (edge.cost > cheapestCost) {
          newEdges.push(edge);
          continue;
        }

        if (edge.target === finish) return edge.cost;

        const key = edge.target.key;
        if (seen.has(key)) continue;

        seen.add(key);

        // Continue in current direction
        const simpleNextStep = edge.target.links.find(
          (l) => l.dir === edge.dir
        );
        if (simpleNextStep) {
          newEdges.push({
            target: simpleNextStep.target,
            cost: edge.cost + simpleNextStep.weight,
            dir: edge.dir,
          });
        }

        // Steps that require 90deg turn
        edge.target.links
          .filter((l) => l !== simpleNextStep && l.target !== edge.target)
          .forEach((step) => {
            // console.log("Turning at", key, "towards", step.target.key)
            newEdges.push({
              target: step.target,
              cost: edge.cost + step.weight + 1000,
              dir: step.dir,
            });
          });
      }
      edges = newEdges;
    }

    throw "No solution found!";
  }

  return findCheapestPath();
}

function part2(data) {
  const start = data.find((p) => p.char === "S");
  const finish = data.find((p) => p.char === "E");
  const getLabel = (p) =>
    p === start ? "START" : p === finish ? "FINISH" : p.key.replace(";", "_");

  const maze = data.reduce((result, next) => {
    next.links = [];
    next.label = getLabel(next);
    result[next.key] = next;
    return result;
  }, {});

  for (const point of Object.values(maze)) {
    dirs.forEach((dir) => {
      const targetKey = getKey(point.x + dir.dx, point.y + dir.dy);
      const target = maze[targetKey];
      if (target)
        point.links.push({
          target,
          dir,
          weight: 1,
          coords: new Set([target.key]),
        });
    });
  }

  function findFoldable() {
    return Object.values(maze).find(
      (p) =>
        p !== start &&
        p !== finish &&
        p.links.length === 2 &&
        (p.links.every((l) => l.dir.dx === 0) ||
          p.links.every((l) => l.dir.dy === 0))
    );
  }

  let next = findFoldable();
  do {
    const left = next.links[0].target;
    const right = next.links[1].target;
    const weight = next.links.reduce((a, b) => a + b.weight, 0);
    left.links = [
      ...left.links.filter((l) => l.target !== next),
      {
        target: right,
        weight,
        dir: left.links.find((l) => l.target === next).dir,
        coords: new Set(),
      },
    ];
    left.links.forEach((foo) => {
      foo.coords.add(next.key);
      next.links.forEach((l) => l.coords.forEach((c) => foo.coords.add(c)));
    });

    right.links = [
      ...right.links.filter((l) => l.target !== next),
      {
        target: left,
        weight,
        dir: right.links.find((l) => l.target === next).dir,
        coords: new Set(),
      },
    ];
    right.links.forEach((foo) => {
      foo.coords.add(next.key);
      next.links.forEach((l) => l.coords.forEach((c) => foo.coords.add(c)));
    });
    delete maze[next.key];
  } while ((next = findFoldable()));

  // https://mermaid.live/
  // console.log("flowchart TD");
  // Object.values(maze).forEach((p) => {
  //   p.links.forEach((l) => {
  //     console.log(`  ${p.label} --> |${l.weight}| ${l.target.label}`);
  //   });
  // });

  function print(coords) {
    const maxx = [...coords]
      .map((c) => parseInt(c.split(";")[0]))
      .reduce((a, b) => Math.max(a, b), 0);
    const maxy = [...coords]
      .map((c) => parseInt(c.split(";")[1]))
      .reduce((a, b) => Math.max(a, b), 0);
    for (let y = 0; y <= maxy + 1; y++) {
      let line = "";
      for (let x = 0; x <= maxx + 1; x++) {
        line += coords.has(`${x};${y}`) ? "O" : ".";
      }
      console.log(line);
    }
    console.log();
  }

  function isOpposite(a, b) {
    if (a.key === "east") return b.key === "west";
    if (a.key === "west") return b.key === "east";
    if (a.key === "north") return b.key === "south";
    if (a.key === "south") return b.key === "north";
    throw "Unknown dirs";
  }

  function findCheapestPath() {
    let dir = dirs.find((d) => d.key === "east");
    let edges = [{ target: start, dir, cost: 0, visitedLinks: new Set() }];
    const seen = new Set();
    const bestRoutes = new Set();
    let optimalCost = Infinity;
    let i = 0;
    while (edges.length > 0) {
      i++;
      let newEdges = [];
      const cheapestCost = Math.min(...edges.map((e) => e.cost));

      // console.log("\n" + i);

      for (const edge of edges) {
        // console.log(
        //   edge.cost.toString().padStart(5, " "),
        //   "=> " + start.key + " -",
        //   [...edge.visitedLinks]
        //     .map((v) => v.target.key)
        //     .reverse()
        //     .join(" - ")
        // );
        if (edge.cost > optimalCost) {
          continue;
        }

        if (edge.cost > cheapestCost) {
          newEdges.push(edge);
          continue;
        }

        if (edge.target === finish) {
          // console.log(edges.map((e) => `${e.target.key} cost ${e.cost}`));
          optimalCost = edge.cost;
          console.log(edge.cost);
          print(
            new Set([...edge.visitedLinks].map((v) => [...v.coords]).flat())
          );
          edge.visitedLinks.forEach((v) =>
            v.coords.forEach((c) => bestRoutes.add(c))
          );
        }

        const key = `${edge.target.key}+${edge.dir.key}`;
        // console.log(" ".repeat(i) + "Checking", key, "at cost", edge.cost, "seen = ", seen.has(key));
        if (seen.has(key)) continue;
        seen.add(key);

        // Continue in current direction
        const linkThatIsStraightOn = edge.target.links.find(
          (l) => l.dir === edge.dir
        );
        if (linkThatIsStraightOn) {
          newEdges.push({
            target: linkThatIsStraightOn.target,
            cost: edge.cost + linkThatIsStraightOn.weight,
            dir: edge.dir,
            visitedLinks: new Set([linkThatIsStraightOn, ...edge.visitedLinks]),
          });
        }

        // Steps that require 90deg turn
        edge.target.links
          .filter(
            (l) =>
              l !== linkThatIsStraightOn &&
              l.target !== edge.target &&
              !isOpposite(edge.dir, l.dir)
          )
          .forEach((link) => {
            newEdges.push({
              target: link.target,
              cost: edge.cost + link.weight + 1000,
              dir: link.dir,
              visitedLinks: new Set([link, ...edge.visitedLinks]),
            });
          });
      }
      edges = newEdges;
    }

    if (optimalCost === Infinity) throw "No solution found";

    bestRoutes.add(start.key);
    bestRoutes.add(finish.key);

    return bestRoutes.size;
  }

  return findCheapestPath();
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .map((line, y) =>
      line
        .trim()
        .split("")
        .map((char, x) => ({
          key: getKey(x, y),
          x,
          y,
          char,
        }))
    )
    .flat()
    .filter((p) => p.char !== "#");
}

describe(`day${day}`, async () => {
  const exampleSimple1 = `
#####
#..E#
#.###
#.###
#S.##
#####
  `;

  const exampleSimple2 = `
######
#...##
#.#..#
#S##E#
#.#..#
#...##
######
  `;

  const exampleSimple3 = `
########
#.....E#
##.#.###
##.#.###
#....###
#S######
########
  `;

  const example1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
  `;

  const example2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  // it("should solve part 1 (example, simplified 001)", () => {
  //   const result = part1(parseInput(exampleSimple1));
  //   console.log(`Day ${day}, part 1 (example, simplified 001):`, result);
  //   expect(result).toBe(2005);
  // });

  // it("should solve part 1 (example 1)", () => {
  //   const result = part1(parseInput(example1));
  //   console.log(`Day ${day}, part 1 (example 1):`, result);
  //   expect(result).toBe(7036);
  // });

  // it("should solve part 1 (example 2)", () => {
  //   const result = part1(parseInput(example2));
  //   console.log(`Day ${day}, part 1 (example 2):`, result);
  //   expect(result).toBe(11048);
  // });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(95476);
  // });

  // it("should solve part 2 (example, simplified 001)", () => {
  //   const result = part2(parseInput(exampleSimple1));
  //   console.log(`Day ${day}, part 2 (example, simplified 001):`, result);
  //   expect(result).toBe(6);
  // });

  // it("should solve part 2 (example, simplified 002)", () => {
  //   const result = part2(parseInput(exampleSimple2));
  //   console.log(`Day ${day}, part 2 (example, simplified 002):`, result);
  //   expect(result).toBe(14);
  // });

  // it("should solve part 2 (example, simplified 003)", () => {
  //   const result = part2(parseInput(exampleSimple3));
  //   console.log(`Day ${day}, part 2 (example, simplified 003):`, result);
  //   expect(result).toBe(14);
  // });

  it("should solve part 2 (example 1)", () => {
    const result = part2(parseInput(example1));
    console.log(`Day ${day}, part 2 (example 1):`, result);
    expect(result).toBe(45);
  });

  // it("should solve part 2 (example 2)", () => {
  //   const result = part2(parseInput(example2));
  //   console.log(`Day ${day}, part 2 (example 2):`, result);
  //   expect(result).toBe(64);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});
