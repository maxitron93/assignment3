// Load in the data
const rawData = JSON.parse(originalData);

// Set Chart Dimensions
const chartWidth = 1000
const chartHeight = 500
const chartGap = 50

// Set XY scales
let xValues = []
let yValues = []
rawData['nodes'].forEach((el) => {
	xValues.push(el['x'])
	yValues.push(el['y'])
})
let scaleX = d3.scaleLinear()
	.domain([d3.min(xValues), d3.max(xValues)])
	.range([0 + chartGap, chartWidth - chartGap])
let scaleY = d3.scaleLinear()
	.domain([d3.min(yValues), d3.max(yValues)])
	.range([chartHeight - chartGap, chartGap]) // Invert y-axis

// Set Circle Radius Scale
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
let scaleDownValueRadius = 40
let scaleR = d3.scaleLinear()
	.domain([d3.min(amounts), d3.max(amounts)])
	.range([d3.min(amounts) / scaleDownValueRadius, d3.max(amounts) / scaleDownValueRadius])

// Set Line Thickness Scale
let trades = []
rawData['links'].forEach((link) => {
	trades.push(link['amount'])
})
scaleDownValueThickness = 100
let scaleT = d3.scaleLinear()
	.domain([d3.min(trades), d3.max(trades)])
	.range([d3.min(trades) / scaleDownValueThickness, d3.max(trades) / scaleDownValueThickness])

// Create Chart Area
let svg = d3.select('#network_container')
	.append('svg')
	.attr('width', chartWidth)
	.attr('height', chartHeight)

// Set Colors
let link_color_full = 'rgb(100,100,100)'
let link_color_transparent = 'rgba(100,100,100,0.1)'
let node_color_full = 'rgb(50,115,170)'
let node_color_transparent = 'rgb(215,230,250)'

// Create Links
nodeData = {}
rawData['nodes'].forEach((node) => {
	nodeData[node['id']] = {
		x: node['x'],
		y: node['y']
	}
})
svg.selectAll('line')
	.data(rawData['links'])
	.enter()
	.append('line')
	.attr('x1', (link_data) => {
		return scaleX(nodeData[link_data['node01']]['x']) + 'px'
	})
	.attr('y1', (link_data) => {
		return scaleY(nodeData[link_data['node01']]['y']) + 'px'
	})
	.attr('x2', (link_data) => {
		return scaleX(nodeData[link_data['node02']]['x']) + 'px'
	})
	.attr('y2', (link_data) => {
		return scaleY(nodeData[link_data['node02']]['y']) + 'px'
	})
	.style('stroke', link_color_full)
	.style('stroke-width', (link_data) => {
		return scaleT(link_data['amount']) + 'px'
	})
	.style('stroke-linecap', 'round')
	.attr('class', (link_data) => {
		return 'link ' + link_data['node01'] + ' ' + link_data['node02']
	})

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
	.attr('fill', node_color_full)
	.attr('class', (node_data) => {
		return 'node ' + node_data['id']
	})
	.on('mouseover', handleMouseOver)
	.on('mouseout', handleMouseOut)

// Add hover interactivity
let nodes = document.querySelectorAll('.node')
let links = document.querySelectorAll('.link')
let node_links_count = {}
rawData['nodes'].forEach((node) => {
	node_links_count[node['id']] = 0
})
rawData['links'].forEach((link) => {
	node_links_count[link['node01']] += 1
	node_links_count[link['node02']] += 1
})

function handleMouseOver(node_data) {
	// Make other nodes transparent
	nodes.forEach((node) => {
		if(node_data['id'] != node.classList[1]) {
			node.style.fill = node_color_transparent
		}
	})
	// Make other links transparent
	links.forEach((link) => {
		if(node_data['id'] != link.classList[1] && node_data['id'] != link.classList[2]) {
			link.style.stroke = link_color_transparent
		}
	})
	// Show tooltip
	let x = scaleX(node_data['x'])
	let y = scaleY(node_data['y'])
	d3.select('#tooltip')
		.style('left', (x - 150) + 'px')
		.style('top', (y - 90) + 'px')
		.style('display', 'block')
	d3.select('#amount_traded')
		.text(() => {
			return site_amounts[node_data['id']]
		})
	d3.select('#connected_locations')
		.text(() => {
			return node_links_count[node_data['id']]
		})
		
		
		
} 
function handleMouseOut(node_data) {
	// Make all nodes full color
	nodes.forEach((node) => {
		node.style.fill = node_color_full
	})
	// Make all links full color
	links.forEach((link) => {
		link.style.stroke = link_color_full
	})
	// Hide tooltip
	d3.select('#tooltip')
		.style('display', 'none')
}
