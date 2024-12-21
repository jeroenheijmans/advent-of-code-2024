import { describe, it, expect } from "bun:test";

const day = "21";

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getMoveFor = (from, to) => {
  if (to.x - from.x === -1) return "<";
  if (to.x - from.x === +1) return ">";
  if (to.y - from.y === -1) return "^";
  if (to.y - from.y === +1) return "v";
  throw "Unexpected move wanted";
};

const charChanges = (str) => {
  if (str.length < 2) return;
  let changes = 0;
  for (let i = 1; i < str.length; i++) {
    if (str[i] !== str[i - 1]) changes++;
  }
  return changes;
};

const order = ["^", ">", "v", "<"]; // preference order

const pathSorter = (left, right) => {
  // Part 1: prefer sequences that repeat chars often
  const one = charChanges(left);
  const two = charChanges(right);
  if (one !== two) return one - two;

  // Part 2: prefer certain characters in order
  for (let i = 0; i < left.length; i++) {
    const a = order.indexOf(left[i]);
    const b = order.indexOf(right[i]);
    if (a !== b) return b - a;
  }

  // Otherwise: considered equal
  return 0;
};

const createPad = (input) => {
  const pad = input
    .split(/\r?\n/g)
    .map((line, y) =>
      line.split("").map((char, x) => ({
        char,
        x,
        y,
        links: [],
        bestPath: {},
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
      pSource.bestPath[pTarget.char] = findPathsTo(pTarget, pSource, [
        pSource.char,
      ]).toSorted(pathSorter)[0];
    });
  });

  return pad;
};

function part1(data) {
  const numpad = createPad("789\n456\n123\n 0A");
  const dirpad = createPad(" ^A\n<v>");

  let currentDir1Position = dirpad.find((p) => p.char === "A");
  let currentDir2Position = dirpad.find((p) => p.char === "A");
  let currentNumpadPosition = numpad.find((p) => p.char === "A");

  let result = 0;

  for (const code of data) {
    let count = 0;

    for (const targetChar of code) {
      if (targetChar === currentNumpadPosition.char) {
        count++;
        continue;
      }

      const path1 = currentNumpadPosition.bestPath[targetChar];

      for (const dir1Target of path1) {
        if (dir1Target === currentDir1Position.char) {
          count++;
          continue;
        }

        const path2 = currentDir1Position.bestPath[dir1Target];

        for (const dir2Target of path2) {
          if (dir2Target === currentDir2Position.char) {
            count++;
            continue;
          }

          count += currentDir2Position.bestPath[dir2Target].length;
          currentDir2Position = dirpad.find((p) => p.char === dir2Target);
        }

        currentDir1Position = dirpad.find((p) => p.char === dir1Target);
      }

      currentNumpadPosition = numpad.find((p) => p.char === targetChar);
    }

    result += count * parseInt(code.substring(0, 3));
  }

  return result;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((line) => !line.startsWith("// "));
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

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBeLessThan(136294);
    expect(result).toBe(125742);
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
