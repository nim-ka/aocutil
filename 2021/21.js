// turn: 0-1; 1 bit (0 = player 1; 1 = player 2)
// pos1: 1-10; 4 bits
// pos2: 1-10; 4 bits
// score1: 0-1009; 10 bits
// score2: 0-1009; 10 bits
const sizeS = 10
const sizeP = 4
const sizeT = 1

const maskS = (1 << sizeS) - 1
const maskP = (1 << sizeP) - 1
const maskT = (1 << sizeT) - 1

const offsetS2 = 0
const offsetS1 = offsetS2 + sizeS
const offsetP2 = offsetS1 + sizeS
const offsetP1 = offsetP2 + sizeP
const offsetT = offsetP1 + sizeP

function encodeState(turn, pos1, pos2, score1, score2) {
    return (score2 << offsetS2) |
        (score1 << offsetS1) |
        (pos2 << offsetP2) |
        (pos1 << offsetP1) |
        (turn << offsetT)
}

function getScore(state, player) {
    return state >> (player ? offsetS2 : offsetS1) & maskS
}

function advState(state, roll, win) {
    let turn = state >> offsetT

    let offsetPos = turn ? offsetP2 : offsetP1
    let offsetScore = turn ? offsetS2 : offsetS1

    let pos = (state >> offsetPos) & maskP
    let score = (state >> offsetScore) & maskS

    pos = (((pos + roll) - 1) % 10) + 1
    score += pos

    if (score >= win) {
        return turn
    }

    state &= ~(maskP << offsetPos)
    state |= pos << offsetPos

    state &= ~(maskS << offsetScore)
    state |= score << offsetScore

    state ^= 1 << offsetT

    return state
}

const rollCombos = [1, 2, 3].cartProduct([1, 2, 3]).cartProduct([1, 2, 3]).map((e) => e.flat().sum())

function day21(input, part2) {
    let lines = input.split("\n")

    let pos1 = +lines[0].split(" ").last
    let pos2 = +lines[1].split(" ").last

    let state = encodeState(0, pos1, pos2, 0, 0)

    if (!part2) {
        const win = 1000

        let die = 0
        let rolls = 0

        while (getScore(state, 0) < win && getScore(state, 1) < win) {
            let roll = ++die
            die %= 100
            roll += ++die
            die %= 100
            roll += ++die
            die %= 100

            rolls += 3

            newState = advState(state, roll, win)

            if (newState == 0 || newState == 1) {
                return getScore(state, 1 - newState) * rolls
            }

            state = newState
        }
    } else {
        let universes = {}
        universes[state] = 1

        let wins = [0, 0]

        while (true) {
            let universesLeft = false

            for (let state in universes) {
                if (!universes[state]) {
                    continue
                }

                universesLeft = true

                state = +state

                for (let roll of rollCombos) {
                    let newState = advState(state, roll, 21)

                    if (newState == 0 || newState == 1) {
                        wins[newState] += universes[state]
                    } else {
                        universes[newState] = (universes[newState] || 0) + universes[state]
                    }
                }

                delete universes[state]
            }

            if (!universesLeft) {
                break
            }
        }

        return wins.max()
    }
}

if (typeof window == "undefined") {
    module.exports = day21
}
