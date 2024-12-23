import { describe, it, expect } from "bun:test";

const day = "13";

function part1(data) {
  // Technically it would be faster to call "part2" here, but
  // for fun let's leave the dumb imperative solution up here.

  function findLowestCostFor(machine) {
    const { prize, buttonA, buttonB } = machine;
    for (let a = 0; a < 100; a++) {
      for (let b = 0; b < 100; b++) {
        const cost = b + 3 * a;
        const x = buttonA.x * a + buttonB.x * b;
        const y = buttonA.y * a + buttonB.y * b;
        if (prize.x === x && prize.y === y) return cost;
      }
    }
    return 0;
  }

  return data.reduce((acc, m) => acc + findLowestCostFor(m), 0);
}

function part2(data) {
  const epsilon = 0.001;

  function findLowestCostFor(machine) {
    const { prize, buttonA, buttonB } = machine;

    // From the pen & paper solution, two parts in my equation:
    const part1 = prize.y / buttonA.y - prize.x / buttonA.x;
    const part2 = buttonB.y / buttonA.y - buttonB.x / buttonA.x;

    // Solve 'b' first as the cheapest one:
    const b = part1 / part2;

    // Work backwards to also solve 'a':
    const a = (prize.x - b * buttonB.x) / buttonA.x;

    // console.log(`Button A: ${JSON.stringify(buttonA)} ==> ${a}`);
    // console.log(`Button B: ${JSON.stringify(buttonB)} ==> ${b}`);
    // console.log(`Prize: ${JSON.stringify(prize)}`);
    // console.log();

    const aDiff = Math.abs(Math.round(a) - a);
    const bDiff = Math.abs(Math.round(b) - b);

    if (aDiff < epsilon && bDiff < epsilon) return b + 3 * a;

    return 0;
  }

  return data.reduce((acc, m) => acc + findLowestCostFor(m), 0);
}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n\r?\n/g)
    .map((group) => group.split(/\r?\n/g))
    .map(([buttonA, buttonB, prize]) => ({
      buttonA: {
        x: parseInt(buttonA.match(/X\+(\d+)/)[1]),
        y: parseInt(buttonA.match(/Y\+(\d+)/)[1]),
      },
      buttonB: {
        x: parseInt(buttonB.match(/X\+(\d+)/)[1]),
        y: parseInt(buttonB.match(/Y\+(\d+)/)[1]),
      },
      prize: {
        x: parseInt(prize.match(/X=(\d+)/)[1]),
        y: parseInt(prize.match(/Y=(\d+)/)[1]),
      },
    }));
}

describe(`day${day}`, async () => {
  const example1 = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(480);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(35729);
  });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example1));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(480);
  });

  it("should solve part 2 (with part 1 data)", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2 (with part 1 data):`, result);
    expect(result).toBe(35729);
  });

  it("should solve part 2", () => {
    const part2Input = parseInput(input).map((machine) => ({
      ...machine,
      prize: {
        x: machine.prize.x + 10000000000000,
        y: machine.prize.y + 10000000000000,
      },
    }));
    const result = part2(part2Input);
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBeGreaterThan(46976148799239);
    expect(result).toBe(88584689879723);
  });
});
