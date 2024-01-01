let graphStr = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`

let graphStr2 = `S: t u v z
E: 1 2 3 4
1: 2 3 4
2: 3 4 a
3: 4 m
4: n
a: b c d e l
b: c d e
c: d e r
d: e r
e: r
l: m n o p
m: n o p t
n: o p t
o: p
r: t u y z
u: v z
v: w x y z
w: x y z
x: y z
y: z`

let graphStr3 = `S: t u v z
E: 1
1: 4
2: 4 a
3: m
a: e l
b: c
c: d
d: e
e: r
l: q
m: n
n: t
o: p
r: z
v: o x
w: y z`

let graphStr4 = input
//graphStr4 = input.split("\n").map((e) => e.slice(1)).join("\n").rea("roadcaster", "bro") + "\nbut -> bro"

new CanvasController(1200, 800)
	.addElement(new GraphicalGraphController(Graph.fromStr(graphStr4, ": ", " ", true)))
	.start()