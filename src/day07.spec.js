import { describe, it, expect } from "bun:test";

const day = "07";

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const combine = (a, b) => parseInt(`${a}${b}`);

function hasSolution(ops, target, current, parts) {
  if (parts.length === 0) return target === current;
  if (current > target) return false;
  const [head, ...tail] = parts;
  return ops.some((op) => hasSolution(ops, target, op(current, head), tail));
}

function part1(data) {
  const ops = [add, multiply];
  return data
    .map(({ result, parts }) => {
      const [head, ...tail] = parts;
      return hasSolution(ops, result, head, tail) ? result : 0;
    })
    .reduce((a, b) => a + b, 0);
}

function part2(data) {
  const ops = [add, multiply, combine];
  return data
    .map(({ result, parts }) => {
      const [head, ...tail] = parts;
      return hasSolution(ops, result, head, tail)
        ? result
        : 0;
    })
    .reduce((a, b) => a + b, 0);
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((x) => x.split(": "))
    .map(([result, rest]) => ({
      result: parseInt(result),
      parts: rest.split(/\s+/g).map((n) => parseInt(n)),
    }));
}

describe(`day${day}`, async () => {
  const example = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(3749);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(1430271835320);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(11387);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(456565678667482);
  });
});
