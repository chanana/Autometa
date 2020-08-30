const tsvFile = d3.select("#tsvFile").attr("tsvFile");
var chartBox = document.querySelector("#graphics_2d");

const chartBoxWidth = chartBox.getBoundingClientRect().width;

var margin = {
  top: 0.1 * chartBoxWidth,
  right: 0.1 * chartBoxWidth,
  bottom: 0.1 * chartBoxWidth,
  left: 0.1 * chartBoxWidth
},
  width = chartBoxWidth - margin.left - margin.right,
  height = chartBoxWidth - margin.top - margin.bottom;

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

const getChosenCircleColor = function () {
  let e = document.getElementById("choices_graphics_2d_circle_color");
  return e.value;
}

const getChosenRadius = function () {
  let e = document.getElementById("choices_graphics_2d_circle_radius");
  return e.value;
}
// var chosenRadius = "completeness";
// var xTipLabel = "Completeness: ";
// var yTipLabel = "Purity: ";

// Retrieve data from the TSV file and execute everything below
d3.tsv(tsvFile, row => {// receives a row, its index and an array of column keys
  // https://stackoverflow.com/a/50519586
  row.x = +row.x
  row.y = +row.y
  row.contig_length = +row.contig_length
  row.coverage = +row.coverage
  //   // d.completeness = +d.completeness;
  //   // d.purity = +d.purity;
  //   // d.gc = +d.GC;
  return row
}).then(data => {
  // recieves an array of rows with a property "columns" which is an array of the original column names
  // ----------------------------------------------------------------------------------------
  // convex hull code
  // ----------------------------------------------------------------------------------------
  // setup axes
  var xHull = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width])
    .nice();

  var yHull = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([height, 0])
    .nice();

  // color
  var color = d3.scaleOrdinal()
    .range(d3.schemeTableau10);

  // //zoom stuff
  // var zoomHull = d3.zoom()
  //   .scaleExtent([1, 50])
  //   .extent([[0, 0], [width, height]])
  //   .on("zoom", zoomFunctionHull);

  // init x axis
  var xHullAxis = d3.axisBottom(xHull);
  var yHullAxis = d3.axisLeft(yHull);

  // draw svg box
  var svgHull = d3.select("#graphics_convex_hull")
    .append("svg")
    .attr("width", chartBoxWidth)
    .attr("height", chartBoxWidth)
    .attr("fill", "transparent")
    .append("g")
    // .attr("class", "zoomOnThisElementHull")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svgHull.append("rect")
    .attr("width", width)
    .attr("height", height);

  var gxHullAxis = svgHull.append("g")
    .attr("class", "axisHull axis--x")
    .attr("transform", `translate(0, ${height})`)
    .call(xHullAxis)

  svgHull.append("text")
    .attr("class", "label--x")
    .attr("transform", `translate(${width / 2}, ${margin.top / 2 + height})`)
    .attr('text-anchor', 'middle')
    .attr("fill", "#000")
    .text("BH-tSNE X");

  var gyHullAxis = svgHull.append("g")
    .attr("class", "axisHull axis--y")
    .call(yHullAxis);

  svgHull.append("text")
    .attr("class", "label--y")
    .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
    .attr('text-anchor', 'middle')
    .attr('fill', '#000')
    .text("BH-tSNE Y");

  var poly = svgHull.append('svg')
    .attr("class", "poly")
    .attr("width", width)
    .attr("height", height);

  // ----------------------------------------------------------------------------------------
  // geometric median code
  // ----------------------------------------------------------------------------------------
  // setup axes
  var xGM = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width])
    .nice();

  var yGM = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([height, 0])
    .nice();

  // //zoom stuff
  // var zoomGeometricMedian = d3.zoom()
  //   .scaleExtent([1, 50])
  //   .extent([[0, 0], [width, height]])
  //   .on("zoom", zoomFunctionGeometricMedian);

  // init x axis
  var xGMAxis = d3.axisBottom(xGM);
  var yGMAxis = d3.axisLeft(yGM);

  // draw svg box
  var svgGM = d3.select("#graphics_geometric_median")
    .append("svg")
    .attr("width", chartBoxWidth)
    .attr("height", chartBoxWidth)
    .attr("fill", "transparent")
    .append("g")
    // .attr("class", "zoomOnThisElementHull")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svgGM.append("rect")
    .attr("width", width)
    .attr("height", height);

  var gxGMAxis = svgGM.append("g")
    .attr("class", "axisGM axis--x")
    .attr("transform", `translate(0, ${height})`)
    .call(xGMAxis)

  svgGM.append("text")
    .attr("class", "label--x")
    .attr("transform", `translate(${width / 2}, ${margin.top / 2 + height})`)
    .attr('text-anchor', 'middle')
    .attr("fill", "#000")
    .text("BH-tSNE X");

  var gyGMAxis = svgGM.append("g")
    .attr("class", "axisGM axis--y")
    .call(yGMAxis);

  svgGM.append("text")
    .attr("class", "label--y")
    .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
    .attr('text-anchor', 'middle')
    .attr('fill', '#000')
    .text("BH-tSNE Y");

  var centroids = svgGM.append('svg')
    .attr("class", "centroids")
    .attr("width", width)
    .attr("height", height);

  //-----
  // poly stuff
  //-----

  var points, hull, line;

  var dataByCluster = d3.nest().key(d => d.cluster).entries(data)
  // dataByCluster is an array of objects each containing property "key" with the
  // cluster and a "values" which is an array of (objects) rows from that cluster 

  // function to calculate the centroid given an array of pionts
  // https://stackoverflow.com/a/9939071
  function getPolygonCentroid(pts) {
    var first = pts[0], last = pts[pts.length - 1];
    if (first[0] != last[0] || first[1] != last[1]) pts.push(first);
    var twicearea = 0,
      x = 0, y = 0,
      nPts = pts.length,
      p1, p2, f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
      p1 = pts[i]; p2 = pts[j];
      f = p1[0] * p2[1] - p2[0] * p1[1];
      twicearea += f;
      x += (p1[0] + p2[0]) * f;
      y += (p1[1] + p2[1]) * f;
    }
    f = twicearea * 3;
    return { x: x / f, y: y / f };
  }


  const drawGraph = () => {// receives default "event" which has a "target" containing various attributes
    var clickedData = dataByCluster.filter(d => d.key === event.target.id)[0].values;
    console.log(clickedData)
    // event.target.setAttribute("stroke-width", 2)
    var idToChange = "#" + event.target.id
    // first reset attrs to defaults as drawn
    centroids.selectAll("circle")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4)
    poly.selectAll("path")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.1)

    // now change the selected id
    centroids.select(idToChange)
      .attr("stroke-width", 2)
      .attr("fill-opacity", 1)
    poly.select(idToChange)
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.7)

    // ------------------------------------------------------------------------------------------
    // Clicked Graph
    // ------------------------------------------------------------------------------------------

    // destroy old graph if that exists
    d3.selectAll(".clickedData").remove()

    // init x scale
    if (getChosenXAxis().value === "contig_length") {
      var x = d3.scaleLog()
        .domain(d3.extent(clickedData, d => d[getChosenXAxis().value]))
        .range([0, width])
        .nice();
    } else {
      var x = d3.scaleLinear()
        .domain(d3.extent(clickedData, d => d[getChosenXAxis().value]))
        .range([0, width])
        .nice();
    }

    // init y scale
    if (getChosenYAxis().value === "contig_length") {
      var y = d3.scaleLog()
        .domain(d3.extent(clickedData, d => d[getChosenYAxis().value]))
        .range([height, 0])
        .nice();
    } else {
      var y = d3.scaleLinear()
        .domain(d3.extent(clickedData, d => d[getChosenYAxis().value]))
        .range([height, 0])
        .nice();
    }

    // init r scale
    if (getChosenRadius() === "contig_length") {
      var radius = d3.scaleLog()
        .domain(d3.extent(clickedData, d => d[getChosenRadius()]))
        .range([5, 25]);
    } else {
      var radius = d3.scaleLinear()
        .domain(d3.extent(clickedData, d => d[getChosenRadius()]))
        .range([5, 25]);
    }

    // init x axis
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // init tooltips on hover
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function (d) { return "contig: " + d['contig'] });
    // .html(function (d) { return "Contig: " + d['contig'] + "<br>Cluster: " + d['cluster'] });

    //zoom stuff
    var zoom = d3.zoom()
      .scaleExtent([1, 50])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomFunction);

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3.select("#graphics_2d")
      .append("svg")
      .attr("id", clickedData[0].cluster)
      .attr("class", "clickedData")
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
      .call(xAxis)

    svg.append("text")
      .attr("class", "label--x")
      .attr("transform", `translate(${width / 2}, ${margin.top / 2 + height})`)
      .attr('text-anchor', 'middle')
      .attr("fill", "#000")
      .text(getChosenXAxis().text);

    var gyAxis = svg.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

    svg.append("text")
      .attr("class", "label--y")
      .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .text(getChosenYAxis().text);

    var scatter = svg.append('svg')
      .attr("class", "scatter")
      .attr("width", width)
      .attr("height", height);

    scatter.selectAll("dot")
      .data(clickedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d[getChosenXAxis().value]))
      .attr("cy", d => y(d[getChosenYAxis().value]))
      .attr("r", d => radius(d[getChosenRadius()]))
      .attr("fill", d => color(d[getChosenCircleColor()]))
      .attr("fill-opacity", ".5")

    // update x axis
    function updateX() {
      let field = this.value;
      if (field === 'contig_length') {
        x = d3.scaleLog()
          .domain(d3.extent(clickedData, d => d[getChosenXAxis().value]))
          .range([0, width])
          .nice();
      } else {
        x = d3.scaleLinear()
          .domain(d3.extent(clickedData, d => d[getChosenXAxis().value]))
          .range([0, width])
          .nice();
      }
      // reset the zoom state so that the zoom event understands that you are no longer zoomed.
      resetZoom();

      // transition x axis
      gxAxis.transition()
        .duration(750)
        .call(xAxis.scale(x));

      // transition circles
      svg.selectAll('circle')
        .data(clickedData)
        .transition()
        .duration(750)
        .attr("cx", d => x(d[field]))
        .attr("cy", d => y(d[getChosenYAxis().value]))

      // transition x axis label
      svg.select('.label--x')
        .text(getChosenXAxis().text);
    }

    function updateY() {
      let field = this.value;
      if (field === 'contig_length') {
        y = d3.scaleLog()
          .domain(d3.extent(clickedData, d => d[getChosenYAxis().value]))
          .range([height, 0])
          .nice();
      } else {
        y = d3.scaleLinear()
          .domain(d3.extent(clickedData, d => d[getChosenYAxis().value]))
          .range([height, 0])
          .nice();
      }
      // reset the zoom state so that the zoom event understands that you are no longer zoomed.
      resetZoom();

      // transition x axis
      gyAxis.transition()
        .duration(750)
        .call(yAxis.scale(y));

      svg.selectAll('circle')
        .data(clickedData)
        .transition()
        .duration(750)
        .attr("cx", d => x(d[getChosenXAxis().value]))
        .attr("cy", d => y(d[field]));

      // transition x axis label
      svg.select('.label--y')
        .text(getChosenYAxis().text);
    }

    // Event Listeners for Changing axes
    d3.select("#choices_graphics_2d_x").on("change", updateX);
    d3.select("#choices_graphics_2d_y").on("change", updateY);

    // update circle colors on change
    function updateColors() {
      let field = this.value;

      svg.selectAll('circle')
        .transition()
        .attr("fill", d => color(d[getChosenCircleColor()]));
    }
    d3.select("#choices_graphics_2d_circle_color").on("change", updateColors);

    // update circle radius on change
    function updateRadius() {
      let field = this.value;
      if (field === "contig_length") {
        radius = d3.scaleLog()
          .domain(d3.extent(clickedData, d => d[getChosenRadius()]))
          .range([5, 25]);
      } else {
        radius = d3.scaleLinear()
          .domain(d3.extent(clickedData, d => d[getChosenRadius()]))
          .range([5, 25]);
      }

      radius.domain(d3.extent(clickedData, d => d[field]));

      svg.selectAll('circle')
        .transition()
        .duration(750)
        .attr("r", d => radius(d[getChosenRadius()]));
    }
    d3.select("#choices_graphics_2d_circle_radius").on("change", updateRadius);

    function zoomFunction() {
      // recover the new scale
      var newX = d3.event.transform.rescaleX(x);
      var newY = d3.event.transform.rescaleY(y);

      // update axes with these new boundaries
      gxAxis.call(xAxis.scale(newX));
      gyAxis.call(yAxis.scale(newY));

      // update circle position
      scatter.selectAll("circle")
        .attr('cx', d => newX(d[getChosenXAxis().value]))
        .attr('cy', d => newY(d[getChosenYAxis().value]))
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

  }

  dataByCluster.forEach(d => {

    // creates a list of clusters; currently unused.
    // TODO: either remove this or use it in some way. 
    d3.select("#cluster-selection")
      .append("option")
      .text(d.key)
      .attr("value", d.key)

    if (d.key === "") {
      return
    }
    if (d.values.length < 3) { // convex hull for less than three points doesn't exist  
      return
    }

    // each d contains a key (binXXXX) and values (array of objects)
    points = d.values.map(d => [xHull(d.x), yHull(d.y)]);
    hull = d3.polygonHull(points);
    // console.log(hull) // each hull is an array of [x, y] point pairs i.e. an array of two element arrays
    centroid = getPolygonCentroid(hull);
    // console.log(hull)
    // console.log(centroid)
    // console.log(d.key)
    line = d3.line()
      .curve(d3.curveLinearClosed);

    poly.append("path")
      .attr("d", line(hull))
      .attr("stroke", color(d.key))
      .attr("stroke-width", 1)
      .attr("fill", color(d.key))
      .attr("fill-opacity", 0.1)
      .attr("id", d.key)
      .on("mouseover", () => event.target.setAttribute('fill-opacity', 0.7))
      .on("mouseout", () => event.target.setAttribute('fill-opacity', 0.1))
      .on("click", drawGraph)

    centroids.append("circle")
      .attr("class", "dot")
      .attr("id", d.key)
      .attr("cx", centroid.x)
      .attr("cy", centroid.y)
      .attr("r", 10)
      .attr("fill", color(d.key))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4)
      .on("mouseover", () => event.target.setAttribute('fill-opacity', 1))
      .on("mouseout", () => event.target.setAttribute('fill-opacity', 0.4))
      .on("click", drawGraph)

    // https://observablehq.com/@d3/zoom-to-bounding-box Possible code to look at for
    // bounding box based zoom i.e. click on a path and it'll zoom to that path in focus
    // and center of screen
  });

  const getChosenCluster = function () {
    let e = document.getElementById("cluster-selection");
    return {
      value: e.value,
      text: e.options[e.selectedIndex].text
    };
  }


  // // ------------------------------------------------------------------------------------------
  // // Clicked Graph
  // // ------------------------------------------------------------------------------------------
  // // init x scale
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

  // // init y scale
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

  // // init r scale
  // if (getChosenRadius() === "contig_length") {
  //   var radius = d3.scaleLog()
  //     .domain(d3.extent(data, d => d[getChosenRadius()]))
  //     .range([5, 25]);
  // } else {
  //   var radius = d3.scaleLinear()
  //     .domain(d3.extent(data, d => d[getChosenRadius()]))
  //     .range([5, 25]);
  // }

  // var tip = d3.tip()
  //   .attr('class', 'd3-tip')
  //   .html(function (d) { return "Cluster: " + d['cluster'] });
  // // .html(function (d) { return "Contig: " + d['contig'] + "<br>Cluster: " + d['cluster'] });

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

});