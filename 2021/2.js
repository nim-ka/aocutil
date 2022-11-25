function day2(input, part2) {
    let x = 0
    let y = 0
    let a = 0

    for (let line of input.split("\n")) {
        if (!part2) {
            eval(line.replace("forward", "x +=")
                .replace("up", "y -=")
                .replace("down", "y +="))
        } else {
            eval(line.replace(/forward (.+)/, "x += $1; y += a * $1")
                .replace("up", "a -=")
                .replace("down", "a +="))
        }
    }

    return x * y
}

if (typeof window == "undefined") {
    module.exports = day2
}
