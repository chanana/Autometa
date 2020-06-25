var X = [],
  Y = [],
  colors = [],
  radius,
  radii = [];

// mapColorToString from https://stackoverflow.com/a/3426956/9206532
function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
function intToRGB(i) {
  var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "#" + "00000".substring(0, 6 - c.length) + c;
}
// usage: intToRGB(hashCode(your_string))

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

var tsvFile = d3.select("#tsvFile").attr("tsvFile");
var tsvData = d3.tsv(tsvFile).then(data => {
  if (getChosenRadius() === "contig_length") {
    radius = d3.scaleLog()
      .domain(d3.extent(data, d => d[getChosenRadius()]))
      .range([1, 25]);
  } else {
    radius = d3.scaleLinear()
      .domain(d3.extent(data, d => d[getChosenRadius()]))
      .range([1, 25]);
  }

  data.forEach((d, i) => {
    X[i] = +d.x;
    Y[i] = +d.y;
    d.contig_length = +d.contig_length;
    colors[i] = intToRGB(hashCode(d.phylum));
    radii[i] = radius(d[getChosenRadius()]);
  });

  var data = [{
    type: "scattergl",
    mode: "markers",
    marker: {
      line: {
        width: 0
      },
      color: colors,
      opacity: 0.5,
      size: 1
    },
    x: X,
    y: Y
  }];

  Plotly.newPlot('graphics_2d', data)
})
