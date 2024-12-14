import { describe, it, expect } from "bun:test";

const day = "14";

function part1(data, maxx = 101, maxy = 103, iterations = 100) {
  const middleX = Math.floor(maxx / 2);
  const middleY = Math.floor(maxy / 2);

  const quadrantCounts = [0,0,0,0];

  data.forEach(robot => {
    robot.x = (robot.x + (robot.vx * iterations) + (maxx * iterations)) % maxx;
    robot.y = (robot.y + (robot.vy * iterations) + (maxy * iterations)) % maxy;

    if (robot.x < middleX && robot.y < middleY) quadrantCounts[0]++;
    if (robot.x > middleX && robot.y < middleY) quadrantCounts[1]++;
    if (robot.x < middleX && robot.y > middleY) quadrantCounts[2]++;
    if (robot.x > middleX && robot.y > middleY) quadrantCounts[3]++;
  });

  return quadrantCounts.reduce((a,b) => a * b, 1);
}

function part2(data, maxx = 101, maxy = 103) {

  for (let i = 0; i < 20000; i++) {
    data.forEach(robot => {
      robot.x = (robot.x + robot.vx + maxx) % maxx;
      robot.y = (robot.y + robot.vy + maxy) % maxy;
    });
    
    for (let y = 0; y < maxy; y++) {
      let line = "";
      for (let x = 0; x < maxx; x++) {
        line += data.find(r => r.x === x && r.y === y) ? "#" : ".";
      }
      console.log(line);
    }
    console.log();
  }

  return 1;
}
function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .map((line) => line.replace(/[pv=]/g, "").split(/[,\s]/g))
    .map((parts) => ({
      x: parseInt(parts[0]),
      y: parseInt(parts[1]),
      vx: parseInt(parts[2]),
      vy: parseInt(parts[3]),
    }));
}

describe(`day${day}`, async () => {
  const example1 = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example)", () => {
    const result = part1(parseInput(example1), 11, 7);
    console.log(`Day ${day}, part 1 (example):`, result);
    expect(result).toBe(12);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(216027840);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(0);
  });
});
