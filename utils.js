utils = {
	log: (e, ...args) => (console.log(e instanceof Grid ? e.toString() : e, ...args), e),
	logCopy: (e, ...args) => (console.log(e instanceof Grid ? e.toString() : e.copyDeep(), ...args), e),
	fetchText: (...args) => fetch(...args).then((e) => e.text()),
	fetchEval: (...args) => utils.fetchText(...args).then((e) => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => {
		let func = functifyVal(fill)

		return Array(h).fill().map((_, y) => {
			return Array(w).fill().map((_, x) => func(new Point(x, y)))
		})
	},
	// num utils because numbers are weird
	divmod: (a, b) => {
		return [Math.floor(a / b), a % b]
	},
	powmod: (a, b, m) => {
		a %= m

		if (b == 0) {
			return 1
		}

		if (b == 1) {
			return a
		}

		let r = utils.powmod(a, Math.floor(b / 2), m)

		return (b % 2 ? a : 1) * r * r % m
	},
	gcd2: (a, b) => {
		while (b) {
			[a, b] = [b, a % b]
		}

		return a
	},
	gcd: (...args) => args.length ? args.reduce(utils.gcd2) : 0,
	lcm2: (a, b) => a && b ? a * (b / utils.gcd2(a, b)) : 0,
	lcm: (...args) => args.length ? args.reduce(utils.lcm2) : 0,
	isPrime: (n) => {
		for (let i = 2; i * i <= n; i++) {
			if (n % i == 0) {
				return false
			}
		}

		return true
	},
	primeFactors: (n) => {
		let arr = []

		for (let i = 2; n > 1;) {
			if (i * i > n) {
				arr.push(+n)
				break
			} else if (n % i == 0) {
				arr.push(i)
				n /= i
			} else {
				i++
			}
		}

		return arr
	},
	factors: (n) => {
		let arr = []
		let arr2 = []

		for (let i = 1; i * i <= n; i++) {
			if (n % i == 0) {
				arr.push(i)

				if (i != n / i) {
					arr2.unshift(n / i)
				}
			}
		}

		return [...arr, ...arr2]
	},
	lock: (obj, val) => {
		let proxy

		let func = val instanceof Function ? val : () => val

		return proxy = new Proxy(obj, {
			get(obj, prop) {
				if (prop == "obj") {
					return Object.assign({}, proxy)
				} else if (prop in obj) {
					return obj[prop]
				} else {
					return func(obj, prop)
				}
			}
		})
	},
	createMap: (val = undefined, obj) => utils.lock(Object.assign({ __proto__: null }, obj), val),
	getObject: (obj) => Object.assign({}, obj),
	emptyArray: (n, func = (e, i) => i) => Array(n).fill().map(func),
	memoize: (func, serialize = (...args) => args.join("\0")) => {
		let map = new Map()

		return (...args) => {
			let key = serialize(...args)

			if (map.has(key)) {
				return map.get(key)
			}

			let val = func(...args)
			map.set(key, val)
			return val
		}
	},
	binarySearch: (func, start, end, searchVal = true) => {
		if (!(func(start) != searchVal && func(end) == searchVal)) {
			return null
		}

		let lastNo = start
		let lastYes = end

		while (lastYes - lastNo > 1) {
			let mid = Math.floor((lastNo + lastYes) / 2)

			if (func(mid) != searchVal) {
				lastNo = mid
			} else {
				lastYes = mid
			}
		}

		return lastYes
	}
}

alpha = "abcdefghijklmnopqrstuvwxyz"
ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

utils.prime = utils.isPrime

M = utils.createMap

N = utils.emptyArray

O = utils.getObject

L = utils.log
LC = utils.logCopy

R = utils.range = utils.signAgnosticInclusiveRange

U = function U(n) {
	return utils.emptyArray(n, (e, i) => i + 1)
}

Z = function Z(n) {
	return utils.emptyArray(n, (e, i) => i)
}

for (let i of Object.getOwnPropertyNames(Math)) {
	if (Math[i] instanceof Function) {
		globalThis[i] = Math[i]
	}
}

defaultPartNum = 1

A = function A(ans, part = 0) {
	if (part < 1000 && typeof ans != "number") {
		console.warn("Tried to submit non-number; cancelled. To override, add 1000 to part number.")
		return
	}
	
	part %= 1000
	
	let day = +location.href.match(/(\d+)\/input/)[1]

	if (part != 1 && part != 2) {
		part = defaultPartNum
		console.warn(`Remember to specify part number! Defaulting to ${part}`)
	}

	console.log(`Submitting ${ans} for part ${part}`)

	let queryString = new URLSearchParams({
		"level": part.toString(),
		"answer": ans.toString()
	}).toString()

	utils.fetchText(location.href.replace("input", "answer"), {
		"headers": {
			"content-type": "application/x-www-form-urlencoded"
		},
		"body": queryString,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	}).then((text) => {
		if (text.includes("That's the right answer!")) {
			defaultPartNum = 2

			if (day == 25) {
				A(0, 2)
				setTimeout(() => A(0, 2), 1000)
			}
		}

		console.log(text.match(/<article([\s\S]+?)article>/)[0].replace(/<.+?>/g, "").replace(/rank \d+/g, "???").replace(/ and gained \d+ points!/g, "."))
	})

	return ans
}

B = function B(ans, part = 0) {
	return A(ans, part + 2)
}

I = async function I(num) {
	let url = location.href.match(/^(.+)\/day/)[1] + "/day/" + num + "/input"
	history.pushState({}, "", url)

	let text = await utils.fetchText(url)
	a = (document.body.children[0] ?? document.body).innerText = text.trimEnd()
	defaultPartNum = 1
}

II = async function II(num) {
	if (window.aocTimeout) {
		clearTimeout(window.aocTimeout)
	}

	window.aocTimeout = setTimeout(() => I(num), new Date().setHours(21, 0, 2, 0) - new Date().getTime())
}

