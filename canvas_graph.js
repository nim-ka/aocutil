GraphicalCxn = class GraphicalCxn extends CanvasElement {
	static HOVER_COLOR = "rgb(100, 0, 200)"
	
	static HITBOX_WIDTH = 5
	
	static ARROW_SIZE = 10
	static ARROW_ANGLE = Math.PI / 8

	static DUAL_CXN_SEP_ANGLE = 0.2
	static WEIGHT_SEP_ANGLE = 0.5
	
	constructor(graphGfx, cxn, size) {
		super()
		
		this.graphGfx = graphGfx
		this.cxn = cxn
		this.size = size
		
		this.angle = 0
		this.arrowsize = 0
		this.dist = 0
		
		this.x1 = 0
		this.y1 = 0
		this.x2 = 0
		this.y2 = 0
		this.x3 = 0
		this.y3 = 0
		this.x4 = 0
		this.y4 = 0
		this.xm = 0
		this.ym = 0
		
		this.vx1 = 0
		this.vy1 = 0
		this.vx2 = 0
		this.vy2 = 0
		this.vx3 = 0
		this.vy3 = 0
		this.vx4 = 0
		this.vy4 = 0
		this.vxm = 0
		this.vym = 0
		
		this.vsize = 0
		this.varrowsize = 0
		this.vdist = 0
	}
	
	remove() {
		this.cxn.delete()
		super.remove()
	}
	
	isIn(x, y) {
		if (!this.graphGfx.config.showCxns || !this.graphGfx.config.tangibleCxns) {
			return false
		}
		
		x -= this.vx1
		y -= this.vy1
		
		let nx = x * Math.cos(-this.angle) - y * Math.sin(-this.angle)
		let ny = x * Math.sin(-this.angle) + y * Math.cos(-this.angle)
		
		return nx > -this.constructor.HITBOX_WIDTH && nx < this.constructor.HITBOX_WIDTH + this.vdist &&
			ny > -this.constructor.HITBOX_WIDTH && ny < this.constructor.HITBOX_WIDTH
	}
	
	mouseRelease(mouse) {
		if (this.graphGfx.pruning) {
			this.remove()
		}
	}
	
	updatePost() {
		if (this.cxn.deleted) {
			this.remove()
			return
		}
		
		if (!this.graphGfx.config.showCxns) {
			return
		}
		
		this.highlight = this.graphGfx.dijkstraCxns.has(this.cxn)
		
		let thisNode = this.cxn.src.gfx
		let thatNode = this.cxn.dest.gfx
		
		this.angle = Math.atan2(thatNode.y - thisNode.y, thatNode.x - thisNode.x)
		
		let shift = this.graphGfx.config.dualCxnSep && this.cxn.dest.cxns.has(this.cxn.src) ? this.constructor.DUAL_CXN_SEP_ANGLE : 0

		this.x1 = thisNode.x + thisNode.size * Math.cos(this.angle + shift)
		this.y1 = thisNode.y + thisNode.size * Math.sin(this.angle + shift)
		
		this.x2 = thatNode.x - thatNode.size * Math.cos(this.angle - shift)
		this.y2 = thatNode.y - thatNode.size * Math.sin(this.angle - shift)
		
		this.dist = Math.hypot(thatNode.x - thisNode.x, thatNode.y - thisNode.y) - thisNode.size - thatNode.size
		this.arrowsize = Math.sign(this.dist) * Math.min(this.constructor.ARROW_SIZE, Math.abs(this.dist / 3))
		
		this.x3 = this.x2 - this.arrowsize * Math.cos(this.angle + this.constructor.ARROW_ANGLE)
		this.y3 = this.y2 - this.arrowsize * Math.sin(this.angle + this.constructor.ARROW_ANGLE)
		
		this.x4 = this.x2 - this.arrowsize * Math.cos(this.angle - this.constructor.ARROW_ANGLE)
		this.y4 = this.y2 - this.arrowsize * Math.sin(this.angle - this.constructor.ARROW_ANGLE)
		
		let push = (shift ? 1 : -1) * (shift + this.constructor.WEIGHT_SEP_ANGLE)

		this.xm = (
			thisNode.x + thisNode.size * Math.cos(this.angle + push) +
			thatNode.x - thatNode.size * Math.cos(this.angle - push)) / 2
		this.ym = (
			thisNode.y + thisNode.size * Math.sin(this.angle + push) +
			thatNode.y - thatNode.size * Math.sin(this.angle - push)) / 2
		
		this.vx1 = this.graphGfx.viewport.convertX(this.x1)
		this.vy1 = this.graphGfx.viewport.convertY(this.y1)
		this.vx2 = this.graphGfx.viewport.convertX(this.x2)
		this.vy2 = this.graphGfx.viewport.convertY(this.y2)
		this.vx3 = this.graphGfx.viewport.convertX(this.x3)
		this.vy3 = this.graphGfx.viewport.convertY(this.y3)
		this.vx4 = this.graphGfx.viewport.convertX(this.x4)
		this.vy4 = this.graphGfx.viewport.convertY(this.y4)
		this.vxm = this.graphGfx.viewport.convertX(this.xm)
		this.vym = this.graphGfx.viewport.convertY(this.ym)
		
		this.vsize = this.size * this.graphGfx.viewport.scale
		this.varrowsize = Math.abs(this.arrowsize) * this.graphGfx.viewport.scale
		this.vdist = Math.abs(this.dist) * this.graphGfx.viewport.scale
	}
	
	drawPost() {
		if (!this.graphGfx.config.showCxns || this.vdist < 2) {
			return
		}
		
		this.ctx.strokeStyle = this.getColor()
		this.ctx.fillStyle = this.getColor()
		this.ctx.lineWidth = 1
		
		this.ctx.beginPath()
		this.ctx.moveTo(this.vx1, this.vy1)
		this.ctx.lineTo(this.vx2, this.vy2)
		this.ctx.stroke()

		if (this.varrowsize > 6) {
			this.ctx.beginPath()
			this.ctx.moveTo(this.vx2, this.vy2)
			this.ctx.lineTo(this.vx3, this.vy3)
			this.ctx.lineTo(this.vx4, this.vy4)
			this.ctx.closePath()
			this.ctx.fill()
		}

		if (this.graphGfx.config.showWeights && this.vsize > 7) {
			this.ctx.textAlign = "center"
			this.ctx.textBaseline = "middle"
			this.ctx.font = `${this.vsize}px monospace`
			this.ctx.fillText(this.cxn.weight, this.vxm, this.vym)
		}
	}
	
	getColor() {
		return this.hover ? this.constructor.HOVER_COLOR : this.getStrokeColor()
	}
}

GraphicalNode = class GraphicalNode extends CanvasElement {
	static FILL_COLOR = "rgba(0, 0, 0, 0)"
	static HOVER_COLOR = "rgba(0, 0, 0, 0.1)"
	static PRESS_COLOR = "rgba(0, 0, 0, 0.15)"

	constructor(graphGfx, node, x, y, size) {
		super()

		this.graphGfx = graphGfx
		this.node = node
		this.x = x
		this.y = y
		this.size = size
		
		this.vx = 0
		this.vy = 0
		this.vsize = 0
		
		this.fx = 0
		this.fy = 0

		this.dragX = 0
		this.dragY = 0
		this.dragMouseX = 0
		this.dragMouseY = 0
		
		for (let cxn of this.node.cxns.values()) {
			this.addElement(cxn.gfx = new GraphicalCxn(this.graphGfx, cxn, this.size))
		}
	}
	
	remove() {
		this.graphGfx.graph.deleteNode(this.node)
		
		for (let cxn of this.node.cxns.values()) {
			cxn.gfx.remove()
		}
		
		super.remove()
	}

	isIn(x, y) {
		return Math.hypot(this.vx - x, this.vy - y) <= this.vsize
	}

	mouseUpdate(mouse) {
		if (!this.graphGfx.pruning && this.press) {
			this.targetX = this.dragX + (mouse.x - this.dragMouseX) / this.graphGfx.viewport.scale
			this.targetY = this.dragY + (mouse.y - this.dragMouseY) / this.graphGfx.viewport.scale
		}
	}

	mouseClick(mouse) {
		if (!this.graphGfx.pruning) {
			mouse.claimed = this
			
			this.dragX = this.x
			this.dragY = this.y
			this.dragMouseX = mouse.x
			this.dragMouseY = mouse.y
		}
	}
	
	mouseRelease(mouse) {
		if (this.graphGfx.pruning) {
			if (this.isIn(mouse.x, mouse.y)) {
				this.remove()
			}
		} else {		
			if (this.graphGfx.seekingStart) {
				this.graphGfx.seekingStart = false
				this.graphGfx.dijkstraStart = this
			}
			
			if (this.graphGfx.seekingEnd) {
				this.graphGfx.seekingEnd = false
				this.graphGfx.dijkstraEnd = this
			}
		}
	}
	
	updatePre() {
		this.highlight =
			this == this.graphGfx.dijkstraStart ||
			this == this.graphGfx.dijkstraEnd ||
			this.graphGfx.dijkstraVisited.has(this.node)
		
		this.vx = this.graphGfx.viewport.convertX(this.x)
		this.vy = this.graphGfx.viewport.convertY(this.y)
		
		this.vsize = this.size * this.graphGfx.viewport.scale
	}

	drawPost() {
		this.ctx.strokeStyle = this.getStrokeColor()
		this.ctx.fillStyle = this.getFillColor()
		this.ctx.lineWidth = 1

		this.ctx.beginPath()
		this.ctx.arc(this.vx, this.vy, this.vsize, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.fill()

		if (this.vsize > 7) {
			this.ctx.fillStyle = this.getTextColor()
			this.ctx.textAlign = "center"
			this.ctx.textBaseline = "middle"
			this.ctx.font = `${this.vsize}px monospace`
			this.ctx.fillText(this.node.name, this.vx, this.vy)
		}
		
		if (!this.graphGfx.pruning && this.press) {
			this.x = this.targetX
			this.y = this.targetY
		} else {
			this.targetX = this.x
			this.targetY = this.y
		}
	}
}

GraphicalGraphViewport = class GraphicalGraphViewport {
	constructor(graphGfx) {
		this.graphGfx = graphGfx
		
		this.reset()
	}
	
	reset() {
		this.x = 0
		this.y = 0
		this.scale = 1
	}
	
	convertX(x) {
		return (x - this.x) * this.scale
	}
	
	revertX(x) {
		return x / this.scale + this.x
	}
	
	convertY(y) {
		return (y - this.y) * this.scale
	}
	
	revertY(y) {
		return y / this.scale + this.y
	}
	
	translate(x, y) {
		this.x = this.revertX(x)
		this.y = this.revertY(y)
	}
	
	zoom(scale) {
		let cx = this.graphGfx.ctx.canvas.width / 2
		let cy = this.graphGfx.ctx.canvas.height / 2
		
		this.translate(cx, cy)
		this.scale *= scale
		this.translate(-cx, -cy)
	}
}

GraphicalGraph = class GraphicalGraph extends CanvasElement {
	static BH_SPRING = 10
	static BH_LEN = 150
	static BH_THRESHOLD = 0.5
	
	config = {
		showCxns: true,
		showWeights: false,
		tangibleCxns: false,
		dualCxnSep: false
	}
	
	constructor(graph) {
		super()
		
		this.graph = graph
		this.assocMap = graph.getAssocMap()
		
		this.viewport = new GraphicalGraphViewport(this)
		
		this.seekingStart = false
		this.seekingEnd = false
		
		this.pruning = false
		
		this.forcing = false
		this.forcingTimer = 0
		
		this.resetDijkstra(true, true)
	}
	
	updatePost() {
		if (!this.children.has(this.dijkstraStart)) {
			this.dijkstraStart = null
		}
		
		if (!this.children.has(this.dijkstraEnd)) {
			this.dijkstraEnd = null
		}
		
		if (this.children.size == 0 && this.graph.size > 0) {
			for (let node of this.graph.values()) {
				node.gfx = new GraphicalNode(this, node, 0, 0, 20)
				this.addElement(node.gfx)
			}
			
			this.renderTree()
		}
		
		this.forcingUpdate()
	}

	drawPost() {
		this.ctx.fillStyle = GraphicalNode.HIGHLIGHT_COLOR
		this.ctx.textAlign = "left"
		this.ctx.textBaseline = "alphabetic"
		this.ctx.font = "18px monospace"
		this.ctx.fillText(this.dijkstraLabel, 5, 54)
		
		this.ctx.fillStyle = "rgb(0, 0, 0)"
		this.ctx.textAlign = "right"
		this.ctx.fillText(Math.floor(this.viewport.revertX(this.parent.parent.mouse.x)) + ", " + Math.floor(this.viewport.revertY(this.parent.parent.mouse.y)), 1195, 36)
		this.ctx.fillText(this.viewport.scale.toFixed(2) + ", " + (1 / this.viewport.scale).toFixed(2), 1195, 54)
	}
	
	center() {
		let minx = Infinity
		let maxx = -Infinity
		let miny = Infinity
		let maxy = -Infinity
		
		for (let gfx of this.children) {
			minx = Math.min(minx, gfx.x)
			maxx = Math.max(maxx, gfx.x)
			miny = Math.min(miny, gfx.y)
			maxy = Math.max(maxy, gfx.y)
		}
		
		this.viewport.x = (minx + maxx) / 2
		this.viewport.y = (miny + maxy) / 2
		this.viewport.scale = Math.min(this.ctx.canvas.width / (maxx - minx), this.ctx.canvas.height / (maxy - miny), 4)
		this.viewport.translate(-this.ctx.canvas.width / 2, -this.ctx.canvas.height / 2)
		this.viewport.zoom(0.8)
	}
	
	renderTree() {
		this.assocMap = this.graph.getAssocMap()
		
		let x = 0
		let y = 0
		
		for (let component of this.graph.componentsDirected()) {
			x = this.renderTreeComponent(component, x, y) + 100
		}
		
		this.center()
	}
	
	renderTreeComponent(component, x, y) {
		let head = component.values().next().value
		let layers = Array(head.furthestBfs().searchData.dist + 1).fill().map(() => [])
		
		for (let child of component.values()) {
			layers[child.searchData.dist].push(child)
		}
		
		let maxLen = Math.max.apply(null, layers.map((e) => e.length))
		let max = x
		
		for (let layer of layers) {
			for (let i = 0; i < layer.length; i++) {
				let newX = x - 100 * ((layer.length - maxLen) / 2 - i)
				max = Math.max(max, newX)
				layer[i].gfx.x = newX
				layer[i].gfx.y = y
			}
			
			y += 100
		}
		
		return max
	}
	
	renderForce() {
		this.center()
		
		this.assocMap = this.graph.getAssocMap()
		
		this.forcing = true
		this.forcingUpdate()
	}
	
	forcingUpdate() {
		if (!this.forcing || this.pruning) {
			this.forcing = false
			this.forcingTimer = 0
			return
		}
		
		let time = performance.now()
		
		let minx = Infinity
		let maxx = -Infinity
		let miny = Infinity
		let maxy = -Infinity
		
		for (let gfx of this.children) {
			minx = Math.min(minx, gfx.x)
			maxx = Math.max(maxx, gfx.x)
			miny = Math.min(miny, gfx.y)
			maxy = Math.max(maxy, gfx.y)
		}
		
		while (performance.now() < time + 1000 / 15) {
			let width = Math.max(maxx - minx, maxy - miny)
			let quadtree = this.populateQuadtree(this.children, minx, minx + width, miny, miny + width)
			
			for (let gfx1 of this.children) {
				gfx1.fx = 0
				gfx1.fy = 0
				
				this.applyRepulsion(gfx1, quadtree)
				
				for (let dest of this.assocMap.get(gfx1.node)) {
					let gfx2 = dest.gfx
					
					let dx = gfx2.x - gfx1.x
					let dy = gfx2.y - gfx1.y
					let sqdist = dx * dx + dy * dy
					
					let dist = Math.sqrt(sqdist)
					let max = dist
					
					let f = Math.min(
						this.constructor.BH_SPRING * Math.log(dist / this.constructor.BH_LEN) +
						this.constructor.BH_LEN * this.constructor.BH_LEN / sqdist, max)
					gfx1.fx += dx * f / dist
					gfx1.fy += dy * f / dist
				}
			}
			
			let cool = 1
			//let cool = 0.9999 ** this.forcingTimer
			let maxf = 0
			
			minx = Infinity
			maxx = -Infinity
			miny = Infinity
			maxy = -Infinity
			
			for (let gfx of this.children) {
				gfx.x += gfx.fx * cool
				gfx.y += gfx.fy * cool
				
				maxf = Math.max(maxf, gfx.fx * gfx.fx + gfx.fy * gfx.fy)
				
				minx = Math.min(minx, gfx.x)
				maxx = Math.max(maxx, gfx.x)
				miny = Math.min(miny, gfx.y)
				maxy = Math.max(maxy, gfx.y)
			}
			
			if (maxf < 0.1 / this.viewport.scale) {
				this.forcing = false
				break
			}
		}
			
		this.forcingTimer++
		this.center()
	}
	
	populateQuadtree(gfxNodes, minx, maxx, miny, maxy) {
		if (gfxNodes.size < 2) {
			let el = gfxNodes.values().next().value
			return {
				leaf: true,
				x: el?.x,
				y: el?.y,
				count: gfxNodes.size,
				node: el
			}
		}
		
		let subNodes = [new Set(), new Set(), new Set(), new Set()]
		
		let midx = (minx + maxx) / 2
		let midy = (miny + maxy) / 2
		
		let i = 0
		
		for (let gfx of gfxNodes) {
			if (maxx - minx < 1) {
				gfx.x += i * 5
				gfx.y += i * 5
				subNodes[i % 4].add(gfx)
			} else {
				subNodes[
					gfx.x <= midx && gfx.y <= midy ? 0 :
					gfx.x >= midx && gfx.y <= midy ? 1 :
					gfx.x <= midx && gfx.y >= midy ? 2 : 3].add(gfx)
			}
			
			i++
		}
		
		return {
			leaf: false,
			x: midx,
			y: midy,
			maxSqDist: (maxx - minx) * (maxx - minx) / this.constructor.BH_THRESHOLD,
			count: gfxNodes.size,
			nodes: [
				this.populateQuadtree(subNodes[0], minx, midx, miny, midy),
				this.populateQuadtree(subNodes[1], midx, maxx, miny, midy),
				this.populateQuadtree(subNodes[2], minx, midx, midy, maxy),
				this.populateQuadtree(subNodes[3], midx, maxx, midy, maxy)]
		}
	}
	
	applyRepulsion(gfx, tree) {
		if (tree.leaf && (tree.count == 0 || tree.node == gfx)) {
			return
		}
		
		let dx = tree.x - gfx.x
		let dy = tree.y - gfx.y
		let sqdist = dx * dx + dy * dy
		
		if (tree.leaf || sqdist > tree.maxSqDist) {
			let dist = Math.sqrt(sqdist)
			let max = dist
			
			let f = -tree.count * Math.min(this.constructor.BH_LEN * this.constructor.BH_LEN / sqdist, max)
			gfx.fx += dx * f / dist
			gfx.fy += dy * f / dist
		} else {
			this.applyRepulsion(gfx, tree.nodes[0])
			this.applyRepulsion(gfx, tree.nodes[1])
			this.applyRepulsion(gfx, tree.nodes[2])
			this.applyRepulsion(gfx, tree.nodes[3])
		}
	}
	
	renderBarycentric() {
		this.assocMap = this.graph.getAssocMap()
		
		let cycleEnd = null
		let cycleLen = 0
		
		let dists = new Map()
		let lasts = new Map()
		
		let node
		let i = Math.floor(Math.random() * this.graph.size)
		
		for (let cur of this.graph.values()) {
			if (i-- < 0) {
				break
			}
			
			node = cur
		}
		
		let id = Symbol()
		
		let queue = [node]
		let visited = new Set()
		
		node.searchData.id = id
		node.searchData.dist = 0
		node.searchData.last = undefined
		
		while (queue.length) {
			let cur = queue.pop()
			let dist = cur.searchData.dist
			let last = cur.searchData.last
			
			visited.add(cur)
			
			for (let dest of this.assocMap.get(cur)) {
				if (last != node && dest == node && cycleLen < dist + 1) {
					cycleEnd = cur
					cycleLen = dist + 1
				}
				
				if (!visited.has(dest)) {
					dest.searchData.id = id
					dest.searchData.dist = dist + 1
					dest.searchData.last = cur
					queue.push(dest)
				}
			}
		}
		
		cycleEnd ??= node.furthestBfs()
		
		let cycle = cycleEnd.unwrap()
		let r = 50 * cycle.length / Math.PI
		
		for (let i = 0; i < cycle.length; i++) {
			let k = i + Math.random() / 2
			cycle[i].gfx.x = r * Math.cos(2 * Math.PI * k / cycle.length)
			cycle[i].gfx.y = r * Math.sin(2 * Math.PI * k / cycle.length)
		}
		
		let cycleSet = new Set(cycle)
		let delta = Infinity
		
		while (delta > 3) {
			delta = 0
			
			for (let node of this.graph.values()) {
				let dests = this.assocMap.get(node)
				
				if (dests.size == 0 || cycleSet.has(node)) {
					continue
				}
				
				let sumX = 0
				let sumY = 0
				
				for (let dest of dests) {
					sumX += dest.gfx.x
					sumY += dest.gfx.y
				}
				
				node.gfx.fx = sumX / dests.size
				node.gfx.fy = sumY / dests.size
			}
			
			for (let node of this.graph.values()) {
				if (cycleSet.has(node)) {
					continue
				}
				
				delta = Math.max(delta, Math.hypot(node.gfx.fx - node.gfx.x, node.gfx.fy - node.gfx.y))
				
				node.gfx.x = node.gfx.fx
				node.gfx.y = node.gfx.fy
			}
		}
		
		this.center()
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
		if (!this.dijkstraStart) {
			return
		}
		
		this.pruning = false
		
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
}

GraphicalGraphController = class GraphicalGraphController extends CanvasElement {
	static BUTTONS_START_X = 75
	static BUTTONS_START_Y = 10
	
	constructor(graph) {
		super()
		
		this.graphGfx = new GraphicalGraph(graph)
		
		this.shift = false
		
		this.buttonX = this.constructor.BUTTONS_START_X
		this.buttonY = this.constructor.BUTTONS_START_Y
		
		this.addButton(KeyButton, "dUal sep", ["u", "U"], "release",
			() => {}, { obj: this.graphGfx.config, prop: "dualCxnSep" })
		this.addButton(KeyButton, "Cxns", ["c", "C"], "release",
			() => {}, { obj: this.graphGfx.config, prop: "showCxns" })
		this.addButton(KeyButton, "Weights", ["w", "W"], "release",
			() => {}, { obj: this.graphGfx.config, prop: "showWeights" })
		this.addButton(KeyButton, "tanGible cxns", ["g", "G"], "release",
			() => {}, { obj: this.graphGfx.config, prop: "tangibleCxns" })
		this.addButton(KeyButton, "sel Start", ["s", "S"], "release",
			() => this.graphGfx.resetDijkstra(true, false), { obj: this.graphGfx, prop: "seekingStart" })
		this.addButton(KeyButton, "sel End", ["e", "E"], "release",
			() => this.graphGfx.resetDijkstra(false, true), { obj: this.graphGfx, prop: "seekingEnd" })
		this.addButton(KeyButton, "Dijkstra", ["d", "D"], "release",
			() => this.graphGfx.dijkstra())
		this.addButton(KeyButton, "Reset dijkstra", ["r", "R"], "release",
			() => this.graphGfx.resetDijkstra(true, true))
		this.addButton(KeyButton, "Pruning mode", ["p", "P"], "release",
			() => this.graphGfx.resetDijkstra(false, false), { obj: this.graphGfx, prop: "pruning" })
		this.addButton(KeyButton, "focus", [], "",
			() => this.ctx.canvas.focus())
		this.addButton(KeyButton, "\u2190", ["ArrowLeft"], "down",
			() => this.left())
		this.addButton(KeyButton, "\u2192", ["ArrowRight"], "down",
			() => this.right())
		this.addButton(KeyButton, "\u2191", ["ArrowUp"], "down",
			() => this.up())
		this.addButton(KeyButton, "\u2193", ["ArrowDown"], "down",
			() => this.down())
		this.addButton(KeyButton, "+", ["=", "+"], "down",
			() => this.zoomIn())
		this.addButton(KeyButton, "-", ["-", "_"], "down",
			() => this.zoomOut())
		this.addButton(KeyButton, "cENTER", ["Enter"], "release",
			() => this.graphGfx.center())
		this.addButton(KeyButton, "Tree", ["t", "T"], "release",
			() => this.graphGfx.renderTree())
		this.addButton(KeyButton, "Force", ["f", "F"], "release",
			(forcing) => forcing && this.graphGfx.renderForce(), { obj: this.graphGfx, prop: "forcing" })
		this.addButton(KeyButton, "Bary", ["b", "B"], "release",
			() => this.graphGfx.renderBarycentric())
		
		this.addElement(this.graphGfx)
	}
	
	keyboardUpdate(keyboard) {
		this.shift = keyboard.down.has("Shift")
	}
	
	left() {
		return this.graphGfx.viewport.translate(this.shift ? -10 : -50, 0)
	}
	
	right() {
		return this.graphGfx.viewport.translate(this.shift ? 10 : 50, 0)
	}
	
	up() {
		return this.graphGfx.viewport.translate(0, this.shift ? -10 : -50)
	}
	
	down() {
		return this.graphGfx.viewport.translate(0, this.shift ? 10 : 50)
	}
	
	zoomIn() {
		return this.graphGfx.viewport.zoom(this.shift ? 1.04 : 1.2)
	}
	
	zoomOut() {
		return this.graphGfx.viewport.zoom(this.shift ? 1 / 1.04 : 1 / 1.2)
	}
	
	addButton(cons, ...args) {
		let w = args[0].length
		
		this.addElement(new cons(this.buttonX, this.buttonY, 10 * w + 10, 25, ...args))
		
		this.buttonX += 10 * w + 20
		
		if (this.buttonX > 1000) {
			this.buttonX = this.constructor.BUTTONS_START_X
			this.buttonY += 30
		}
		
		return this
	}
}

