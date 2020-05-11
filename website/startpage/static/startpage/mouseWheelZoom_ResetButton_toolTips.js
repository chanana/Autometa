const tsvFile = d3.select("#tsvFile").attr("tsvFile");
var chartBox = document.querySelector("#graphics_2d");

const chartBoxWidth = chartBox.getBoundingClientRect().width;
// make height and width same for ease
// const chartBoxHeight = chartBoxWidth;

var margin = {
  top: 0.1 * chartBoxWidth,
  right: 0.1 * chartBoxWidth,
  bottom: 0.1 * chartBoxWidth,
  left: 0.1 * chartBoxWidth
},
  width = chartBoxWidth - margin.left - margin.right,
  height = chartBoxWidth - margin.top - margin.bottom;

const getChosenXAxis = function () {
  return document.getElementById("choices_graphics_2d_x").value;
}
const getChosenYAxis = function () {
  return document.getElementById("choices_graphics_2d_y").value;
}
// var chosenRadius = "completeness";
// var xTipLabel = "Completeness: ";
// var yTipLabel = "Purity: ";

// Retrieve data from the TSV file and execute everything below
d3.tsv(tsvFile).then(data => {

  // parse data
  data.forEach(function (d) {
    d.coverage = +d.coverage;
    d.contig_length = +d.contig_length;
    d.completeness = +d.completeness;
    d.purity = +d.purity;
    d.x = +d.x;
    d.y = +d.y;
    d.GC = +d.GC;
    d.contig_length = +d.contig_length;
  });

  // init x scale
  var x = d3.scaleLinear()
    .domain(d3.extent(data, d => d[getChosenXAxis()]))
    .range([0, width])
    .nice();
  // init y scale
  var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[getChosenYAxis()]))
    .range([height, 0])
    .nice();
  // init r scale
  var r = d3.scaleLog()
    .domain(d3.extent(data, d => d['contig_length']))
    .range([5, 25])

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function (d) { return "Contig: " + d['contig'] + "<br>Cluster: " + d['cluster'] });

  //zoom stuff
  var zoom = d3.zoom()
    .scaleExtent([1, 50])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomFunction);

  // init x axis
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3.select("#graphics_2d")
    .append("svg")
    .attr("width", chartBoxWidth)
    .attr("height", chartBoxWidth)
    .attr("fill", "transparent")
    .append("g")
    .attr("class", "zoomOnThisElement")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.call(tip);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  var gxAxis = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  var gyAxis = svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

  var scatter = svg.append('svg')
    .attr("class", "scatter")
    .attr("width", width)
    .attr("height", height);

  scatter.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d[getChosenXAxis()]))
    .attr("cy", d => y(d[getChosenYAxis()]))
    .attr("r", d => r(d['contig_length']))
    .attr("fill", "#89bdd3")
    .attr("opacity", ".5")

  // update x axis
  function updateX() {
    let field = this.value;

    x.domain(d3.extent(data, d => d[field]))
      .nice();

    // transition x axis
    gxAxis.transition()
      .duration(750)
      .call(xAxis.scale(x));

    svg.selectAll('circle')
      .data(data)
      .transition()
      .duration(750)
      .attr("cx", d => x(d[field]))
      .attr("cy", d => y(d[getChosenYAxis()]))
      .attr("r", d => r(d['contig_length']));
  }

  function updateY() {
    let field = this.value;
    y.domain(d3.extent(data, d => d[field]))
      .nice();

    // transition x axis
    gyAxis.transition()
      .duration(750)
      .call(yAxis.scale(y));

    svg.selectAll('circle')
      .data(data)
      .transition()
      .duration(750)
      .attr("cx", d => x(d[getChosenXAxis()]))
      .attr("cy", d => y(d[field]));

  }
  d3.select("#choices_graphics_2d_x").on("change", updateX);
  d3.select("#choices_graphics_2d_y").on("change", updateY);

  function zoomFunction() {

    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    // update axes with these new boundaries
    gxAxis.call(xAxis.scale(newX));
    gyAxis.call(yAxis.scale(newY));

    // update circle position
    scatter.selectAll("circle")
      .attr('cx', d => newX(d[getChosenXAxis()]))
      .attr('cy', d => newY(d[getChosenYAxis()]))
  }

  // zoom toggle functionality; https://stackoverflow.com/a/29762389/9206532
  var zoomEnabled;

  var zoomToggle = d3.select("#zoom_toggle")
    .on("click", toggleZoom);

  function toggleZoom() {
    zoomEnabled = !zoomEnabled;
    if (zoomEnabled) {
      d3.select(".zoomOnThisElement")
        .call(zoom);
      console.log(zoomEnabled)
    } else {
      d3.select(".zoomOnThisElement")
        .on(".zoom", null)
      console.log(zoomEnabled)
    }
    zoomToggle.node().innerText = 'Zoom is ' + (zoomEnabled ? 'enabled' : 'disabled');
  }

  // zoom reset button
  // https://observablehq.com/@d3/programmatic-zoom
  // https://github.com/d3/d3-zoom/issues/107
  d3.select("#zoom_reset").on("click", resetZoom);
  function resetZoom() {
    d3.select(".zoomOnThisElement")
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity)
  }

  var tooltipsEnabled;

  var tooltipToggle = d3.select("#tooltip_toggle")
    .on("click", toggleTooltips);

  function toggleTooltips() {
    tooltipsEnabled = !tooltipsEnabled;
    if (tooltipsEnabled) {
      d3.selectAll("circle")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    } else {
      d3.selectAll("circle")
        .on("mouseover", null)
        .on("mouseover", null);
    }
    tooltipToggle.node().innerText = "Tooltips are " + (tooltipsEnabled ? 'enabled' : 'disabled');
  }
});