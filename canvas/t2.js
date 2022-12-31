BinHeap = class BinHeap {
	constructor(cond = (p, c) => p < c) {
		this.cond = cond
		this.data = []
	}

	getTop() { return this.data[0] }
	getParent(idx) { return idx / 2 | 0 }
	getChildLeft(idx) { return 2 * idx }
	getChildRight(idx) { return 2 * idx + 1 }

	insert(val) {
		this.up(this.data.push(val) - 1)
	}

	extract() {
		let res = this.data[0]

		if (this.data.length > 1) {
			this.data[0] = this.data.pop()
			this.down(0)
		} else {
			this.data = []
		}

		return res
	}

	up(idx) {
		while (this.getParent(idx) != idx && !this.cond(this.data[this.getParent(idx)], this.data[idx])) {
			let tmp = this.data[this.getParent(idx)]
			this.data[this.getParent(idx)] = this.data[idx]
			this.data[idx] = tmp
			idx = this.getParent(idx)
		}
	}

	down(idx) {
		let largest = idx
		let left = this.getChildLeft(idx)
		let right = this.getChildRight(idx)

		if (left < this.data.length && this.cond(this.data[left], this.data[largest])) {
			largest = left
		}

		if (right < this.data.length && this.cond(this.data[right], this.data[largest])) {
			largest = right
		}

		if (largest != idx) {
			let tmp = this.data[largest]
			this.data[largest] = this.data[idx]
			this.data[idx] = tmp

			this.down(largest)
		}
	}

	indexOf(el) {
		return this.data.indexOf(el)
	}

	findIndex(func) {
		return this.data.findIndex(func)
	}

	extractIdx(idx) {
		let oldVal = this.data[idx]

		if (this.data.length > 1) {
			this.update(idx, this.data.pop())
		} else if (idx == 0) {
			this.data = []
		}

		return oldVal
	}

	update(idx, newVal) {
		let oldVal = this.data[idx]
		this.data[idx] = newVal

		if (this.cond(oldVal, newVal)) {
			this.down(idx)
		} else {
			this.up(idx)
		}

		return oldVal
	}
}

Cxn = class Cxn {
	constructor(dest, weight = 1) {
		this.dest = dest
		this.weight = weight
	}
}

SearchData = class SearchData {
	constructor(id, dist = Infinity, last = undefined, custom = {}) {
		this.id = id
		this.dist = dist
		this.last = last
		this.custom = custom
	}

	get(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
		}

		return { dist: this.dist, last: this.last, custom: this.custom }
	}

	update(id, dist = Infinity, last = undefined, custom = {}) {
		if (this.id != id || this.dist > dist) {
			this.id = id
			this.dist = dist
			this.last = last
			this.custom = custom
			return true
		}

		return false
	}
}

Node = class Node {
	static GLOBAL_ID = 0
	static SUPPRESS_PRINTING = false

	constructor(val, name = "") {
		this.id = Node.GLOBAL_ID++
		this.val = val
		this.name = name
		this.cxns = []
		this.searchData = new SearchData()
	}

	addCxn(node, weight = 1) { this.cxns.push(new Cxn(node, weight)) }
	mapCxnsMut(func) { this.cxns = this.cxns.map(func) }
	filterCxnsMut(func) { this.cxns = this.cxns.filter(func) }
	getWeightTo(node) { return this.cxns.find((cxn) => cxn.dest == node)?.weight }

	unwrap() {
		let path = [this]

		while (path[0].searchData.last) {
			path.unshift(path[0].searchData.last)
		}

		return path
	}

	dijkstraTo(dest, addCxns, heapCond = (p, c, pdist, cdist) => pdist < cdist) {
		let isDest

		if (dest instanceof Node) {
			isDest = (node) => node == dest
		} else if (dest instanceof Array) {
			isDest = (node) => dest.includes(node)
		} else if (dest instanceof Function) {
			isDest = dest
		} else {
			console.error("Node.dijkstraTo: Unrecognized destination type")
		}

		let id = Symbol()

		let heap = new BinHeap((p, c) => {
			let pdist = p.searchData.get(id, Infinity, undefined, true).dist
			let cdist = c.searchData.get(id, Infinity, undefined, true).dist
			return heapCond(p, c, pdist, cdist)
		})

		heap.insert(this)

		if (!Node.SUPPRESS_PRINTING) {
			console.time("search")
		}

		let i = 0

		this.searchData.update(id, 0, undefined, true)

		while (heap.data.length) {
			let min = heap.extract()
			let minDist = min.searchData.get(id).dist

			if (isDest(min)) {
				if (!Node.SUPPRESS_PRINTING) {
					console.timeEnd("search")
				}

				min.searchData.get(id)
				return min
			}

			if (addCxns && min.cxns.length == 0) {
				addCxns(min)
			}

			min.cxns.forEach((cxn) => {
				let visited = cxn.dest.searchData.get(id, Infinity, undefined, false).custom
				let dist = minDist + cxn.weight

				if (cxn.dest.searchData.update(id, dist, min, true)) {
					if (visited) {
						heap.up(heap.data.indexOf(cxn.dest))
					} else {
						heap.insert(cxn.dest)
					}
				}
			})

			if (++i % 10000 == 0) {
				console.log(heap.data.length)
			}
		}

		if (!Node.SUPPRESS_PRINTING) {
			console.timeEnd("search")
			console.warn("Node.dijkstraTo: Could not find a path")
		}
	}

	createGfx(...args) {
		return this.gfx = new GraphicalNode(this, ...args)
	}
}

let rootName
let rootSeeking = false
let showVels = false

class Mouse {
	static EVT_TYPES = [
		"mousemove",
		"mouseenter",
		"mouseleave",
		"mouseup",
		"mousedown"
	]

	constructor(el) {
		this.x = 0
		this.y = 0

		this.down = false
		this.press = false

		for (let type of Mouse.EVT_TYPES) {
			el.addEventListener(type, this)
		}
	}

	handleEvent(evt) {
		if (Mouse.EVT_TYPES.includes(evt.type)) {
			this[evt.type](evt)
			evt.preventDefault()
		}
	}

	mousemove(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.press = false
	}

	mouseenter(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mouseleave(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mouseup(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = false
		this.press = false
	}

	mousedown(evt) {
		this.x = evt.offsetX
		this.y = evt.offsetY

		this.down = true
		this.press = true
	}
}

class CanvasElement {
	static HIGHLIGHT_COLOR = "rgb(0, 0, 200)"
	static STROKE_COLOR = "rgb(0, 0, 0)"
	static TEXT_COLOR = "rgb(0, 0, 0)"
	static FILL_COLOR = "rgb(255, 255, 255)"
	static HOVER_COLOR = "rgb(235, 235, 235)"
	static PRESS_COLOR = "rgb(235, 235, 235)"

	static TEXT_SIZE = 18

	constructor() {
		this.update(null)
	}

	setCtx(ctx) {
		this.ctx = ctx
	}

	isIn(x, y) {
		return false
	}

	update(mouse) {
		if (mouse && (this.press || this.isIn(mouse.x, mouse.y))) {
			this.hover = true

			this.mouseUpdate(mouse)

			if (mouse.press) {
				this.press = true
				this.mouseClick(mouse)
			} else if (!mouse.down && this.press) {
				this.press = false
				this.mouseRelease(mouse)
			}
		} else {
			this.hover = false
			this.press = false
			this.highlight = false
		}
	}

	mouseUpdate(mouse) {}
	mouseClick(mouse) {}
	mouseRelease(mouse) {}

	addToController(controller) {
		controller.addElement(this)
	}

	getStrokeColor() {
		return this.highlight ? this.constructor.HIGHLIGHT_COLOR : this.constructor.STROKE_COLOR
	}

	getTextColor() {
		return this.highlight ? this.constructor.HIGHLIGHT_COLOR : this.constructor.TEXT_COLOR
	}

	getFillColor() {
		return this.press ? this.constructor.PRESS_COLOR :
			this.hover ? this.constructor.HOVER_COLOR : this.constructor.FILL_COLOR
	}

	getTextSize() {
		return this.constructor.TEXT_SIZE
	}
}

class GraphicalNode extends CanvasElement {
	static FILL_COLOR = "rgba(0, 0, 0, 0)"
	static HOVER_COLOR = "rgba(0, 0, 0, 0.1)"
	static PRESS_COLOR = "rgba(0, 0, 0, 0.15)"

	static ARROW_SIZE = 10
	static ARROW_ANGLE = Math.PI / 8

	static DUAL_CXN_SEP_ANGLE = 0.2
	static WEIGHT_SEP_ANGLE = 0.5

	constructor(node, x, y, size) {
		super()

		this.node = node
		this.x = x
		this.y = y
		this.size = size

		this.vx = 0
		this.vy = 0

		this.ax = 0
		this.ay = 0

		this.dragOffsetX = 0
		this.dragOffsetY = 0

		this.mouseHistory = Array(10).fill({ x: 0, y: 0 })
	}

	isIn(x, y) {
		return Math.hypot(this.x - x, this.y - y) <= this.size
	}

	mouseUpdate(mouse) {
		if (this.press) {
			let oldMousePos = this.mouseHistory.shift()
			this.mouseHistory.push({ x: mouse.x, y: mouse.y })

			this.x = mouse.x + this.dragOffsetX
			this.y = mouse.y + this.dragOffsetY
			this.vx = (mouse.x - oldMousePos.x) / this.mouseHistory.length
			this.vy = (mouse.y - oldMousePos.y) / this.mouseHistory.length
		} else {
			this.mouseHistory.fill({ x: mouse.x, y: mouse.y })
		}
	}

	mouseClick(mouse) {
		this.dragOffsetX = this.x - mouse.x
		this.dragOffsetY = this.y - mouse.y
		this.vx = 0
		this.vy = 0
	}

	mouseRelease(mouse) {
		if (rootSeeking) {
			rootSeeking = false
			rootName = this.node.name
			updateNodePoses()
		}
	}

	draw() {
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.fillStyle = this.getFillColor()
		this.ctx.lineWidth = 1

		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.fill()

		if (showVels) {
			let size = Math.hypot(this.vx, this.vy) * 50
			let angle = Math.atan2(this.vy, this.vx)

			let x1 = this.x + this.size * Math.cos(angle)
			let y1 = this.y + this.size * Math.sin(angle)
			let x2 = x1 + size * Math.cos(angle)
			let y2 = y1 + size * Math.sin(angle)

			this.ctx.fillStyle = this.getStrokeColor()

			this.ctx.beginPath()
			this.ctx.moveTo(x1, y1)
			this.ctx.lineTo(x2, y2)
			this.ctx.stroke()

			size = Math.min(size / 2, GraphicalNode.ARROW_SIZE)

			let x3 = x2 - size * Math.cos(angle + GraphicalNode.ARROW_ANGLE)
			let y3 = y2 - size * Math.sin(angle + GraphicalNode.ARROW_ANGLE)
			let x4 = x2 - size * Math.cos(angle - GraphicalNode.ARROW_ANGLE)
			let y4 = y2 - size * Math.sin(angle - GraphicalNode.ARROW_ANGLE)

			this.ctx.beginPath()
			this.ctx.moveTo(x2, y2)
			this.ctx.lineTo(x3, y3)
			this.ctx.lineTo(x4, y4)
			this.ctx.closePath()
			this.ctx.fill()
		}

		this.ctx.fillStyle = this.getTextColor()
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = "middle"
		this.ctx.font = `${this.size}px monospace`
		this.ctx.fillText(this.node.val, this.x, this.y)

		this.ctx.textBaseline = "bottom"
		this.ctx.font = `${this.getTextSize()}px monospace`
		this.ctx.fillText(this.node.name, this.x, this.y - this.size)

		for (let cxn of this.node.cxns) {
			this.ctx.fillStyle = this.getStrokeColor()

			let that = cxn.dest.gfx

			let dist = Math.hypot(that.x - this.x, that.y - this.y)
			let angle = Math.atan2(that.y - this.y, that.x - this.x)

			let shift = that.node.cxns.some((e) => e.dest == this.node) ? GraphicalNode.DUAL_CXN_SEP_ANGLE : 0

			let x1 = this.x + this.size * Math.cos(angle + shift)
			let y1 = this.y + this.size * Math.sin(angle + shift)
			let x2 = that.x - that.size * Math.cos(angle - shift)
			let y2 = that.y - that.size * Math.sin(angle - shift)

			this.ctx.beginPath()
			this.ctx.moveTo(x1, y1)
			this.ctx.lineTo(x2, y2)
			this.ctx.stroke()

			let x3 = x2 - GraphicalNode.ARROW_SIZE * Math.cos(angle + GraphicalNode.ARROW_ANGLE)
			let y3 = y2 - GraphicalNode.ARROW_SIZE * Math.sin(angle + GraphicalNode.ARROW_ANGLE)
			let x4 = x2 - GraphicalNode.ARROW_SIZE * Math.cos(angle - GraphicalNode.ARROW_ANGLE)
			let y4 = y2 - GraphicalNode.ARROW_SIZE * Math.sin(angle - GraphicalNode.ARROW_ANGLE)

			this.ctx.beginPath()
			this.ctx.moveTo(x2, y2)
			this.ctx.lineTo(x3, y3)
			this.ctx.lineTo(x4, y4)
			this.ctx.closePath()
			this.ctx.fill()

			let push = (shift ? 1 : -1) * (shift + GraphicalNode.WEIGHT_SEP_ANGLE)

			let midX = (this.x + that.x) / 2
			let midY = (this.y + that.y) / 2

			midX += (this.size * Math.cos(angle + push) - that.size * Math.cos(angle - push)) / 2
			midY += (this.size * Math.sin(angle + push) - that.size * Math.sin(angle - push)) / 2

			this.ctx.textBaseline = "middle"
			this.ctx.fillText(cxn.weight, midX, midY)
		}
	}

	align() {
		let leftEdge = 0
		let rightEdge = this.ctx.canvas.width
		let topEdge = 0
		let bottomEdge = this.ctx.canvas.height

		let alignedX = false
		let alignedY = false

		if (this.x < leftEdge + this.size) {
			this.x = leftEdge + this.size
			alignedX = true
		}

		if (this.x > rightEdge - this.size) {
			this.x = rightEdge - this.size
			alignedX = true
		}

		if (this.y < topEdge + this.size) {
			this.y = topEdge + this.size
			alignedY = true
		}

		if (this.y > bottomEdge - this.size) {
			this.y = bottomEdge - this.size
			alignedY = true
		}

		return { alignedX, alignedY, aligned: alignedX || alignedY }
	}

	getMass() {
		return this.node.val + 10
	}

	applyForce(elements, calcForce) {
		for (let that of elements) {
			if (!(that instanceof GraphicalNode) || this == that) {
				continue
			}

			let dist = Math.hypot(that.x - this.x, that.y - this.y)
			let force = calcForce(this, that, dist)

			this.ax += force * (that.x - this.x) / dist / this.getMass()
			this.ay += force * (that.y - this.y) / dist / this.getMass()
		}
	}
}

class Button extends CanvasElement {
	constructor(x, y, width, height, label, callback) {
		super()

		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.label = label
		this.callback = callback.bind(this)
	}

	isIn(x, y) {
		return x >= this.x && x <= this.x + this.width &&
			y >= this.y && y <= this.y + this.height
	}

	mouseRelease(mouse) {
		this.callback()
	}

	draw() {
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.lineWidth = 1
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = "middle"
		this.ctx.font = `${this.getTextSize()}px monospace`

		this.ctx.fillStyle = this.getStrokeColor()
		this.ctx.beginPath()
		this.ctx.roundRect(this.x + 3, this.y + 3, this.width, this.height, 5)
		this.ctx.fill()
		this.ctx.stroke()

		let depression = this.press ? 2 : 0

		this.ctx.fillStyle = this.getFillColor()
		this.ctx.beginPath()
		this.ctx.roundRect(this.x + depression, this.y + depression, this.width, this.height, 5)
		this.ctx.fill()
		this.ctx.stroke()

		this.ctx.fillStyle = this.getTextColor()
		this.ctx.fillText(this.label, this.x + this.width / 2 + depression, this.y + this.height / 2 + depression)
	}
}

class CanvasController {
	static TARGET_FPS = 60

	constructor(width, height, updateCallback = () => {}) {
		this.width = width
		this.height = height
		this.updateCallback = updateCallback

		this.elements = []

		this.frameNum = 0
		this.frameTimes = []

		this.targetFps = CanvasController.TARGET_FPS
		this.fps = this.targetFps
		this.fpsSlope = 0

		this.reset()
	}

	clearElements() {
		this.elements = []
	}

	addElement(el) {
		el.setCtx(this.ctx)

		if (!this.elements.includes(el)) {
			this.elements.push(el)
		}

		return this
	}

	reset() {
		this.canvas = document.getElementById("canvas")

		if (this.canvas) {
			let newCanvas = this.canvas.cloneNode()
			this.canvas.replaceWith(newCanvas)
			this.canvas = newCanvas
		} else {
			this.canvas = document.createElement("canvas")
			this.canvas.id = "canvas"
			document.body.appendChild(this.canvas)
		}

		this.canvas.width = this.width
		this.canvas.height = this.height

		this.mouse = new Mouse(this.canvas)

		this.ctx = this.canvas.getContext("2d")

		for (let el of this.elements) {
			el.setCtx(this.ctx)
		}
	}

	update() {
		this.updateFps()

		for (let el of this.elements) {
			el.update(this.mouse)
		}

		this.updateCallback.call(this, this.elements)

		this.draw()
	}

	draw() {
		if (!this.canvas) {
			this.reset()
		}

		this.ctx.fillStyle = "rgb(255, 255, 255)"
		this.ctx.fillRect(0, 0, this.width, this.height)

		this.ctx.strokeStyle = "rgb(0, 0, 0)"
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(0, 0, this.width, this.height)

		for (let el of this.elements) {
			el.draw()
		}

		this.ctx.fillStyle = "rgb(0, 0, 0)"
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.fps.toPrecision(5), 5, 18)
		this.ctx.fillText(this.mouse.x + ", " + this.mouse.y, 5, 36)
	}

	updateFps() {
		this.frameNum++

		let oldTime = this.frameTimes[0]
		let time = performance.now()

		this.frameTimes.push(time)

		if (this.frameTimes.length > 30) {
			this.frameTimes.shift()
		}

		if (oldTime) {
			let average = 1000 * this.frameTimes.length / (time - oldTime)

			let change = this.fpsSlope + 0.1 * (average - (this.fps + this.fpsSlope))
			this.fps = Math.max(this.fps + change, 0)
			this.fpsSlope += 0.1 * (change - this.fpsSlope)
		}
	}
}

function getMaxDepth(node, depth = 0, visited = []) {
	let nexts = node.cxns.map((e) => e.dest).filter((e) => !visited.includes(e))
	let maxDepth = depth

	for (let next of nexts) {
		let newDepth = getMaxDepth(next, depth + 1, [...visited, node])

		if (maxDepth < newDepth) {
			maxDepth = newDepth
		}
	}

	return maxDepth
}

function collide(el1, el2, stuck1, stuck2, vel) {
	let dist = Math.hypot(el2.x - el1.x, el2.y - el1.y)
	let minDist = el1.size + el2.size

	if (dist < minDist) {
		let angle = Math.atan2(el2.y - el1.y, el2.x - el1.x)

		let diff = minDist - dist
		let centerX = el1.x + (el1.size - diff / 2) * Math.cos(angle)
		let centerY = el1.y + (el1.size - diff / 2) * Math.sin(angle)

		if (!stuck1) {
			el1.x = centerX - (el1.size + diff / 2 + 1) * Math.cos(angle)
			el1.y = centerY - (el1.size + diff / 2 + 1) * Math.sin(angle)
		}

		if (!stuck2) {
			el2.x = el1.x + (minDist + 1) * Math.cos(angle)
			el2.y = el1.y + (minDist + 1) * Math.sin(angle)
		}

		if (!stuck1) {
			el1.x = el2.x - (minDist + 1) * Math.cos(angle)
			el1.y = el2.y - (minDist + 1) * Math.sin(angle)
		}

		if (vel) {
			let mass1 = el1.getMass()
			let mass2 = el2.getMass()

			let vel1Mag = Math.hypot(el1.vx, el1.vy)
			let vel2Mag = Math.hypot(el2.vx, el2.vy)
			let vel1Angle = Math.atan2(el1.vy, el1.vx)
			let vel2Angle = Math.atan2(el2.vy, el2.vx)

			let perpAngle = angle + Math.PI / 2

			let vel1PerpComp = vel1Mag * Math.cos(vel1Angle - perpAngle)
			let vel2PerpComp = vel2Mag * Math.cos(vel2Angle - perpAngle)
			let vel1ParComp = vel1Mag * Math.cos(vel1Angle - angle)
			let vel2ParComp = vel2Mag * Math.cos(vel2Angle - angle)

			let newVel1ParComp = friction * (vel1ParComp * (mass1 - mass2) + vel2ParComp * 2 * mass2) / (mass1 + mass2)
			let newVel2ParComp = friction * (vel1ParComp * 2 * mass1 + vel2ParComp * (mass2 - mass1)) / (mass1 + mass2)

			if (stuck1) {
				newVel2ParComp = Math.abs(newVel2ParComp)
			}

			if (stuck2) {
				newVel1ParComp = -Math.abs(newVel1ParComp)
			}

			if (!stuck1) {
				el1.vx = vel1PerpComp * Math.cos(perpAngle) + newVel1ParComp * Math.cos(angle)
				el1.vy = vel1PerpComp * Math.sin(perpAngle) + newVel1ParComp * Math.sin(angle)
			}

			if (!stuck2) {
				el2.vx = vel2PerpComp * Math.cos(perpAngle) + newVel2ParComp * Math.cos(angle)
				el2.vy = vel2PerpComp * Math.sin(perpAngle) + newVel2ParComp * Math.sin(angle)
			}
		}

		el1.align()
		el2.align()

		return true
	}

	return false
}

function checkCollisions(elements, el1) {
	let collided = false

	for (let el2 of elements) {
		if (el1 == el2 || el1.collisions.includes(el2)) {
			continue
		}

		if (collide(el1, el2, el1.press, el2.press, true)) {
			collided = true
			el1.collisions.push(el2)
			checkCollisions(elements, el2)
		}
	}

	return collided
}

let move = false
let accelerate = true

let G = -1
let k = 0.00025
let friction = 0.99
let drag = 1

function update(elements) {
	let gfxNodes = elements.filter((e) => e instanceof GraphicalNode)

	for (let el of gfxNodes) {
		el.align()

		if (el.pathingFrame) {
			el.pathingFrame--

			if (Math.abs(el.ex - el.x) < 0.1 &&
				Math.abs(el.ey - el.y) < 0.1) {
				el.pathingFrame = 0
			} else {
				el.x += (el.ex - el.x) * (1 - el.pathingFrame / el.pathingTime)
				el.y += (el.ey - el.y) * (1 - el.pathingFrame / el.pathingTime)
				el.vx = 0
				el.vy = 0
				el.align()
			}

			continue
		}

		if (!el.vx || !el.vy || !move) {
			el.vx = 0
			el.vy = 0
		}

		el.ax = el.vx * (drag - 1)
		el.ay = el.vy * (drag - 1)

		if (el.press) {
			continue
		}

		el.x += el.vx
		el.y += el.vy

		let { alignedX, alignedY } = el.align()

		if (alignedX) {
			el.vx *= -friction
		}

		if (alignedY) {
			el.vy *= -friction
		}

		el.applyForce(elements, (el1, el2, dist) => G * el1.getMass() * el2.getMass() / Math.max(100, dist * dist))
		el.applyForce(el.node.cxns.map((e) => e.dest.gfx), (el1, el2, dist) => k * dist)

		if (accelerate) {
			el.vx += el.ax
			el.vy += el.ay
		}
	}

	for (let el of gfxNodes) {
		el.collisions = []
	}

	for (let el of gfxNodes) {
		checkCollisions(gfxNodes, el)
	}
}

let controller = new CanvasController(1000, 1000, update)

let prune = true
let nodes = {}

function loadElements() {
	controller.clearElements()

	move = false
	accelerate = true

	nodes = {}

	for (let line of document.body.innerText.trimEnd().split("\n")) {
		let name = line.split(" ")[1]
		let flowRate = +line.match(/\d+/)[0]
		let dests = line.split(/valves? /)[1].split(", ")

		nodes[name] = new Node(flowRate, name)
		nodes[name].dests = dests
	}

	for (let name in nodes) {
		for (let dest of nodes[name].dests) {
			nodes[name].addCxn(nodes[dest])
		}

		delete nodes[name].dests
	}

	for (let name in nodes) {
		if (prune && name != "AA" && nodes[name].val == 0) {
			for (let cxn1 of nodes[name].cxns) {
				for (let cxn2 of nodes[name].cxns) {
					if (cxn1 == cxn2) {
						continue
					}

					let weight = cxn1.weight + cxn2.weight
					let cxn = cxn1.dest.cxns.find((e) => e.dest == cxn2.dest)

					if (!cxn) {
						cxn1.dest.addCxn(cxn2.dest, weight)
					} else if (cxn.weight > weight) {
						cxn.weight = weight
					}
				}

				cxn1.dest.filterCxnsMut((e) => e.dest != nodes[name])
			}

			delete nodes[name]
		}
	}

	updateNodePoses()

	let x = 115
	let w

	w = "stop".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		"go", function() { this.label = (move ^= 1) ? "stop" : "go" }))

	x += 10 * w + 20
	w = "no accel".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		"no accel", function() { this.label = (accelerate ^= 1) ? "no accel" : "accel" }))

	x += 10 * w + 20
	w = "reload unpruned".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		prune ? "reload unpruned" : "reload pruned", () => { prune ^= 1; loadElements() }))

	x += 10 * w + 20
	w = "change root".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		"change root", () => rootSeeking = true))

	x += 10 * w + 20
	w = "reset root".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		"reset root", () => { rootName = null; updateNodePoses() }))

	x += 10 * w + 20
	w = "show vels".length
	controller.addElement(new Button(x, 10, 10 * w + 10, 25,
		"show vels", function() { this.label = (showVels ^= 1) ? "hide vels" : "show vels" }))
}

function updateNodePoses() {
	if (!nodes[rootName]) {
		let minMaxDepth = Infinity

		for (let name in nodes) {
			let maxDepth = getMaxDepth(nodes[name])

			if (minMaxDepth > maxDepth) {
				minMaxDepth = maxDepth
				rootName = name
			}
		}
	}

	let root = nodes[rootName]
	let maxDepth = getMaxDepth(root)

	let startingSize = 150
	let forceFactor = 200
	let targetScale = 1

	let scaleFactor = 0.01
	let targetSize = controller.width * targetScale / startingSize

	while (true) {
		let p = (scaleFactor + 1) ** maxDepth

		if (Math.abs(p + (p - 1) / scaleFactor - targetSize) < 0.00001) {
			break
		}

		scaleFactor -= scaleFactor * ((p - targetSize) * scaleFactor + p - 1) / ((maxDepth * scaleFactor - 1) * p + 1)
	}

	scaleFactor++

	let visited = [root]

	let toVisit = [{
		node: root,
		x: controller.width / 2,
		y: controller.height / 2,
		angle: 0,
		size: startingSize,
		center: true
	}]

	while (toVisit.length) {
		let newToVisit = []

		for (let props of toVisit) {
			if (controller.elements.includes(props.node.gfx)) {
				if (props.node.gfx.pathingFrame) {
					continue
				} else {
					props.node.gfx.pathingFrame = 30
					props.node.gfx.pathingTime = 30
					props.node.gfx.ex = props.x
					props.node.gfx.ey = props.y
				}
			} else {
				controller.addElement(props.node.createGfx(props.x, props.y, 18 + props.node.val / 2))
			}

			let circleSize = props.center ? props.size : props.size / 2
			let centerX = props.center ? props.x : props.x + circleSize * Math.cos(props.angle)
			let centerY = props.center ? props.y : props.y + circleSize * Math.sin(props.angle)

			let nexts = props.node.cxns.map((e) => e.dest).filter((e) => !visited.includes(e))

			for (let i = 0; i < nexts.length; i++) {
				let frac = props.center ? i / nexts.length : (i + 1) / (nexts.length + 1)
				let newAngle = props.angle + 2 * Math.PI * (frac + 1 / 2)

				let newX = centerX + circleSize * Math.cos(newAngle)
				let newY = centerY + circleSize * Math.sin(newAngle)

				let forceX = -2 * forceFactor * (newX / controller.width - 1 / 2) ** 3
				let forceY = -2 * forceFactor * (newY / controller.height - 1 / 2) ** 3
				let forceMag = Math.hypot(forceX, forceY)

				let forceAngle = (newAngle + Math.atan2(forceY, forceX)) / 2

				newX += forceMag * Math.cos(forceAngle)
				newY += forceMag * Math.sin(forceAngle)
				newAngle = Math.atan2(newY - centerY, newX - centerX)

				newToVisit.push({
					node: nexts[i],
					x: newX,
					y: newY,
					angle: newAngle,
					size: props.size * scaleFactor,
					center: false,
					last: props.node
				})

				visited.push(nexts[i])
			}
		}

		toVisit = newToVisit
	}
}

loadElements()

if (window.interval) {
	clearInterval(window.interval)
}

window.interval = setInterval(() => controller.update(), 1000 / controller.targetFps)