const statesArr = []
const stateIdxs = {}

function encodeState(arr) {
    let key = arr.join("")

    if (!(key in stateIdxs)) {
        stateIdxs[key] = statesArr.push(arr) - 1
    }

    return stateIdxs[key]
}

function decodeState(num) {
    return statesArr[num]
}

// 0 is hallway, 1 is A room, 2 is B room, etc
function getRoom(pos) {
    if (pos < 11) {
        return 0
    }

    return ((pos - 11) % 4) + 1
}

let hallwayStops = [0, 1, 3, 5, 7, 9, 10]
let roomPoses = []

function possibleStates(num) {
    let state = decodeState(num)

    let newStates = []

    for (let pos = 0; pos < state.length; pos++) {
        let amphipod = state[pos]

        if (!amphipod) {
            continue
        }

        let curRoom = getRoom(pos)

        let roomEntrance = 2 * curRoom
        let destRoomEntrance = 2 * amphipod

        let curRoomPoses = roomPoses[getRoom(pos)]
        let destRoomPoses = roomPoses[amphipod]

        let depthInRoom = curRoomPoses?.indexOf(pos)

        if (curRoom == amphipod && curRoomPoses.slice(depthInRoom).every((e) => state[e] == amphipod)) {
            continue
        }

        let dests = []

        let destRoomAvailable = destRoomPoses.every((pos) => state[pos] == 0 || state[pos] == amphipod)

        let steps = 0
        let hallwayPos

        if (curRoom != 0) {
            if (curRoomPoses.slice(0, depthInRoom).some((pos) => state[pos] != 0)) {
                continue
            }

            destRoomAvailable &&= roomEntrance != destRoomEntrance

            steps = depthInRoom + 1
            hallwayPos = roomEntrance
        } else {
            hallwayPos = pos
        }

        let destRoomSteps = -1

        let leftPath = hallwayStops.filter((pos) => pos < hallwayPos).reverse()
        let rightPath = hallwayStops.filter((pos) => pos > hallwayPos)

        let leftBlock = leftPath.findIndex((pos) => state[pos] != 0)
        let rightBlock = rightPath.findIndex((pos) => state[pos] != 0)

        let leftDests = (leftBlock > -1 ? leftPath.slice(0, leftBlock) : leftPath)
            .map((pos) => [pos, steps + hallwayPos - pos])
        let rightDests = (rightBlock > -1 ? rightPath.slice(0, rightBlock) : rightPath)
            .map((pos) => [pos, steps + pos - hallwayPos])

        if (curRoom != 0) {
            dests.push(...leftDests, ...rightDests)
        }

        if (destRoomAvailable) {
            destRoomSteps =
                [...leftDests, [hallwayPos, steps]].find((e) => e[0] == destRoomEntrance + 1)?.[1] ??
                [...rightDests, [hallwayPos, steps]].find((e) => e[0] == destRoomEntrance - 1)?.[1] ?? -1
        }

        if (destRoomSteps > -1) {
            let destRoomBlock = destRoomPoses.findIndex((pos) => state[pos] != 0)
            let destPosIdx = (destRoomBlock > -1 ? destRoomBlock : destRoomPoses.length) - 1
            dests.push([destRoomPoses[destPosIdx], destRoomSteps + 2 + destPosIdx])
        }

        newStates.push(...dests.map((e) => {
            let newState = state.copy()

            newState[pos] = 0
            newState[e[0]] = amphipod

            return { state: encodeState(newState), energy: e[1] * [1, 10, 100, 1000][amphipod - 1] }
        }))
    }

    return newStates
}

function isSolved(num) {
    let state = decodeState(num)
    return roomPoses.every((poses, i) => poses.every((pos) => state[pos] == i))
}

function day23(input, part2) {
    let lines = input.split("\n")

    if (part2) {
        lines.splice(3, 0, "  #D#C#B#A#", "  #D#B#A#C#")
    }

    for (let i = 1; i <= 4; i++) {
        roomPoses[i] = Array(part2 ? 4 : 2).fill().map((_, j) => 10 + j * 4 + i)
    }

    let state = encodeState(lines.join("").replace(/[# ]/g, "")
        .replaceAll(".", 0)
        .replaceAll("A", 1)
        .replaceAll("B", 2)
        .replaceAll("C", 3)
        .replaceAll("D", 4).split("").num())

    let energies = {}
    energies[state] = 0

    let stateHeap = new BinHeap((state1, state2) => state1.totalEnergy < state2.totalEnergy)
    stateHeap.insert({ state: state, totalEnergy: 0 })

    for (let i = 0; ; i++) {
        let top = stateHeap.extract()

        if (isSolved(top.state)) {
            return top.totalEnergy
        }

        for (let res of possibleStates(top.state)) {
            let energy = top.totalEnergy + res.energy

            if (res.state in energies) {
                let idx = stateHeap.data.findIndex((e) => e.state == res.state)
                if (idx > -1 && energy < stateHeap.data[idx].totalEnergy) {
                    stateHeap.data[idx].totalEnergy = energy
                    stateHeap.up(idx)
                }
            } else {
                energies[res.state] = energy
                stateHeap.insert({ state: res.state, totalEnergy: energy })
            }
        }

        if (i % 10000 == 0) {
            console.log("iteration", i, "heap size", stateHeap.data.length, "min energy", top.totalEnergy)
        }
    }
}

if (typeof window == "undefined") {
    module.exports = day23
}
