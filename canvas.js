EventHandler = class EventHandler {
	constructor(el) {
		for (let type of this.constructor.EVT_TYPES) {
			el.addEventListener(type, this)
		}
	}
	
	handleEvent(evt) {
		if (this.constructor.EVT_TYPES.includes(evt.type)) {
			this[evt.type](evt)
			evt.preventDefault()
		}
	}
}

Keyboard = class Keyboard extends EventHandler {
	static EVT_TYPES = [
		"keydown",
		"keyup"
	]
	
	constructor(el) {
		super(el)
		
		this.down = new Set()
		this.press = new Set()
	}
	
	resetFrame() {
		this.press.clear()
	}
	
	keydown(evt) {
		this.down.add(evt.key)
		this.press.add(evt.key)
	}
	
	keyup(evt) {
		this.down.delete(evt.key)
		this.press.delete(evt.key)
	}
}

Mouse = class Mouse extends EventHandler {
	static EVT_TYPES = [
		"mousemove",
		"mouseenter",
		"mouseleave",
		"mouseup",
		"mousedown"
	]

	constructor(el) {
		super(el)
		
		this.x = 0
		this.y = 0
		
		this.down = false
		this.press = false
		
		this.resetFrame()
	}
	
	resetFrame() {
		if (!this.down) {
			this.claimed = null
		}
		
		this.used = false
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

CanvasElement = class CanvasElement {
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

	update(keyboard, mouse) {
		this.totalChildren = 0
		
		this.keyboardUpdate(keyboard)
		
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
		
		this.updatePre()

		for (let el of this.children) {
			el.update(keyboard, mouse)
			this.totalChildren += el.totalChildren + 1
		}

		this.updatePost()

		if (!this.pauseTimer) {
			this.timer++
		}
	}

	updatePre() {}
	updatePost() {}
	
	keyboardUpdate(keyboard) {}

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
	
	drawTop() {
		this.drawTopPre()

		for (let el of this.children) {
			el.drawTop()
		}

		this.drawTopPost()
	}
	
	drawTopPre() {}
	drawTopPost() {}

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

CanvasController = class CanvasController extends CanvasElement {
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
		
		this.canvas.setAttribute("tabindex", 1)

		this.keyboard = new Keyboard(this.canvas)
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
		
		this.keyboard.resetFrame()
		this.mouse.resetFrame()
	}

	updatePost() {
		this.updateCallback.call(this)
		this.draw()
		this.drawTop()
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
		
		this.ctx.textAlign = "right"
		this.ctx.fillText(this.mouse.x + ", " + this.mouse.y, 1195, 18)
	}

	tick() {
		this.update(this.keyboard, this.mouse)
	}
	
	loop(id) {
		if (window.currentControllerId == id) {
			this.tick()
			requestAnimationFrame(() => this.loop(id))
		}
	}
	
	start() {
		this.loop(window.currentControllerId = Math.random())
		return this
	}
}

Button = class Button extends CanvasElement {
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

	drawTopPost() {
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

ToggleButton = class ToggleButton extends Button {
	static ACTIVE_COLOR = "rgb(215, 215, 255)"
	
	constructor(x, y, width, height, label, obj, prop, callback = () => {}) {
		super(x, y, width, height, label, function() {
			let orig = obj[prop]
			callback.call(this, orig)
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

