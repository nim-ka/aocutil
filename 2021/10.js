const opens = ["(", "[", "{", "<"]
const closes = [")", "]", "}", ">"]
const scores1 = { ")": 3, "]": 57, "}": 1197, ">": 25137 }
const scores2 = { ")": 1, "]": 2, "}": 3, ">": 4 }

function day10(input, part2) {
    let results = input.split("\n").map((str) => {
        let stack = []

        for (let i = 0; i < str.length; i++) {
            let char = str[i]

            if (opens.includes(char)) {
                stack.push(closes[opens.indexOf(char)])
            } else if (char != stack.pop()) {
                return scores1[char]
            }
        }

        return stack.reverse()
    })

    if (!part2) {
        return results.filter((e) => !Array.isArray(e)).sum()
    } else {
        return results.filter((e) => Array.isArray(e)).map((e) => e.reduce((a, b) => a * 5 + scores2[b], 0)).medianNumeric()
    }
}
