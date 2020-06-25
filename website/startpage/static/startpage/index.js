//
// Get X, Y, R, Color choices from user drop down selections
//
const getChosenXAxis = function () {
  let e = document.getElementById("choices_graphics_2d_x");
  return {
    value: e.value,
    text: e.options[e.selectedIndex].text
  };
}
const getChosenYAxis = function () {
  let e = document.getElementById("choices_graphics_2d_y");
  return {
    value: e.value,
    text: e.options[e.selectedIndex].text
  };
}
const getChosenRadius = function () {
  let e = document.getElementById("choices_graphics_2d_circle_radius");
  return e.value;
}
const getChosenCircleColor = function () {
  let e = document.getElementById("choices_graphics_2d_circle_color");
  return e.value;
}

//
// Get data from TSV file
//
const width = 900;
const height = 900;
const pointSeries = fc.seriesWebglPoint()
  .crossValue(d => d[getChosenXAxis().value])
  .mainValue(d => d[getChosenYAxis().value])
  .size(4)
  .decorate(program => {
    fc.pointFill().color([1, 0, 0, 1])(program);
    fc.pointAntiAlias()(program);

    const gl = program.context();
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA
    );
  });

const xExtent = fc.extentLinear()
  .accessors([d => d[getChosenXAxis().value]])
  .pad([0.1, 0.1]);

const yExtent = fc.extentLinear()
  .accessors([d => d[getChosenYAxis().value]])
  .pad([0.1, 0.1])

var tsvFile = d3.select("#tsvFile").attr("tsvFile");
d3.tsv(tsvFile, type).then(data => {

  const xScale = d3.scaleLinear().domain(xExtent(data));
  const xScaleCopy = xScale.copy();
  const yScale = d3.scaleLinear().domain(yExtent(data));
  const yScaleCopy = yScale.copy();

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height]
    ])
    .scaleExtent([1, 100])
    .translateExtent([
      [0, 0],
      [width, height]
    ])
    .on('zoom', () => {
      xScale.domain(d3.event.transform.rescaleX(xScaleCopy).domain());
      yScale.domain(d3.event.transform.rescaleY(yScaleCopy).domain());
      d3.select('d3fc-group')
        .node()
        .requestRedraw();
    });

  const decorate = selection => {
    selection
      .enter()
      .select('.plot-area')
      .on('measure.range', () => {
        xScaleCopy.range([0, d3.event.detail.width]);
        yScaleCopy.range([d3.event.detail.height, 0]);
      })
      .call(zoom);
  };

  const chart = fc
    .chartCartesian(xScale, yScale)
    .webglPlotArea(pointSeries)
    .xLabel('Mass (carats)')
    .yLabel('Price (US$)')
    .yTickFormat(d3.format('.3s'))
    .decorate(decorate);

  d3.select('#chart')
    .datum(data)
    .call(chart);
});

function type(d) {
  d.x = +d.x;
  d.y = +d.y;
  d.contig_length = +d.contig_length;
  d.coverage = +d.coverage;
  d.total_breadth = +d.total_breadth;
  d.bases = +d.bases;
  return d;
}

// //
// // Initialize X, Y, R, and color scales. d3fc is compatible with d3js for the most part so it should work?
// //
// // `contig_length` needs to be on a log scale since the the values span orders of magnitude.
// //
// if (getChosenXAxis().value === "contig_length") {
//   var x = d3.scaleLog()
//     .domain(d3.extent(data, d => d[getChosenXAxis().value]))
//     .range([0, width])
//     .nice();
// } else {
//   var x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d[getChosenXAxis().value]))
//     .range([0, width])
//     .nice();
// }
// if (getChosenYAxis().value === "contig_length") {
//   var y = d3.scaleLog()
//     .domain(d3.extent(data, d => d[getChosenYAxis().value]))
//     .range([height, 0])
//     .nice();
// } else {
//   var y = d3.scaleLinear()
//     .domain(d3.extent(data, d => d[getChosenYAxis().value]))
//     .range([height, 0])
//     .nice();
// }
// if (getChosenRadius() === "contig_length") {
//   var radius = d3.scaleLog()
//     .domain(d3.extent(data, d => d[getChosenRadius()]))
//     .range([5, 25]);
// } else {
//   var radius = d3.scaleLinear()
//     .domain(d3.extent(data, d => d[getChosenRadius()]))
//     .range([5, 25]);
// }
// var color = d3.scaleOrdinal()
//   .range(d3.schemeTableau10);



// //zoom stuff
// var zoom = d3.zoom()
//   .scaleExtent([1, 50])
//   .extent([[0, 0], [width, height]])
//   .on("zoom", zoomFunction);

// // init x axis
// var xAxis = d3.axisBottom(x);
// var yAxis = d3.axisLeft(y);

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// var svg = d3.select("#graphics_2d")
//   .append("svg")
//   .attr("width", chartBoxWidth)
//   .attr("height", chartBoxWidth)
//   .attr("fill", "transparent")
//   .append("g")
//   .attr("class", "zoomOnThisElement")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// svg.call(tip);

// svg.append("rect")
//   .attr("width", width)
//   .attr("height", height);

// var gxAxis = svg.append("g")
//   .attr("class", "axis axis--x")
//   .attr("transform", `translate(0, ${height})`)
//   .call(xAxis)

// svg.append("text")
//   .attr("class", "label--x")
//   .attr("transform", `translate(${width / 2}, ${margin.top / 2 + height})`)
//   .attr('text-anchor', 'middle')
//   .attr("fill", "#000")
//   .text(getChosenXAxis().text);

// var gyAxis = svg.append("g")
//   .attr("class", "axis axis--y")
//   .call(yAxis);

// svg.append("text")
//   .attr("class", "label--y")
//   .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
//   .attr('text-anchor', 'middle')
//   .attr('fill', '#000')
//   .text(getChosenYAxis().text);

// var scatter = svg.append('svg')
//   .attr("class", "scatter")
//   .attr("width", width)
//   .attr("height", height);

// scatter.selectAll("dot")
//   .data(data)
//   .enter().append("circle")
//   .attr("class", "dot")
//   .attr("cx", d => x(d[getChosenXAxis().value]))
//   .attr("cy", d => y(d[getChosenYAxis().value]))
//   .attr("r", d => radius(d[getChosenRadius()]))
//   .attr("fill", d => color(d[getChosenCircleColor()]))
//   .attr("opacity", ".5")

// // update x axis
// function updateX() {
//   let field = this.value;
//   if (field === 'contig_length') {
//     x = d3.scaleLog()
//       .domain(d3.extent(data, d => d[getChosenXAxis().value]))
//       .range([0, width])
//       .nice();
//   } else {
//     x = d3.scaleLinear()
//       .domain(d3.extent(data, d => d[getChosenXAxis().value]))
//       .range([0, width])
//       .nice();
//   }
//   // reset the zoom state so that the zoom event understands that you are no longer zoomed.
//   resetZoom();

//   // transition x axis
//   gxAxis.transition()
//     .duration(750)
//     .call(xAxis.scale(x));

//   // transition circles
//   svg.selectAll('circle')
//     .data(data)
//     .transition()
//     .duration(750)
//     .attr("cx", d => x(d[field]))
//     .attr("cy", d => y(d[getChosenYAxis().value]))

//   // transition x axis label
//   svg.select('.label--x')
//     .text(getChosenXAxis().text);
// }

// function updateY() {
//   let field = this.value;
//   if (field === 'contig_length') {
//     y = d3.scaleLog()
//       .domain(d3.extent(data, d => d[getChosenYAxis().value]))
//       .range([height, 0])
//       .nice();
//   } else {
//     y = d3.scaleLinear()
//       .domain(d3.extent(data, d => d[getChosenYAxis().value]))
//       .range([height, 0])
//       .nice();
//   }
//   // reset the zoom state so that the zoom event understands that you are no longer zoomed.
//   resetZoom();

//   // transition x axis
//   gyAxis.transition()
//     .duration(750)
//     .call(yAxis.scale(y));

//   svg.selectAll('circle')
//     .data(data)
//     .transition()
//     .duration(750)
//     .attr("cx", d => x(d[getChosenXAxis().value]))
//     .attr("cy", d => y(d[field]));

//   // transition x axis label
//   svg.select('.label--y')
//     .text(getChosenYAxis().text);
// }
// // Event Listeners for Changing axes
// d3.select("#choices_graphics_2d_x").on("change", updateX);
// d3.select("#choices_graphics_2d_y").on("change", updateY);

// // update circle colors on change
// function updateColors() {
//   let field = this.value;

//   svg.selectAll('circle')
//     .transition()
//     .attr("fill", d => color(d[getChosenCircleColor()]));
// }
// d3.select("#choices_graphics_2d_circle_color").on("change", updateColors);

// // update circle radius on change
// function updateRadius() {
//   let field = this.value;
//   if (field === "contig_length") {
//     radius = d3.scaleLog()
//       .domain(d3.extent(data, d => d[getChosenRadius()]))
//       .range([5, 25]);
//   } else {
//     radius = d3.scaleLinear()
//       .domain(d3.extent(data, d => d[getChosenRadius()]))
//       .range([5, 25]);
//   }

//   radius.domain(d3.extent(data, d => d[field]));

//   svg.selectAll('circle')
//     .transition()
//     .duration(750)
//     .attr("r", d => radius(d[getChosenRadius()]));
// }
// d3.select("#choices_graphics_2d_circle_radius").on("change", updateRadius);

// function zoomFunction() {

//   // recover the new scale
//   var newX = d3.event.transform.rescaleX(x);
//   var newY = d3.event.transform.rescaleY(y);

//   // update axes with these new boundaries
//   gxAxis.call(xAxis.scale(newX));
//   gyAxis.call(yAxis.scale(newY));

//   // update circle position
//   scatter.selectAll("circle")
//     .attr('cx', d => newX(d[getChosenXAxis().value]))
//     .attr('cy', d => newY(d[getChosenYAxis().value]))
// }

// // zoom toggle functionality; https://stackoverflow.com/a/29762389/9206532
// var zoomEnabled;

// var zoomToggle = d3.select("#zoom_toggle")
//   .on("click", toggleZoom);

// function toggleZoom() {
//   zoomEnabled = !zoomEnabled;
//   if (zoomEnabled) {
//     d3.select(".zoomOnThisElement")
//       .call(zoom);
//     console.log(zoomEnabled)
//   } else {
//     d3.select(".zoomOnThisElement")
//       .on(".zoom", null)
//     console.log(zoomEnabled)
//   }
//   zoomToggle.node().innerText = 'Zoom is ' + (zoomEnabled ? 'enabled' : 'disabled');
// }

// // zoom reset button
// // https://observablehq.com/@d3/programmatic-zoom
// // https://github.com/d3/d3-zoom/issues/107
// d3.select("#zoom_reset").on("click", resetZoom);
// function resetZoom() {
//   d3.select(".zoomOnThisElement")
//     .transition()
//     .duration(750)
//     .call(zoom.transform, d3.zoomIdentity)
// }

// var tooltipsEnabled;

// var tooltipToggle = d3.select("#tooltip_toggle")
//   .on("click", toggleTooltips);

// function toggleTooltips() {
//   tooltipsEnabled = !tooltipsEnabled;
//   if (tooltipsEnabled) {
//     d3.selectAll("circle")
//       .on("mouseover", tip.show)
//       .on("mouseout", tip.hide);
//   } else {
//     d3.selectAll("circle")
//       .on("mouseover", null)
//       .on("mouseover", null);
//   }
//   tooltipToggle.node().innerText = "Tooltips are " + (tooltipsEnabled ? 'enabled' : 'disabled');
// }
