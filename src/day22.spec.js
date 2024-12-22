import { describe, it, expect, test } from "bun:test";

const day = "22";

function generateNextSecret(secret) {
  secret = (secret * 64) ^ secret; // *64 + mix
  secret = secret % 16777216; // prune

  secret = Math.floor(secret / 32) ^ secret; // /32 + mix
  secret = secret % 16777216; // prune

  secret = (secret * 2048) ^ secret; // *2048 + mix
  secret = secret % 16777216; // prune

  return secret;
}

function generateNthSecret(secret, iterations = 2000) {
  for (let i = 0; i < iterations; i++) {
    secret = generateNextSecret(secret);
  }
  return secret;
}

function part1(data) {
  console.log(data);
  return data.length;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((x) => parseInt(x));
}

describe(`day${day}`, async () => {
  const example1 = `
1
10
100
2024
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  test.each([
    [123, 15887950],
    [15887950, 16495136],
    [16495136, 527345],
    // [527345, 704524],
    // [704524, 1553684],
    // [1553684, 12683156],
    // [12683156, 11100544],
    // [11100544, 12249484],
    // [12249484, 7753432],
    // [7753432, 5908254],
  ])("should turn %p into %p", (input, expected) => {
    const result = generateNextSecret(input);
    expect(result).toBe(expected);
  });

  // test.each([
  //     [1, 8685429],
  //     [10, 4700978],
  //     [100, 15273692],
  //     [2024, 8667524],
  // ])("should turn %p into %p after 2000 iterations", (input, expected) => {
  //   const result = generateNthSecret(input, 2000);
  //   expect(result).toBe(expected);
  // });

  // it("should solve part 1 (example 1)", () => {
  //   const result = part1(parseInput(example1));
  //   console.log(`Day ${day}, part 1 (example 1):`, result);
  //   expect(result).toBe(37327623);
  // });

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
