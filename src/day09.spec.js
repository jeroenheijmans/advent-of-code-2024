import { describe, it, expect } from "bun:test";

const day = "09";

function part1(data) {
  const diskmap = [];
  for (let i = 0, idBefore = 0; i < data.length; i += 2, idBefore++) {
    const fileDigit = parseInt(data[i]);
    const freeDigit = parseInt(data[i + 1]);
    const file = { digit: fileDigit, idBefore };
    diskmap.push(...Array(fileDigit).fill(file));
    if (freeDigit) diskmap.push(...Array(freeDigit).fill(null));
  }

  // console.log(diskmap.map(x => x !== null ? x.idBefore : ".").join(""));

  const length = diskmap.length;
  let start = 0;
  let end = length - 1;
  while (true) {
    while (diskmap[start] !== null) start++;
    while (diskmap[end] === null) end--;

    if (start >= end) break;

    diskmap[start] = diskmap[end];
    diskmap[end] = null;
  }

  return diskmap
    .filter((x) => !!x)
    .map((item, index) => item.idBefore * index)
    .reduce((a, b) => a + b, 0);
}

function part2(data) {
  const diskmap = [];
  const allFiles = [];
  for (let i = 0, idBefore = 0; i < data.length; i += 2, idBefore++) {
    const fileDigit = parseInt(data[i]);
    const freeDigit = parseInt(data[i + 1]);
    const file = { digit: fileDigit, idBefore };
    allFiles.push(file);
    diskmap.push(...Array(fileDigit).fill(file));
    if (freeDigit) diskmap.push(...Array(freeDigit).fill(null));
  }

  const filesToConsider = allFiles.toSorted((a,b) => b.idBefore - a.idBefore);

  const length = diskmap.length;
  let end = length - 1;
  filesToConsider.forEach(file =>  {
    // console.log(diskmap.map(x => x !== null ? x.idBefore : ".").join(""), "  ---  ", file.idBefore, " : ", file.digit);

    const fileIndex = diskmap.indexOf(file);

    let candidateStartIndex = null;
    let candidateLength = 0;
    for (let i = 0; i < fileIndex; i++) {
      if (diskmap[i] === null) {
        if (candidateStartIndex === null) {
          candidateStartIndex = i;
          candidateLength = 1;
        }
        else {
          candidateLength++;
        }
      } else {
        if (candidateLength >= file.digit) break;
        candidateStartIndex = null;
        candidateLength = null;
      }
    }

    if (candidateStartIndex !== null && candidateLength >= file.digit) {
      // console.log("Moving!", file.idBefore)
      for (let i = 0; i < file.digit; i++) {
        diskmap[candidateStartIndex + i] = file;
        diskmap[fileIndex + i] = null;
      }
    }
  });
  
  // console.log(diskmap.map(x => x !== null ? x.idBefore : ".").join(""));

  return diskmap
    .map((item, index) => (item?.idBefore || 0) * index)
    .reduce((a, b) => a + b, 0);
}

function parseInput(input) {
  return input.trim().split("");
}

describe(`day${day}`, async () => {
  const example = `2333133121414131402`;

  const input = await Bun.file(`src/day${day}.txt`).text();

  // it("should solve part 1 (example)", () => {
  //   const result = part1(parseInput(example));
  //   console.log(`Day ${day}, part 1 (example):`, result);
  //   expect(result).toBe(1928);
  // });

  // it("should solve part 1", () => {
  //   const result = part1(parseInput(input));
  //   console.log(`Day ${day}, part 1:`, result);
  //   expect(result).toBe(6398608069280);
  // });

  it("should solve part 2 (example)", () => {
    const result = part2(parseInput(example));
    console.log(`Day ${day}, part 2 (example):`, result);
    expect(result).toBe(2858);
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe(6427437134372);
  });
});
