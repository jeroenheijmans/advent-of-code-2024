import { describe, it, expect } from "bun:test";

const day = "23";

function part1(data) {
  const nodes = [...new Set(data.flat().toSorted())].map((key) => ({ key }));

  nodes.forEach((node) => {
    node.links = nodes.filter((other) =>
      data.some(
        (connection) =>
          connection.includes(node.key) &&
          connection.includes(other.key) &&
          node !== other
      )
    );
  });

  const groups = new Set();

  nodes
    .filter((n1) => n1.key.startsWith("t"))
    .forEach((n1) => {
      n1.links.forEach((n2) => {
        n2.links
          .filter((n3) => n1.links.includes(n3))
          .forEach((n3) => {
            groups.add([n1.key, n2.key, n3.key].sort().join(","));
          });
      });
    });

  return groups.size;
}

function combinations(array, n) {
  if (n === 0) return [[]];
  if (array.length === 0) return [];
  const [first, ...rest] = array;

  const withFirst = combinations(rest, n - 1).map(combo => [first, ...combo]);
  const withoutFirst = combinations(rest, n);

  return [...withFirst, ...withoutFirst];
}

function part2(data) {
  const nodes = [...new Set(data.flat().toSorted())].map((key) => ({ key }));

  nodes.forEach((node) => {
    node.links = nodes
      .filter((other) =>
        data.some(
          (connection) =>
            node !== other &&
            connection.includes(node.key) &&
            connection.includes(other.key)
        )
      )
      .map((n) => n.key);
  });

  const map = Object.fromEntries(nodes.map((n) => [n.key, n]));

  const max = Math.max(...nodes.map(n => n.links.length));
  const seen = new Set();

  for (let i = max; i > 0; i--) {
    // console.log(i);
    for (const node of nodes) {
      const options = combinations(node.links, i);
      for (const combi of options) {
        const option = [node.key, ...combi].toSorted();
        const result = option.join(",");
        if (seen.has(result)) continue;
        seen.add(result);
        if (option.every(key => 
          option.every(otherKey => otherKey === key || map[otherKey].links.includes(key))
        )) {
          return result;
        }
      }
    }
  }

}

function parseInput(input) {
  return input
    .trim()
    .split(/\r?\n/g)
    .filter((x) => !!x)
    .map((line) => line.split("-"));
}

describe(`day${day}`, async () => {
  const example1 = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(7);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(1075);
  });

  it("should solve part 2 (example 1)", () => {
    const result = part2(parseInput(example1));
    console.log(`Day ${day}, part 2 (example 1):`, result);
    expect(result).toBe("co,de,ka,ta");
  });

  it("should solve part 2", () => {
    const result = part2(parseInput(input));
    console.log(`Day ${day}, part 2:`, result);
    expect(result).toBe("az,cg,ei,hz,jc,km,kt,mv,sv,sx,wc,wq,xy");
  });
});
