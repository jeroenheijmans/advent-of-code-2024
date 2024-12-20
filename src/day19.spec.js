import { describe, it, expect } from "bun:test";

const day = "19";

function part1({patterns, designs}) {

  const possibles = new Set([""]);
  const impossibles = new Set();

  function isPossible(design) {
    if (possibles.has(design)) return true;
    if (impossibles.has(design)) return false;

    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        const rest = design.substring(pattern.length);
        if (isPossible(rest)) {
          possibles.add(design);
          return true;
        }
      }
    }
    impossibles.add(design);
    return false;
  }

  return designs.filter(d => isPossible(d)).length;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  const [patterns, designs] = input
    .trim()
    .split(/\r?\n\r?\n/g);
  
  return {
    patterns: patterns.split(", "),
    designs: designs.split(/\r?\n/g),
  };
}

describe(`day${day}`, async () => {
  const example1 = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(6);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(302);
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