function toInt(bits) {
    return parseInt(bits.join(""), 2)
}

class Packet {
    full = []

    version = []
    type = []
    groups = [[]]
    lengthType = []
    length = []

    children = []
    done = false

    constructor(bits = []) {
        for (let bit of bits) {
            this.pushBit(bit)
        }
    }

    pushBit(bit) {
        if (this.version.length < 3) {
            this.version.push(bit)
            return this.full.push(bit)
        }

        if (this.type.length < 3) {
            this.type.push(bit)
            return this.full.push(bit)
        }

        if (this.isLiteral()) {
            if (this.groups.last.length < 5) {
                this.groups.last.push(bit)
                return this.full.push(bit)
            }

            if (this.groups.last[0]) {
                this.groups.push([bit])
                return this.full.push(bit)
            }
        } else {
            if (this.children.length == 0) {
                this.children.push(new Packet())
            }

            if (this.lengthType.length < 1) {
                this.lengthType.push(bit)
                return this.full.push(bit)
            }

            if (!this.lengthType[0]) {
                if (this.length.length < 15) {
                    this.length.push(bit)
                    return this.full.push(bit)
                }

                if (this.children.map((e) => e.full.length).sum() < toInt(this.length)) {
                    this.children.last.pushBit(bit)

                    if (this.children.last.done) {
                        this.children.push(new Packet([bit]))
                    }

                    return this.full.push(bit)
                }
            } else {
                if (this.length.length < 11) {
                    this.length.push(bit)
                    return this.full.push(bit)
                }

                if (!this.children.last.done) {
                    this.children.last.pushBit(bit)

                    if (this.children.last.done) {
                        if (this.children.length < toInt(this.length)) {
                            this.children.push(new Packet([bit]))
                            return this.full.push(bit)
                        }
                    } else {
                        return this.full.push(bit)
                    }
                }
            }
        }

        this.done = true
    }

    isLiteral() {
        return toInt(this.type) == 4
    }

    getLiteralValue() {
        return toInt(this.groups.flatMap((e) => e.slice(1)))
    }

    getVersionSum() {
        return toInt(this.version) + this.children.map((e) => e.getVersionSum()).sum()
    }

    getValue() {
        if (this.isLiteral()) {
            return this.getLiteralValue()
        } else {
            let operands = this.children.map((e) => e.getValue())

            switch (toInt(this.type)) {
                case 0:
                    return operands.sum()

                case 1:
                    return operands.prod()

                case 2:
                    return operands.min()

                case 3:
                    return operands.max()

                case 5:
                    return +(operands[0] > operands[1])

                case 6:
                    return +(operands[0] < operands[1])

                case 7:
                    return +(operands[0] == operands[1])
            }
        }
    }
}

function day16(input, part2) {
    let bits = input.split("").flatMap((e) => parseInt(e, 16).toString(2).padStart(4, "0").split("").num())
    return new Packet(bits)[part2 ? "getValue" : "getVersionSum"]()
}

if (typeof window == "undefined") {
    module.exports = day16
}
