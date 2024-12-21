import { describe, it, expect } from "bun:test";

const day = "21";

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function getMoveFor(from, to) {
  if (to.x - from.x === -1) return "<";
  if (to.x - from.x === +1) return ">";
  if (to.y - from.y === -1) return "^";
  if (to.y - from.y === +1) return "v";
  throw "Unexpected move wanted";
}

const createPad = (input) => {
  const pad = input
    .split(/\r?\n/g)
    .map((line, y) =>
      line.split("").map((char, x) => ({
        char,
        x,
        y,
        links: [],
        paths: {},
      }))
    )
    .flat()
    .filter((x) => !!x.char.trim());

  pad.forEach((p) => {
    p.links = pad
      .filter((p2) => 1 === Math.abs(p2.x - p.x) + Math.abs(p2.y - p.y))
      .map((p2) => ({
        target: p2,
        move: getMoveFor(p, p2),
      }));
  });

  function findPathsTo(goal, current, visited = []) {
    if (current === goal) return ["A"];

    const baseDistance = distance(goal, current);

    return current.links
      .filter((n) => !visited.includes(n.target.char))
      .filter((n) => distance(n.target, goal) < baseDistance)
      .map((n) =>
        findPathsTo(goal, n.target, [...visited, n.char]).map(
          (path) => n.move + path
        )
      )
      .flat();
  }

  pad.forEach((pSource) => {
    pad.forEach((pTarget) => {
      if (pSource === pTarget) return;
      pSource.paths[pTarget.char] = findPathsTo(pTarget, pSource, [
        pSource.char,
      ]);
    });
  });

  // console.log(numpad[0]);

  return pad;
};

function part1(data) {
  const numpad = createPad("789\n456\n123\n 0A");
  const dirpad1 = createPad(" ^A\n<v>");
  const dirpad2 = createPad(" ^A\n<v>");

  const numPosition = "A";
  const dirpad1Position = "A";
  const dirpad2Position = "A";

  return 0;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input.trim().split(/\r?\n/g);
}

describe(`day${day}`, async () => {
  const example1 = `
029A
980A
179A
456A
379A
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(126384);
  });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(0);
  // });

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
