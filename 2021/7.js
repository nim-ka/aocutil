function day7(input, part2) {
    let crabs = input.split(",").num()

    let max = crabs.max()
    let costs = []

    for (let i = 0; i < max; i++) {
        costs[i] = crabs.map((e) => {
            let dist = Math.abs(e - i)
            return part2 ? dist * (dist + 1) / 2 : dist
        }).sum()
    }

    return costs.min()
}

if (typeof window == "undefined") {
    module.exports = day7
}
