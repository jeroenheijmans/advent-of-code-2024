import { describe, it, expect } from "bun:test";

const day = "15";

const getKey = (x, y) => `${x};${y}`;

function part1({ maze, instructions }) {
  const maxx = Math.max(...maze.map((p) => p.x));
  const maxy = Math.max(...maze.map((p) => p.y));

  const map = maze.reduce((result, next) => {
    result[next.key] = next;
    return result;
  }, {});

  const robot = maze.find((p) => p.char === "@");
  let { x, y } = robot;
  robot.char = ".";

  const dirs = {
    "<": { dx: -1, dy: 0 },
    v: { dx: 0, dy: +1 },
    ">": { dx: +1, dy: 0 },
    "^": { dx: 0, dy: -1 },
  };

  function drawMap(op) {
    console.log(`Move ${op}:`);
    for (let drawY = 0; drawY <= maxy; drawY++) {
      let line = "";
      for (let drawX = 0; drawX <= maxx; drawX++) {
        line +=
          x === drawX && y === drawY ? "@" : map[getKey(drawX, drawY)].char;
      }
      console.log(line);
    }
    console.log();
  }

  function canPushOn(fromX, fromY, dir) {
    const key = getKey(fromX + dir.dx, fromY + dir.dy);
    const target = map[key];
    if (target.char === "#") return false;
    if (target.char === "O") return canPushOn(target.x, target.y, dir);
    else return true;
  }

  function pushOn(fromX, fromY, dir) {
    const key = getKey(fromX, fromY);
    const target = map[key];
    // console.log(`Pushing at ${fromX}, ${fromY} into ${target.char}`);
    if (target.char === ".") {
      target.char = "O";
    } else {
      pushOn(fromX + dir.dx, fromY + dir.dy, dir);
    }
  }

  for (const op of instructions) {
    const dir = dirs[op];
    const target = map[getKey(x + dir.dx, y + dir.dy)];

    if (target.char === "#") {
      continue;
    }

    if (canPushOn(x, y, dir)) {
      x = x + dir.dx;
      y = y + dir.dy;
      pushOn(x, y, dir);
      target.char = ".";
    }

    // drawMap(op);
  }

  return maze
    .filter((p) => p.char === "O")
    .map((p) => 100 * p.y + p.x)
    .reduce((a, b) => a + b, 0);
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  const [maze, instructions] = input.trim().split(/\r?\n\r?\n/g);

  return {
    maze: maze
      .split(/\r?\n/g)
      .map((line, y) =>
        line.split("").map((char, x) => ({
          key: getKey(x, y),
          x,
          y,
          char,
        }))
      )
      .flat(),
    instructions: instructions.replace(/\r?\n/g, "").split(""),
  };
}

describe(`day${day}`, async () => {
  const exampleBig = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;
  const exampleSmall = `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example - small)", () => {
    const result = part1(parseInput(exampleSmall));
    console.log(`Day ${day}, part 1 (example - small):`, result);
    expect(result).toBe(2028);
  });

  it("should solve part 1 (example - big)", () => {
    const result = part1(parseInput(exampleBig));
    console.log(`Day ${day}, part 1 (example - big):`, result);
    expect(result).toBe(10092);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(1563092);
  });

  // it("should solve part 2 (example)", () => {
  //   const result = part2(parseInput(example1));
  //   console.log(`Day ${day}, part 2 (example):`, result);
  //   expect(result).toBe(0);
  // });

  // it("should solve part 2", () => {
  //   const result = part2(parseInput(input));
  //   console.log(`Day ${day}, part 2:`, result);
  //   expect(result).toBe(0);
  // });
});
