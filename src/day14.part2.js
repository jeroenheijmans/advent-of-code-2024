const day = "14";

async function part2(data, maxx = 101, maxy = 103) {
  process.stdout.write("\x1b[2J");
  const middleY = 50;
  const half = data.length / 1.5;

  for (let i = 0; i < 20000000; i++) {
    if (i % 1e5 === 0) console.log(i);
    data.forEach((robot) => {
      robot.x = (robot.x + robot.vx + maxx) % maxx;
      robot.y = (robot.y + robot.vy + maxy) % maxy;
    });

    if (data.filter(r => r.y > middleY).length < half) continue;

    let output = "";
    for (let y = 0; y < maxy; y++) {
      for (let x = 0; x < maxx; x++) {
        output += data.find((r) => r.x === x && r.y === y) ? "▓" : " ";
      }
      output += "\n";
    }

    output += `i = ${i}\n`;
    process.stdout.write("\x1b[2J\x1b[H");
    process.stdout.write(output);
    await new Promise(res => process.stdin.once("data", res));
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

const input = await Bun.file(`src/day${day}.txt`).text();
const result = await part2(parseInput(input));
