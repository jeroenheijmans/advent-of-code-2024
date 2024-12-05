import { describe, it, expect } from "bun:test";

const day = "05";

const add = (a, b) => a + b;

function areEqualArrays(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function part1(data) {
  function sorter(a, b) {
    if (data.rules.includes((r) => r[0] === a && r[1] === b)) return 1;
    if (data.rules.includes((r) => r[0] === b && r[1] === a)) return -1;
    return 0;
  }
  const sorted = data.orders.map((o) => o.toSorted());
  const correct = sorted.filter((o, index) =>
    areEqualArrays(o, data.orders[index])
  );
  console.log(sorted);
  return correct
    .map((o) => o[Math.ceil(o.length / 2)])
    .map((n) => parseInt(n))
    .reduce(add, 0);
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  const parts = input.trim().split(/\r?\n\r?\n/g);
  return {
    rules: parts[0].split(/\r?\n/g).map((y) => y.split("|")),
    orders: parts[1].split(/\r?\n/g).map((y) => y.split(",")),
  };
}

describe(`day${day}`, async () => {
  const example = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(0);
  });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(0);
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
