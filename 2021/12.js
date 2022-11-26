// this one used to be a lot shorter but i made it less shoddy and slow at expense of line count
function day12(input, part2) {
    let cxns = input.split("\n").map((line) => line.split("-"))

    let caves = []
    let startId

    for (let cxn of cxns) {
        let ids = []

        for (let i = 0; i < 2; i++) {
            let cave = caves.find((e) => e.name == cxn[i])

            if (!cave) {
                caves.push(cave = {
                    name: cxn[i],
                    id: caves.length,
                    isStart: cxn[i] == "start",
                    isEnd: cxn[i] == "end",
                    isSmall: cxn[i] == cxn[i].toLowerCase(),
                    cxns: new Set()
                })

                if (cave.isStart) {
                    startId = cave.id
                }
            }

            ids.push(cave.id)
        }

        caves[ids[0]].cxns.add(ids[1])
        caves[ids[1]].cxns.add(ids[0])
    }

    let count = 0
    let paths = [{
        cur: startId,
        smallVisited: new Set(),
        visitedSmallTwice: false
    }]

    let i = 0

    while (paths.length) {
        let newPaths = []

        for (let path of paths) {
            for (let nextId of caves[path.cur].cxns) {
                let next = caves[nextId]

                if (next.isStart) {
                    continue
                }

                if (next.isEnd) {
                    count++
                    continue
                }

                let visitedSmallTwice = path.visitedSmallTwice

                if (next.isSmall && path.smallVisited.has(nextId)) {
                    if (part2 && !visitedSmallTwice) {
                        visitedSmallTwice = true
                    } else {
                        continue
                    }
                }

                newPaths.push({
                    cur: nextId,
                    smallVisited: new Set(path.smallVisited).add(nextId),
                    visitedSmallTwice: visitedSmallTwice
                })
            }
        }

        paths = newPaths
    }

    return count
}

if (typeof window == "undefined") {
    module.exports = day12
}
