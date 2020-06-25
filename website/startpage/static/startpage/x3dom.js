const height = width = document.getElementById("graphics_2d").clientWidth;

var x3d = d3.select("#graphics_2d").append("x3d")
  .attr("width", width)
  .attr("height", height);

d3.select('.x3dom-canvas')
  .attr("width", 2 * width)
  .attr("height", 2 * height);

var view_pos = [80, 25, 80];
var fov = 0.8;
var view_or = [0, 1, 0, 0.8];

var scene = x3d.append("scene");

scene.append("viewpoint")
  .attr("position", view_pos.join(" "))
  .attr("orientation", view_or.join(" "))
  .attr("fieldOfView", fov);

var cube = scene.append('shape');
cube.append('box');
cube.append("appearance")
  .append("material")
  .attr("diffuseColor", 'red');

var makeSolid = function (selection, color) {
  selection.append("appearance")
    .append("material")
    .attr("diffuseColor", color || "black");
  return selection;
};
cube.call(makeSolid, 'red');

var x = d3.scaleLinear().range([0, 40]);
var y = d3.scaleLinear().domain([0, 4]).range([0, 40]);
var z = d3.scaleLinear().range([0, 40]);
var xAxis = d3_x3dom_axis.x3domAxis('x', 'z', x)
  .tickSize(z.range()[1] - z.range()[0])
scene.append('group')
  .attr('class', 'xAxis')
  .call(xAxis)
  .select('.domain').call(makeSolid, 'blue');