// Create SVG containers 
var margin = {left:20, right:20, bottom:20, top:20};
var container = div.append("div").style("position", "relative");
var svg1 = container 
    .append("svg")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height);



// Data
var npt = data.npt;
var adk = data.adk;


// Scales 
var minLon = d3.min(adk, function(d) {return d.lon;});
var maxLon = d3.max(adk, function(d) {return d.lon;});
var minLat = d3.min(npt, function(d) {return d.lat;});
var maxLat = d3.max(npt, function(d) {return d.lat;});
var xScale = d3.scaleLinear().domain([minLon,maxLon]).range([margin.left,width-margin.right]);   // -76, -73
var yScale = d3.scaleLinear().domain([minLat,maxLat]).range([height-margin.bottom,margin.top]);    //  43,45

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
// dates for parks data
let timeData = [];
npt.forEach(function(d) { timeData.push(parseTime(d.time)); });


// Marker - set to transparent by default
var marker = svg1.selectAll("circle")
  .data(npt)
  .enter()
  .append("circle")
  .attr("id","trail-marker")
  .attr("class","trail-marker")
  .attr("cx", function(d) { return xScale(d.lon); })
  .attr("cy", function(d) { return yScale(d.lat); })
  .attr("r", 5)
  .style("fill", "#4682b4")
  .attr("opacity", 0.0);

svg1.selectAll("#trail-marker")
        .filter(function(d) { return parseTime(d.time).valueOf() == timeData[0].valueOf(); })
        .attr("opacity",1.0);

        
// Simple Slider
var sliderSimple = d3.sliderBottom()
    .min(d3.min(timeData))
    .max(d3.max(timeData))
    .marks(timeData)
    .width(0.5*width)
    .tickFormat(d3.timeFormat("%H:%M"))
    .ticks(5)
    .default(d3.min(timeData))
    .on('onchange', function(value) {
      var dataNew = npt.filter(function(d) { return parseTime(d.time).valueOf() == value.valueOf(); });
      svg1.selectAll("#trail-marker").attr("opacity",0.0);
      svg1.selectAll("#trail-marker")
        .filter(function(d) { return parseTime(d.time).valueOf() == value.valueOf(); })
        .attr("opacity",1.0);
    });



container.append('svg')
    .attr('width', width)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(' + 0.25*width + ',10)')
    .call(sliderSimple);


// Path
var line = d3.line()
             .x(function(d) { return xScale(d.lon); })
             .y(function(d) { return yScale(d.lat); });

var nptpath = svg1.append("path")
          .datum(data.npt)
          .attr("class", "npt-path")
          .attr("d", line)
          .style("fill", "none")
  				.style("stroke", "#4682b4")
  				.style("stroke-width",1.0)
  				.style("opacity",1.0);


