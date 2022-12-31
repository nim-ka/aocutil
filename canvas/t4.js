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
		this.pauseTimer = false
		this.timer = 0

		this.children = new Set()
		this.ctx = null
	}

	setCtx(ctx) {
		this.ctx = ctx
		this.reset()
		return this
	}

	addElement(el) {
		el.setCtx(this.ctx)
		this.children.add(el)
		return this
	}

	removeElement(el) {
		this.children.delete(el)
		return this
	}

	hasElement(el) {
		return this.children.has(el)
	}

	clearElements(el) {
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
		this.updatePre()

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

		for (let el of this.children) {
			el.update(mouse)
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
		this.ctx.fillText(this.mouse.x + ", " + this.mouse.y, 5, 36)
	}

	tick() {
		this.update(this.mouse)
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

class BlizzardGfx extends CanvasElement {
	static TEXT_COLOR = "rgb(100, 100, 100)"
	static FILL_COLOR = "rgb(200, 200, 200)"

	constructor(x, y, vx, vy, size) {
		super()

		this.x = x
		this.y = y
		this.angle = Math.atan2(vy, vx)
		this.size = size
	}

	drawPre() {
		this.ctx.fillStyle = this.getFillColor()
		this.ctx.fillRect(this.x, this.y, this.size, this.size)

		/*
		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI)
		this.ctx.fill()
		*/

		/*
		this.ctx.fillStyle = this.getTextColor()

		let triSize = this.size * 3 / 7
		let triAngle = this.angle

		this.ctx.beginPath()
		this.ctx.moveTo(this.x + triSize * Math.cos(triAngle), this.y + triSize * Math.sin(triAngle))
		triAngle += 2 * Math.PI / 3
		this.ctx.lineTo(this.x + triSize * Math.cos(triAngle), this.y + triSize * Math.sin(triAngle))
		triAngle += 2 * Math.PI / 3
		this.ctx.lineTo(this.x + triSize * Math.cos(triAngle), this.y + triSize * Math.sin(triAngle))
		this.ctx.fill()
		*/
	}
}

let go = false

class Day24 extends CanvasElement {
	static FILL_COLOR = "rgb(200, 0, 0, 0.5)"

	static CARET_DIRECTIONS = {
		"^": new Point(0, -1),
		"v": new Point(0, 1),
		"<": new Point(-1, 0),
		">": new Point(1, 0)
	}

	static FRAMES_PER_STEP = 10

	constructor(input, x, y, size) {
		super()

		this.input = input
		this.x = x
		this.y = y
		this.size = size
	}

	resetPre() {
		this.clearElements()

		let grid = Grid.fromStr(this.input)

		this.width = grid.width - 2
		this.height = grid.height - 2

		this.start = new Point(1, 0)
		this.end = new Point(this.width, this.height + 1)

		this.start.path = [this.start]

		this.poses = new PointArray(this.start)
		this.finishedPath = null

		this.blizzards = []

		grid.forEach((e, pt) => {
			switch (e) {
				case "^":
				case "v":
				case "<":
				case ">":
					this.blizzards.push({
						x: pt.x,
						y: pt.y,
						vx: Day24.CARET_DIRECTIONS[e].x,
						vy: Day24.CARET_DIRECTIONS[e].y,
					})
			}
		})

		this.pauseTimer = true
		this.timer = 0

		this.steps = 0
	}

	updatePre() {
		if (go) {
			if (this.pauseTimer) {
				this.pauseTimer = false
				this.timer = 0
			}

			go = false
		}

		if (this.timer == Day24.FRAMES_PER_STEP) {
			this.timer = 0
			this.step()
		}

		this.updateGfx()
	}

	drawPre() {
		this.ctx.lineWidth = 1

		if (!this.finishedPath) {
			for (let { path } of this.poses) {
				this.drawPath(path)
			}
		}
	}

	drawPost() {
		this.highlight = true
		this.ctx.lineWidth = 2

		if (this.finishedPath) {
			this.drawPath(this.finishedPath)
		}
	}

	updateGfx() {
		for (let blizzard of this.blizzards) {
			let time = this.timer % Day24.FRAMES_PER_STEP

			let x = blizzard.x + time * blizzard.vx / Day24.FRAMES_PER_STEP
			let y = blizzard.y + time * blizzard.vy / Day24.FRAMES_PER_STEP
			
			if (x <= 0.5) {
				x += this.width
			}

			if (x >= this.width + 0.5) {
				x -= this.width
			}
			
			if (y <= 0.5) {
				y += this.height
			}
			
			if (y >= this.height + 0.5) {
				y -= this.height
			}

			if (!blizzard.gfx) {
				blizzard.gfx = new BlizzardGfx(0, 0, blizzard.vx, blizzard.vy, this.size).addTo(this)
			}

			blizzard.gfx.x = this.getGfxX(x)
			blizzard.gfx.y = this.getGfxY(y)
		}
	}

	async step() {
		let blizzardSet = new Set()

		for (let blizzard of this.blizzards) {
			blizzardSet.add(new Point(blizzard.x, blizzard.y).encode())
		}

		let newPoses = new PointArray()

		for (let pos of this.poses) {
			let newPath = [...pos.path]

			if (!newPath[newPath.length - 1].equals(pos)) {
				newPath.push(pos)
			}

			let nexts = pos.getUnfilteredAdjNeighborsIncSelf()
				.filter((e) => this.isNotWall(e))
				.filter((e) => !blizzardSet.has(e.encode()))

			for (let next of nexts) {
				if (next.isIn(newPoses)) {
					continue
				}

				if (next.equals(this.end)) {
					this.pauseTimer = true
					this.finishedPath = newPath
					return
				}

				next.path = newPath
				newPoses.push(next)
			}
		}

		this.poses = newPoses

		for (let blizzard of this.blizzards) {
			blizzard.x = (blizzard.x + blizzard.vx + this.width - 1) % this.width + 1
			blizzard.y = (blizzard.y + blizzard.vy + this.height - 1) % this.height + 1
		}

		this.steps++
	}

	drawPath(path) {
		/*
		this.ctx.strokeStyle = this.getStrokeColor()

		this.ctx.beginPath()
		this.ctx.moveTo(this.getGfxX(path[0].x), this.getGfxY(path[0].y))

		let x
		let y

		for (let i = 1; i < path.length; i++) {
			x = this.getGfxX(path[i].x)
			y = this.getGfxY(path[i].y)
			this.ctx.lineTo(x, y)
		}

		this.ctx.arc(x, y, this.size / 6, 0, 2 * Math.PI)
		this.ctx.stroke()
		*/

		this.ctx.fillStyle = this.getFillColor()

		let x = this.getGfxX(path[path.length - 1].x)
		let y = this.getGfxY(path[path.length - 1].y)

		this.ctx.fillRect(x, y, this.size, this.size)
	}

	getGfxX(x) {
		return this.x + this.size * (x - this.width / 2)
	}

	getGfxY(y) {
		return this.y + this.size * (y - this.height / 2)
	}

	isNotWall(pt) {
		return (pt.x > 0 && pt.x < this.width + 1 && pt.y > 0 && pt.y < this.height + 1) ||
			pt.equals(this.start) || pt.equals(this.end)
	}
}

let controller = new CanvasController(1200, 800)

controller.addElement(new Day24(input, controller.width / 2, controller.height / 2, 10))

if (window.interval) {
	clearInterval(window.interval)
}

window.interval = setInterval(() => controller.tick(), 1000 / controller.targetFps)