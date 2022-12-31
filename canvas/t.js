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
	}

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

		this.frameNum = 0
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

	update(mouse) {
		super.update(mouse)

		this.updateFps()
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

let controller = new CanvasController(1000, 1000)

if (window.interval) {
	clearInterval(window.interval)
}

window.interval = setInterval(() => controller.tick(), 1000 / controller.targetFps)