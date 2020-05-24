const rawData = JSON.parse(data);

// Set Chart Dimensions
const chartWidth = 1000
const chartHeight = 550

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
		return cx + 'px'
	})
	.attr('cy', (node_data) => {
		let cy = node_data['y']
		return cy + 'px'
	})
	.attr('r', 20)
	.attr('fill', 'red')

