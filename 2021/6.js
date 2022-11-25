function day6(input, part2) {
    let fish = input.split(",").num()
    let counts = Array(9).fill().map((_, i) => fish.count(i))

    for (let i = 0; i < (part2 ? 256 : 80); i++) {
        counts.push(counts.shift())
        counts[6] += counts[8]
    }

    return counts.sum()
}

if (typeof window == "undefined") {
    module.exports = day6
}
