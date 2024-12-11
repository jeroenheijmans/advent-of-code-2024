import { describe, it, expect } from "bun:test";

const day = "11";

function part1(data) {
  data.forEach((item, i) => {
    if (i  > 0) item.left = data[i - 1];
    if (i < data.length - 1) item.right = data[i + 1];
  });

  let start = data[0];
  let current = start;

  const concat = item => `${item.value} ${item.right ? concat(item.right) : ""}`;

  let i = 0;
  while (i++ < 25) {
    do {
      const next = current.right;
      if (current.value === 0) current.value = 1;
      else {
        const str = current.value.toString(); 
        if (str.length % 2 === 0) {
          const newStone = {
            left: current,
            right: current.right,
            value: parseInt(str.substring(str.length / 2)),
          };
          current.right = newStone;
          current.left = current.left;
          current.value = parseInt(str.substring(0, str.length / 2));
        } else {
          current.value *= 2024;
        }
      }
      current = next;
    } while (current);

    // console.log(concat(start));

    current = start;
  }

  i = 0;
  current = start;
  while (current) {
    i++;
    current = current.right;
  }
  return i;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  return input
    .trim()
    .split(/\s+/g)
    .map(n => ({
      left: null,
      right: null,
      value: parseInt(n),
    }));
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
