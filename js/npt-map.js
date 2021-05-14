// Create SVG containers 
var margin = {left:5, right:20, bottom:20, top:20};
var container = div.append("div").attr("class","map-container");
var svg1 = container 
    .append("svg")
    .attr("class", "container1")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height);



// Data
var npt = data.npt;
var adk = data.adk;
var brd = data.brd;

// Scales 
var minLon = d3.min(adk, function(d) {return d.lon;});
var maxLon = d3.max(adk, function(d) {return d.lon;});
var minLat = d3.min(adk, function(d) {return d.lat;});
var maxLat = d3.max(adk, function(d) {return d.lat;});
var minVal = d3.min(adk, function(d) {return d.value;});
var maxVal = d3.max(adk, function(d) {return d.value;});

var xScale = d3.scaleLinear().domain([minLon,maxLon]).range([margin.left,width-margin.right]);  
var yScale = d3.scaleLinear().domain([minLat,maxLat]).range([height-margin.bottom,margin.top]);    
var eScale = d3.scaleLinear().domain([minVal,maxVal]).range([0,40]);


var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
let timeData = [];
npt.forEach(function(d) { timeData.push(parseTime(d.time)); });

// Path constructors
var line = d3.line()
             .x(function(d) { return xScale(d.lon); })
             .y(function(d) { return yScale(d.lat); });

var eline = d3.area()
              .defined(function(d) { return d.lon !== maxLon; })
              .x(function(d) { return xScale(d.lon); })
              .y0(yScale(minLat))
              .y1(function(d) { return yScale(d.lat)-eScale(d.value); });


// Elevation lines
var adkpath = svg1.append("path")
          .datum(data.adk)
          .attr("class","adk-path")
          .attr("d", eline);

// NPT path
var nptpath = svg1.append("path")
          .datum(data.npt)
          .attr("class", "npt-path")
          .attr("d", line);

// ADK Border
var adkbrd = svg1.append("path")
          .datum(data.brd)
          .attr("class", "adk-border")
          .attr("d", line);


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
  .attr("opacity", 0.0);
  
// Show the first point only
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







