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
		
		this.resetFrame()
	}
	
	resetFrame() {
		if (!this.down) {
			this.claimed = null
		}
		
		this.used = false
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
		this.pauseTimer = false
		this.timer = 0

		this.children = new Set()
		this.parent = null
		this.ctx = null
		
		this.totalChildren = 0
	}

	setCtx(ctx) {
		this.ctx = ctx
		this.reset()
		return this
	}
	
	remove() {
		this.parent?.removeElement(this)
	}

	addElement(el) {
		el.setCtx(this.ctx)
		this.children.add(el)
		el.parent = this
		return this
	}

	removeElement(el) {
		this.children.delete(el)
		el.parent = null
		return this
	}

	hasElement(el) {
		return this.children.has(el)
	}

	clearElements(el) {
		this.children.forEach((el) => el.parent = null)
		this.children.clear()
		return this
	}

	addTo(el) {
		el.addElement(this)
		return this
	}

	isIn(x, y) {
		return false
	}

	reset() {
		this.resetPre()

		this.hover = false
		this.press = false
		this.highlight = false

		for (let el of this.children) {
			el.setCtx(this.ctx)
		}

		this.resetPost()
	}

	resetPre() {}
	resetPost() {}

	update(mouse) {
		this.totalChildren = 0
		
		this.updatePre()

		if (mouse && (mouse.claimed == this || (!mouse.claimed && !mouse.used && this.isIn(mouse.x, mouse.y)))) {
			mouse.used = true
			
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

		for (let el of this.children) {
			el.update(mouse)
			this.totalChildren += el.totalChildren + 1
		}

		this.updatePost()

		if (!this.pauseTimer) {
			this.timer++
		}
	}

	updatePre() {}
	updatePost() {}

	mouseUpdate(mouse) {}
	mouseClick(mouse) {}
	mouseRelease(mouse) {}

	draw() {
		this.drawPre()

		for (let el of this.children) {
			el.draw()
		}

		this.drawPost()
	}

	drawPre() {}
	drawPost() {}

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

class CanvasController extends CanvasElement {
	static TARGET_FPS = 60

	constructor(width, height, updateCallback = () => {}) {
		super()

		this.width = width
		this.height = height
		this.updateCallback = updateCallback

		this.frameTimes = []

		this.targetFps = CanvasController.TARGET_FPS
		this.fps = this.targetFps
		this.fpsSlope = 0

		this.resetCanvas()
	}

	resetCanvas() {
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

		this.setCtx(this.canvas.getContext("2d"))
	}

	updatePre() {
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
		
		this.mouse.resetFrame()
	}

	updatePost() {
		this.updateCallback.call(this)
		this.draw()
	}

	drawPre() {
		this.ctx.fillStyle = "rgb(255, 255, 255)"
		this.ctx.fillRect(0, 0, this.width, this.height)

		this.ctx.strokeStyle = "rgb(0, 0, 0)"
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(0, 0, this.width, this.height)
	}

	drawPost() {
		this.ctx.fillStyle = "rgb(0, 0, 0)"
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.fps.toPrecision(5), 5, 18)
		this.ctx.fillText(this.totalChildren, 5, 36)
	}

	tick() {
		this.update(this.mouse)
	}
	
	loop(id) {
		if (window.currentControllerId == id) {
			this.tick()
			requestAnimationFrame(() => this.loop(id))
		}
	}
	
	start() {
		this.loop(window.currentControllerId = Math.random())
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
	
	mouseClick(mouse) {
		mouse.claimed = this
	}

	mouseRelease(mouse) {
		this.callback()
	}

	drawPre() {
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

		let depression = this.getDepression()

		this.ctx.fillStyle = this.getFillColor()
		this.ctx.beginPath()
		this.ctx.roundRect(this.x + depression, this.y + depression, this.width, this.height, 5)
		this.ctx.fill()
		this.ctx.stroke()

		this.ctx.fillStyle = this.getTextColor()
		this.ctx.fillText(this.label, this.x + this.width / 2 + depression, this.y + this.height / 2 + depression)
	}
	
	// :(
	getDepression() {
		return this.press ? 2 : 0
	}
}

class ToggleButton extends Button {
	static ACTIVE_COLOR = "rgb(215, 215, 255)"
	
	constructor(x, y, width, height, label, obj, prop, callback = () => {}) {
		super(x, y, width, height, label, function() {
			let orig = obj[prop]
			callback.call(this)
			obj[prop] = !orig
		})
		
		this.obj = obj
		this.prop = prop
	}
	
	getFillColor() {
		return this.obj[this.prop] ? this.constructor.ACTIVE_COLOR : super.getFillColor()
	}
	
	getDepression() {
		return this.press ? 3 : this.obj[this.prop] ? 2 : 0
	}
}

class GraphicalCxn extends CanvasElement {
	static HOVER_COLOR = "rgb(100, 0, 200)"
	
	static HITBOX_WIDTH = 5
	
	static ARROW_SIZE = 10
	static ARROW_ANGLE = Math.PI / 8

	static DUAL_CXN_SEP_ANGLE = 0.2
	static WEIGHT_SEP_ANGLE = 0.5
	
	constructor(cxn) {
		super()
		
		this.cxn = cxn
		
		this.angle = 0
		this.dist = 0
		this.x = 0
		this.y = 0
	}
	
	remove() {
		this.cxn.delete()
		super.remove()
	}
	
	isIn(x, y) {
		if (!this.parent.parent.config.tangibleCxns) {
			return false
		}
		
		x -= this.x
		y -= this.y
		
		let nx = x * Math.cos(-this.angle) - y * Math.sin(-this.angle)
		let ny = x * Math.sin(-this.angle) + y * Math.cos(-this.angle)
		
		return nx > -this.constructor.HITBOX_WIDTH && nx < this.constructor.HITBOX_WIDTH + this.dist &&
			ny > -this.constructor.HITBOX_WIDTH && ny < this.constructor.HITBOX_WIDTH
	}
	
	mouseRelease(mouse) {
		if (this.parent.parent.pruning) {
			this.remove()
		}
	}
	
	updatePost() {
		if (this.cxn.deleted) {
			this.remove()
		}
	}
	
	drawPost() {
		this.highlight = this.parent.parent.dijkstraCxns.has(this.cxn)
		
		this.ctx.strokeStyle = this.getColor()
		this.ctx.fillStyle = this.getColor()
		this.ctx.lineWidth = this.parent.parent.config.thickLines ? 2 : 1

		let thisNode = this.parent
		let thatNode = this.cxn.dest.gfx
		
		this.angle = Math.atan2(thatNode.y - thisNode.y, thatNode.x - thisNode.x)
		
		let shift = this.parent.parent.config.dualCxnSep && this.cxn.dest.cxns.has(this.parent.node) ? this.constructor.DUAL_CXN_SEP_ANGLE : 0

		this.x = thisNode.x + thisNode.size * Math.cos(this.angle + shift)
		this.y = thisNode.y + thisNode.size * Math.sin(this.angle + shift)
		
		let x2 = thatNode.x - thatNode.size * Math.cos(this.angle - shift)
		let y2 = thatNode.y - thatNode.size * Math.sin(this.angle - shift)
		
		this.dist = Math.hypot(x2 - this.x, y2 - this.y)

		this.ctx.beginPath()
		this.ctx.moveTo(this.x, this.y)
		this.ctx.lineTo(x2, y2)
		this.ctx.stroke()

		let x3 = x2 - this.constructor.ARROW_SIZE * Math.cos(this.angle + this.constructor.ARROW_ANGLE)
		let y3 = y2 - this.constructor.ARROW_SIZE * Math.sin(this.angle + this.constructor.ARROW_ANGLE)
		let x4 = x2 - this.constructor.ARROW_SIZE * Math.cos(this.angle - this.constructor.ARROW_ANGLE)
		let y4 = y2 - this.constructor.ARROW_SIZE * Math.sin(this.angle - this.constructor.ARROW_ANGLE)

		this.ctx.beginPath()
		this.ctx.moveTo(x2, y2)
		this.ctx.lineTo(x3, y3)
		this.ctx.lineTo(x4, y4)
		this.ctx.closePath()
		this.ctx.fill()

		if (this.parent.parent.config.showWeights) {
			let push = (shift ? 1 : -1) * (shift + this.constructor.WEIGHT_SEP_ANGLE)

			let midX = (thisNode.x + thatNode.x) / 2
			let midY = (thisNode.y + thatNode.y) / 2
			midX += (thisNode.size * Math.cos(this.angle + push) - thatNode.size * Math.cos(this.angle - push)) / 2
			midY += (thisNode.size * Math.sin(this.angle + push) - thatNode.size * Math.sin(this.angle - push)) / 2

			this.ctx.textAlign = "center"
			this.ctx.textBaseline = "middle"
			this.ctx.font = `${thisNode.size}px monospace`
			this.ctx.fillText(this.cxn.weight, midX, midY)
		}
	}
	
	getColor() {
		return this.hover ? this.constructor.HOVER_COLOR : this.getStrokeColor()
	}
}

class GraphicalNode extends CanvasElement {
	static FILL_COLOR = "rgba(0, 0, 0, 0)"
	static HOVER_COLOR = "rgba(0, 0, 0, 0.1)"
	static PRESS_COLOR = "rgba(0, 0, 0, 0.15)"

	constructor(node, x, y, size) {
		super()

		this.node = node
		this.x = x
		this.y = y
		this.size = size

		this.dragOffsetX = 0
		this.dragOffsetY = 0
		
		for (let cxn of this.node.cxns.values()) {
			this.addElement(cxn.gfx = new GraphicalCxn(cxn))
		}
	}
	
	remove() {
		this.parent.graph.deleteNode(this.node)
		
		for (let cxn of this.node.cxns.values()) {
			cxn.gfx.remove()
		}
		
		super.remove()
	}

	isIn(x, y) {
		return Math.hypot(this.x - x, this.y - y) <= this.size
	}

	mouseUpdate(mouse) {
		if (!this.parent.pruning && this.press) {
			this.x = mouse.x + this.dragOffsetX
			this.y = mouse.y + this.dragOffsetY
		}
	}

	mouseClick(mouse) {
		if (!this.parent.pruning) {
			mouse.claimed = this
			
			this.dragOffsetX = this.x - mouse.x
			this.dragOffsetY = this.y - mouse.y
		}
	}
	
	mouseRelease(mouse) {
		if (this.parent.pruning) {
			if (this.isIn(mouse.x, mouse.y)) {
				this.remove()
			}
		} else {		
			if (this.parent.seekingStart) {
				this.parent.seekingStart = false
				this.parent.dijkstraStart = this
			}
			
			if (this.parent.seekingEnd) {
				this.parent.seekingEnd = false
				this.parent.dijkstraEnd = this
			}
		}
	}

	drawPost() {
		let highlight = this == this.parent.dijkstraStart || this == this.parent.dijkstraEnd || this.parent.dijkstraVisited.has(this.node)
		this.highlight = highlight
		
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.fillStyle = this.getFillColor()
		this.ctx.lineWidth = this.parent.config.thickLines ? 2 : 1

		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.fill()

		this.ctx.fillStyle = this.getTextColor()
		this.ctx.textAlign = "center"
		this.ctx.textBaseline = "middle"
		this.ctx.font = `${this.size}px monospace`
		this.ctx.fillText(this.node.name, this.x, this.y)
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
	
	collide(that) {
		let dist = Math.hypot(that.x - this.x, that.y - this.y)
		let minDist = this.size + that.size

		if (dist > minDist) {
			return false
		}
		
		let angle = Math.atan2(that.y - this.y, that.x - this.x) + (Math.random() - 0.5) * 0.05

		let diff = minDist - dist
		let centerX = this.x + (this.size - diff / 2) * Math.cos(angle)
		let centerY = this.y + (this.size - diff / 2) * Math.sin(angle)

		if (!this.press) {
			this.x = centerX - (this.size + diff / 2 + 1) * Math.cos(angle)
			this.y = centerY - (this.size + diff / 2 + 1) * Math.sin(angle)
		}

		if (!that.press) {
			that.x = this.x + (minDist + 1) * Math.cos(angle)
			that.y = this.y + (minDist + 1) * Math.sin(angle)
		}

		if (!this.press) {
			this.x = that.x - (minDist + 1) * Math.cos(angle)
			this.y = that.y - (minDist + 1) * Math.sin(angle)
		}

		this.align()
		that.align()
		
		return true
	}
}

class GraphicalGraph extends CanvasElement {
	config = {
		showWeights: false,
		doCollisions: true,
		thickLines: true,
		tangibleCxns: false,
		dualCxnSep: false
	}
	
	constructor(graph, x, y, width, height, size) {
		super()
		
		this.graph = graph
		
		for (let node of this.graph.values()) {
			this.addElement(node.gfx = new GraphicalNode(node, x + Math.random() * width, y + Math.random() * height, size))
		}
		
		this.seekingStart = false
		this.seekingEnd = false
		this.pruning = false
		
		this.resetDijkstra(true, true)
	}
	
	resetDijkstra(resetStart, resetEnd) {
		this.pruning = false
		
		if (resetStart) {
			this.dijkstraStart = null
		}
		
		if (resetEnd) {
			this.dijkstraEnd = null
		}
		
		this.dijkstraVisited = new Set()
		this.dijkstraCxns = new Set()
		this.dijkstraLabel = "-"
	}
	
	dijkstra() {
		if (this.pruning || !this.dijkstraStart) {
			return
		}
		
		if (this.dijkstraEnd) {
			let res = this.dijkstraStart.node.dijkstra(this.dijkstraEnd.node)
			this.dijkstraLabel = res?.searchData.dist.toString() ?? "N/A"
			
			if (res) {
				this.dijkstraCxns.clear()
				
				for (let [src, dest] of res.unwrap().windowsGen(2)) {
					this.dijkstraVisited.add(dest)
					this.dijkstraCxns.add(src.getCxn(dest))
				}
			}
		} else {
			this.dijkstraStart.node.exploreDijkstra(undefined, this.dijkstraVisited)
			this.dijkstraLabel = this.dijkstraVisited.size
			this.dijkstraCxns.clear()
			
			for (let node of this.dijkstraVisited) {
				if (node.searchData.last) {
					this.dijkstraCxns.add(node.searchData.last.getCxn(node))
				}
			}
		}
	}
	
	updatePost() {
		for (let gfx of this.children) {
			gfx.align()
			gfx.collisions = new Set()
		}
		
		if (this.config.doCollisions) {
			for (let gfx of this.children) {
				this.checkCollisions(gfx)
			}
		}
	}

	drawPost() {
		this.ctx.fillStyle = GraphicalNode.HIGHLIGHT_COLOR
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.dijkstraLabel, 5, 54)
	}
	
	checkCollisions(gfx) {
		let queue = [gfx]
		
		for (let i = 0; queue.length && i < 1000; i++) {
			let gfx1 = queue.pop()
			
			for (let gfx2 of this.children) {
				if (gfx1 == gfx2 || gfx1.collisions.has(gfx2)) {
					continue
				}

				if (gfx1.collide(gfx2)) {
					gfx1.collisions.add(gfx2)
					queue.push(gfx2)
				}
			}
		}
	}
}

let controller = new CanvasController(1200, 800)

let graphStr = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`
let graphGfx = new GraphicalGraph(Graph.fromStr(graphStr, ": ", " ", true), 100, 100, 1000, 600, 20)

let x = 115
let y = 10

function addButton(label, callback) {
	let w = label.length
	controller.addElement(new Button(x, y, 10 * w + 10, 25, label, callback))
	x += 10 * w + 20
}

function addToggleButton(label, obj, prop, callback) {
	let w = label.length
	controller.addElement(new ToggleButton(x, y, 10 * w + 10, 25, label, obj, prop, callback))
	x += 10 * w + 20
}

addToggleButton("weights", graphGfx.config, "showWeights")
addToggleButton("collision", graphGfx.config, "doCollisions")
addToggleButton("thick lines", graphGfx.config, "thickLines")
addToggleButton("tangible cxns", graphGfx.config, "tangibleCxns")
addToggleButton("sel start", graphGfx, "seekingStart", () => graphGfx.resetDijkstra(true, false))
addToggleButton("sel end", graphGfx, "seekingEnd", () => graphGfx.resetDijkstra(false, true))
addButton("dijkstra", () => graphGfx.dijkstra())
addButton("reset dijkstra", () => graphGfx.resetDijkstra(true, true))
addToggleButton("pruning mode", graphGfx, "pruning", () => graphGfx.resetDijkstra(true, true))

x = 115
y = 40

addToggleButton("dual cxn sep", graphGfx.config, "dualCxnSep")

controller.addElement(graphGfx)
controller.start()