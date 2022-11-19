function day14(input, part2) {
    input = input.split("\n").splitOnElement("")

    let init = input[0][0].split("")
    let rules = input[1].map((e) => e.split(" -> "))

    let counts = {}

    for (let i = 0; i < init.length - 1; i++) {
        let substr = init[i] + init[i + 1]
        counts[substr] = (counts[substr] || 0) + 1
    }

    for (let i = 0; i < (part2 ? 40 : 10); i++) {
        let changes = {}

        for (let rule of rules) {
            let target = rule[0][0] + rule[0][1]
            let left = rule[0][0] + rule[1]
            let right = rule[1] + rule[0][1]

            changes[left] = (changes[left] || 0) + (counts[target] || 0)
            changes[right] = (changes[right] || 0) + (counts[target] || 0)
            changes[target] = (changes[target] || 0) - (counts[target] || 0)
        }

        for (let pair in changes) {
            counts[pair] = (counts[pair] || 0) + changes[pair]
        }
    }

    counts = Object.keys(counts).map((key) => [key.split(""), counts[key]])

    let letters = counts.flatMap((e) => e[0]).uniq().map((letter) => (counts.filter((e) => e[0].includes(letter)).map((e) => e[0].count(letter) * e[1]).sum() + (letter == init[0] || letter == init[init.length - 1])) / 2)

    return letters.max() - letters.min()
}

if (typeof window == "undefined") {
    module.exports = day14
}
