const svg = d3.select('svg');

const height = +svg.attr('height');
const width = +svg.attr('width');

const g = svg
    .append('g')
    .attr("transform", `translate(${width / 2},${height / 2})`);

const face = g
    .append('circle')
    .attr('r', height / 2)
    .attr('fill', 'yellow')
    .attr('stroke', 'black');

const eyeSpacing = 100;
const eyeYOffset = -70;
const eyeRadius = 40;
const eyeBrowWidth = 70;
const eyeBrowHeight = 15;
const eyeBrowYOffset = -70;

const eyesG = g
    .append('g')
    .attr("transform", `translate(0,${eyeYOffset})`);

const leftEye = eyesG
    .append('circle')
    .attr('r', eyeRadius)
    .attr('cx', -eyeSpacing)

const rightEye = eyesG
    .append('circle')
    .attr('r', eyeRadius)
    .attr('cx', eyeSpacing)

const eyeBrowsG = eyesG
    .append('g')
    .attr("transform", `translate(0,${eyeBrowYOffset})`);

eyeBrowsG
    .transition().duration(2000)
    .attr("transform", `translate(0,${eyeBrowYOffset - 50})`)
    .transition().duration(2000)
    .attr("transform", `translate(0,${eyeBrowYOffset})`)

const leftEyeBrow = eyeBrowsG
    .append('rect')
    .attr('x', -eyeSpacing - eyeBrowWidth / 2)
    .attr('width', eyeBrowWidth)
    .attr('height', eyeBrowHeight)

const rightEyeBrow = eyeBrowsG
    .append('rect')
    .attr('x', eyeSpacing - eyeBrowWidth / 2)
    .attr('width', eyeBrowWidth)
    .attr('height', eyeBrowHeight)

const smile = g
    .append('path')
    .attr('d', d3.arc()({
        innerRadius: 150,
        outerRadius: 170,
        startAngle: Math.PI / 2,
        endAngle: Math.PI * 3 / 2
    }))