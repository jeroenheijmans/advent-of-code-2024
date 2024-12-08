import { describe, it, expect } from "bun:test";

const day = "08";

function part1(data) {
  const uniques = [...new Set(data.antennas.map((a) => a.char))];

  const antenodes = uniques
    .map((u) => data.antennas.filter((a) => a.char === u))
    .map((subset) => {
      const result = [];
      for (const a1 of subset) {
        for (const a2 of subset) {
          if (a1 === a2) continue;
          const dx = a1.x - a2.x;
          const dy = a1.y - a2.y;
          const x = a2.x - dx;
          const y = a2.y - dy;
          result.push({
            key: `${x};${y}`,
            x,
            y,
            char: a1.char,
          });
        }
      }
      return result;
    })
    .flat();

  // for (let y = 0; y < data.xLength; y++) {
  //   let line = "";
  //   for (let x = 0; x < data.xLength; x++) {
  //     const alt = data.antennas.find((ant) => ant.x === x && ant.y === y)?.char;
  //     line += antenodes.find((a) => a.x === x && a.y === y) ? "#" : alt || ".";
  //   }
  //   console.log(line);
  // }

  const keys = antenodes
    .filter(
      (a) => a.x >= 0 && a.x <= data.xLength && a.y >= 0 && a.y <= data.yLength
    )
    .map((a) => a.key);

  return new Set(keys).size;
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  const data = input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((line) => line.split(""));

  const antennas = data
    .map((line, y) => line.map((char, x) => ({ x, y, char })))
    .flat()
    .filter((a) => a.char !== ".")
    .map((a) => ({ key: `${a.x};${a.y}`, ...a }));

  return {
    antennas,
    xLength: data[0].length,
    yLength: data.length,
  };
}

describe(`day${day}`, async () => {
  const example = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example));
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(14);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(254);
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
