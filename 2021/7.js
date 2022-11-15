function day7(input, part2) {
    input = input.split(",").num()

    let max = input.max()
    let costs = []

    for (let i = 0; i < max; i++) {
        costs[i] = input.map((e) => {
            let dist = Math.abs(e - i)
            return part2 ? dist * (dist + 1) / 2 : dist
        }).sum()
    }

    return costs.min()
}
