import { describe, it, expect } from "bun:test";

const day = "11";

function solve(data, iterations = 25) {
  const splitUpMap = { 0: ["1"] };

  let currentMap = data.reduce((result, next) => {
    result[next] = (result[next] || 0) + 1;
    return result;
  }, {});

  for (let i = 0; i++ < iterations; ) {
    const newMap = {};

    for (const [key, value] of Object.entries(currentMap)) {
      if (!splitUpMap[key]) {
        if (key.length % 2 === 0) {
          splitUpMap[key] = [
            `${parseInt(key.substring(0, key.length / 2))}`,
            `${parseInt(key.substring(key.length / 2))}`,
          ];
        } else {
          splitUpMap[key] = [`${2024 * parseInt(key)}`];
        }
      }
      splitUpMap[key].forEach((n) => {
        newMap[n] = (newMap[n] || 0) + value;
      });
    }

    currentMap = newMap;
  }

  return Object.values(currentMap).reduce((a, b) => a + b, 0);
}

function part1(data) {
  return solve(data);
}

function part2(data) {
  return solve(data, 75);
}

function parseInput(input) {
  return input.trim().split(/\s+/g);
}

describe(`day${day}`, async () => {
  const example = `125 17`;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(55312);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(216042);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(65601038650482);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(255758646442399);
  });
});
