import { describe, it, expect } from "bun:test";

const day = "24";

function part1({ gates, rules }) {
  const map = Object.fromEntries(gates.map(({ key, val }) => [key, val]));
  const unevaluated = rules.filter((r) => !map.hasOwnProperty(r.target));

  while (unevaluated.length > 0) {
    const rule = unevaluated.find((r) => r.args.every((a) => map.hasOwnProperty(a)));
    
    switch (rule.operator) {
      case "AND":
        map[rule.target] = map[rule.args[0]] && map[rule.args[1]];
        break;
      case "OR":
        map[rule.target] = map[rule.args[0]] || map[rule.args[1]];
        break;
      case "XOR":
        map[rule.target] = map[rule.args[0]] ^ map[rule.args[1]];
        break;
      default:
        throw "Unknown operator";
    }
    unevaluated.splice(unevaluated.indexOf(rule), 1);
  }
  
  const bits = Object.keys(map)
    .filter((k) => k.startsWith("z"))
    .toSorted()
    .toReversed()
    .map(k => map[k] ? "1" : "0")
    .join("");
  
  return parseInt(bits, 2);
}

function part2(data) {
  return data.length;
}

function parseInput(input) {
  const [section1, section2] = input.trim().split(/\r?\n\r?\n/g);

  return {
    gates: section1
      .split(/\r?\n/g)
      .map((x) => x.split(": "))
      .map(([key, n]) => ({ key, val: parseInt(n) === 1 ? true : false })),
    rules: section2
      .split(/\r?\n/g)
      .map((x) => x.split(" -> "))
      .map(([lhs, rhs]) => ({
        lhs: lhs.split(" "),
        rhs,
      }))
      .map(({ lhs, rhs }) => ({
        args: [lhs[0], lhs[2]],
        operator: lhs[1],
        target: rhs,
      })),
  };
}

describe(`day${day}`, async () => {
  const example1 = `
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02
  `;
  const example2 = `
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
  `;

  const input = await Bun.file(`src/day${day}.txt`).text();

  it("should solve part 1 (example 1)", () => {
    const result = part1(parseInput(example1));
    console.log(`Day ${day}, part 1 (example 1):`, result);
    expect(result).toBe(4);
  });

  it("should solve part 1 (example 2)", () => {
    const result = part1(parseInput(example2));
    console.log(`Day ${day}, part 1 (example 2):`, result);
    expect(result).toBe(2024);
  });

  it("should solve part 1", () => {
    const result = part1(parseInput(input));
    console.log(`Day ${day}, part 1:`, result);
    expect(result).toBe(55920211035878);
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
