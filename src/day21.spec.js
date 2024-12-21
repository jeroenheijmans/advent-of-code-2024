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

function charChanges(str) {
  if (str.length < 2) return;
  let changes = 0;
  for (let i = 1; i < str.length; i++) {
    if (str[i] !== str[i-1]) changes++;
  }
  return changes;
}

const order = ["^", ">", "v", "<"];

const pathSorter = (left, right) => {
  const one = charChanges(left);
  const two = charChanges(right);
  if (one !== two) return one - two;

  for (let i = 0; i < left.length; i++) {
    const a = order.indexOf(left[i]);
    const b = order.indexOf(right[i]);
    if (a !== b) return b - a;
  }

  return 0;
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
      ]).toSorted(pathSorter);
    });
  });

  // console.log(numpad[0]);

  return pad;
};

function part1(data) {
  const numpad = createPad("789\n456\n123\n 0A");
  const dirpad1 = createPad(" ^A\n<v>");
  const dirpad2 = createPad(" ^A\n<v>");

  let currentDir1Position = dirpad1.find(p => p.char === "A");
  let currentDir2Position = dirpad2.find(p => p.char === "A");
  let currentNumpadPosition = numpad.find(p => p.char === "A");

  let result = 0;
  
  for (const code of data) {
    console.log("Tackling code", code);
    let count = 0;

    for (const targetChar of code) {
      // console.log("  numpad target:", targetChar);
      if (targetChar === currentNumpadPosition.char) {
        count++;
        continue;
      }

      const possiblePaths1 = currentNumpadPosition.paths[targetChar];
      const path1 = possiblePaths1[0]; // BIG GUESS! Just pick any path, should be fine?

      for (const dir1Target of path1) {
        // console.log("    dirpad1 target:", dir1Target);
        if (dir1Target === currentDir1Position.char) {
          count++;
          continue;
        }

        const possiblePaths2 = currentDir1Position.paths[dir1Target];
        const path2 = possiblePaths2[0]; // BIG GUESS! Just pick any path, should be fine?

        for (const dir2Target of path2) {
          // console.log("      dirpad2 target:", dir2Target);
          if (dir2Target === currentDir2Position.char) {
            count++;
            continue;
          }
          
          const possiblePaths3 = currentDir2Position.paths[dir2Target];
          const path3 = possiblePaths3[0]; // BIG GUESS! Just pick any path, should be fine?

          count += path3.length;
          currentDir2Position = dirpad2.find(p => p.char === dir2Target);
        }

        currentDir1Position = dirpad1.find(p => p.char === dir1Target);
      }

      currentNumpadPosition = numpad.find(p => p.char === targetChar);
    }

    const codeValue = parseInt(code.substring(0, 3));
    console.log("  ", count, "x", codeValue, "=", count * codeValue);
    result += count * codeValue;
  }

  return result;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input.trim().split(/\r?\n/g).filter(line => !line.startsWith("// "));
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
