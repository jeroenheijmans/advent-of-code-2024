import { describe, it, expect, test } from "bun:test";

const day = "22";

function generateNextSecret(secret) {
  secret = (secret * 64n) ^ secret; // *64 + mix
  secret = secret % 16777216n; // prune

  secret = (secret / 32n) ^ secret; // /32 + mix
  secret = secret % 16777216n; // prune

  secret = (secret * 2048n) ^ secret; // *2048 + mix
  secret = secret % 16777216n; // prune

  return secret;
}

function generateNthSecret(secret, iterations = 2000) {
  for (let i = 0; i < iterations; i++) {
    secret = generateNextSecret(secret);
  }
  return secret;
}

function part1(data) {
  return Number(data.reduce((acc, next) => acc + generateNthSecret(next, 2000), 0n));
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((x) => BigInt(x));
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
    [123n, 15887950n],
    [15887950n, 16495136n],
    [16495136n, 527345n],
    [527345n, 704524n],
    [704524n, 1553684n],
    [1553684n, 12683156n],
    [12683156n, 11100544n],
    [11100544n, 12249484n],
    [12249484n, 7753432n],
    [7753432n, 5908254n],
  ])("should turn %p into %p", (input, expected) => {
    const result = generateNextSecret(input);
    expect(result).toBe(expected);
  });

  test.each([
      [1n, 8685429n],
      [10n, 4700978n],
      [100n, 15273692n],
      [2024n, 8667524n],
  ])("should turn %p into %p after 2000 iterations", (input, expected) => {
    const result = generateNthSecret(input, 2000);
    expect(result).toBe(expected);
  });

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(37327623);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(20332089158);
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
