// Load in the data
const rawData = JSON.parse(data);

// Set Chart Dimensions
const chartWidth = 1000
const chartHeight = 500

// Set XY scales
let xValues = []
let yValues = []
rawData['nodes'].forEach((el) => {
	xValues.push(el['x'])
	yValues.push(el['y'])
})
let scaleX = d3.scaleLinear()
	.domain([d3.min(xValues), d3.max(xValues)])
	.range([0 + 50, chartWidth - 50])
let scaleY = d3.scaleLinear()
	.domain([d3.min(yValues), d3.max(yValues)])
	.range([chartHeight - 50, 50]) // Invert y-axis

// Set radius scales
let site_amounts = {}
rawData['nodes'].forEach((node) => {
	let site = node['id']
	site_amounts[site] = 0
})
rawData['links'].forEach((link) => {
	site_amounts[link['node01']] += link['amount']
	site_amounts[link['node02']] += link['amount']
})
let amounts = []
rawData['nodes'].forEach((node) => {
	amounts.push(site_amounts[node['id']])
})
let scaleDownValue = 40
let scaleR = d3.scaleLinear()
	.domain([d3.min(amounts), d3.max(amounts)])
	.range([d3.min(amounts) / scaleDownValue, d3.max(amounts) / scaleDownValue])

// Create Chart Area
let svg = d3.select('#network_container')
	.append('svg')
	.attr('width', chartWidth)
	.attr('height', chartHeight)

// Create Nodes
svg.selectAll('circle')
	.data(rawData['nodes'])
	.enter()
	.append('circle')
	.attr('cx', (node_data) => {
		let cx = node_data['x']
		return scaleX(cx) + 'px'
	})
	.attr('cy', (node_data) => {
		let cy = node_data['y']
		return scaleY(cy) + 'px'
	})
	.attr('r', (node_data) => {
		let r = site_amounts[node_data['id']]
		return scaleR(r)
	})
	.attr('fill', 'red')



// Text for X, Y, Trading Amount
svg.selectAll('text')
	.data(rawData['nodes'])
	.enter()
	.append('text')
	.text((node_data) => {
		return node_data['x'] + ', ' + node_data['y'] + ', ' + site_amounts[node_data['id']]
	})
	.attr('x', (node_data) => {
		return scaleX(node_data['x']) +'px'
	})
	.attr('y', (node_data) => {
		return scaleY(node_data['y']) +'px'
	})