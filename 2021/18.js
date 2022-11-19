class SnailfishNumber {
    static fromArr(arr, parent = null, isRight) {
        let num = new SnailfishNumber()
        return num.initialize(
            arr[0] instanceof Array ? SnailfishNumber.fromArr(arr[0], num, false) : arr[0],
            arr[1] instanceof Array ? SnailfishNumber.fromArr(arr[1], num, true) : arr[1],
            parent, isRight)
    }

    initialize(left, right, parent, isRight) {
        this.left = left
        this.right = right
        this.parent = parent
        this.isRight = isRight
        return this
    }

    explode(depth = 0) {
        if (this.left instanceof SnailfishNumber) {
            if (this.left.explode(depth + 1)) {
                return true
            }
        }
        
        if (this.right instanceof SnailfishNumber) {
            if (this.right.explode(depth + 1)) {
                return true
            }
        }
        
        if (!(this.left instanceof SnailfishNumber) && !(this.right instanceof SnailfishNumber) && depth >= 4) {
            let lastNode = this
            let node = this.parent

            while (node && node.left == lastNode) {
                lastNode = node
                node = node.parent
            }

            if (node) {
                if (!(node.left instanceof SnailfishNumber)) {
                    node.left += this.left
                } else {
                    node = node.left

                    while (node.right instanceof SnailfishNumber) {
                        node = node.right
                    }

                    node.right += this.left
                }
            }

            lastNode = this
            node = this.parent

            while (node && node.right == lastNode) {
                lastNode = node
                node = node.parent
            }

            if (node) {
                if (!(node.right instanceof SnailfishNumber)) {
                    node.right += this.right
                } else {
                    node = node.right

                    while (node.left instanceof SnailfishNumber) {
                        node = node.left
                    }

                    node.left += this.right
                }
            }

            if (!this.isRight) {
                this.parent.left = 0
            } else {
                this.parent.right = 0
            }

            return true
        }

        return false
    }

    split() {
        if (this.left instanceof SnailfishNumber) {
            if (this.left.split()) {
                return true
            }
        } else if (this.left >= 10) {
            this.left = SnailfishNumber.fromArr([Math.floor(this.left / 2), Math.ceil(this.left / 2)], this, false)
            return true
        }

        if (this.right instanceof SnailfishNumber) {
            if (this.right.split()) {
                return true
            }
        } else if (this.right >= 10) {
            this.right = SnailfishNumber.fromArr([Math.floor(this.right / 2), Math.ceil(this.right / 2)], this, true)
            return true
        }

        return false
    }

    reduce() {
        while (this.explode() || this.split());
        return this
    }

    add(that) {
        let parent = SnailfishNumber.fromArr([this, that])
        this.parent = parent
        this.isRight = false
        that.parent = parent
        that.isRight = true
        return parent.reduce()
    }

    magnitude() {
        return 3 * (this.left instanceof SnailfishNumber ? this.left.magnitude() : this.left) +
            2 * (this.right instanceof SnailfishNumber ? this.right.magnitude() : this.right)
    }

    toString() {
        return "[" + this.left.toString() + "," + this.right.toString() + "]"
    }
}

function day18(input, part2) {
    let lines = input.split("\n")

    if (!part2) {
        let nums = lines.map((line) => SnailfishNumber.fromArr(JSON.parse(line)))
        return nums.reduce((a, b) => a.add(b)).magnitude()
    } else {
        let pairs = lines.flatMap((e) => lines.filter((f) => e != f).map((f) => [e, f].map((e) => SnailfishNumber.fromArr(JSON.parse(e)))))
        return pairs.map((e) => e[0].add(e[1]).magnitude()).max()
    }
}
