// TODO: not very efficient because i was lazy

function day12(input, part2) {
    let cxns = input.split("\n").map((line) => line.split("-"))
    let dict = {}

    for (let cxn of cxns) {
        dict[cxn[0]] = [...(dict[cxn[0]] || []), cxn[1]]
        dict[cxn[1]] = [...(dict[cxn[1]] || []), cxn[0]]
    }

    let count = 0
    let paths = [["start"]]

    while (paths.length) {
        let newPaths = []

        for (let path of paths) {
            for (let next of dict[path.last]) {
                if (next == "start") {
                    continue
                }

                let newPath = [...path, next]

                if (newPath.count((e, i, a) => e == e.toLowerCase() && a.indexOf(e) != i) > part2) {
                    continue
                }

                if (next == "end") {
                    count++
                } else {
                    newPaths.push(newPath)
                }
            }
        }

        paths = newPaths
    }

    return count
}

if (typeof window == "undefined") {
    module.exports = day12
}
