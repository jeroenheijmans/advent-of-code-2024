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

function part1(data, dirPadDepth = 1) {
  const numpad = createPad("789\n456\n123\n 0A");
  const dirpad = createPad(" ^A\n<v>");

  let currentNumpadPosition = numpad.find((p) => p.char === "A");
  let currentDirPositions = {};
  let memoizedResults = {};
  for (let i = 0; i <= 25; i++) {
    currentDirPositions[i] = dirpad.find((p) => p.char === "A");
    memoizedResults[i] = {};
  }

  let result = 0;

  function countRecursive(path, depth) {
    let count = 0;

    if (depth === 0) {
      for (const dirTarget of path) {
        if (dirTarget === currentDirPositions[depth].char) {
          count++;
          continue;
        }

        count += currentDirPositions[depth].bestPath[dirTarget].length;
        currentDirPositions[depth] = dirpad.find((p) => p.char === dirTarget);
      }

      return count;
    }

    for (const dirTarget of path) {
      if (dirTarget === currentDirPositions[depth].char) {
        count++;
        continue;
      }

      const deeperPath = currentDirPositions[depth].bestPath[dirTarget];

      if (!memoizedResults[depth][deeperPath]) {
        memoizedResults[depth][deeperPath] = countRecursive(deeperPath, depth - 1);
      }

      count += memoizedResults[depth][deeperPath];

      currentDirPositions[depth] = dirpad.find((p) => p.char === dirTarget);
    }

    return count;
  }

  for (const code of data) {
    let count = 0;

    for (const targetChar of code) {
      if (targetChar === currentNumpadPosition.char) {
        count++;
        continue;
      }

      const path1 = currentNumpadPosition.bestPath[targetChar];

      count += countRecursive(path1, dirPadDepth);

      currentNumpadPosition = numpad.find((p) => p.char === targetChar);
    }

    result += count * parseInt(code.substring(0, 3));
  }

  return result;
}

function part2(data) {
  return part1(data, 23);
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

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(0);
  });
});
