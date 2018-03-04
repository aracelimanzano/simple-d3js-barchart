// Simple refactorized D3js Bar Chart for 'Top Fake Words' visualization

var domElement = "body"
var drawLegend = true

let margin = null,
    width = null,
    height = null,
    svg = null,
    xScale = null,
    xAxis = null,
    yScale = null,
    yAxis = null
    totalWords = null;

totalWords = loadData();  // Load test data, may be replaced by read from JSON file
setupCanvasSize();  // Initilize dimensions
appendSvg(domElement);  // Add new SVG
setupScales();  // Initialize X, Y scales
setupAxis();  // Initialize X, Y axis
sortValuesDesc();  // Sort data by value DESC
setupScaleDomains();  // Specify domains for axis visualization
drawChart(drawLegend);  // Draw BarChart and optionally add a legend


function loadData() {
    // Sample of data for test, stored as array of JSON objects
    var data = [{
        "word": "Hillary",
        "frequency": "12"
    },
    {
        "word": "democrats",
        "frequency": "8"
    },
    {
        "word": "Russia",
        "frequency": "13"
    },
    {
        "word": "elections",
        "frequency": "14"
    },
    {
        "word": "US",
        "frequency": "10"
    },
    {
        "word": "Korea",
        "frequency": "4"
    },
    {
        "word": "Trump",
        "frequency": "12"
    },
    {
        "word": "conspiracy",
        "frequency": "3"
    },
    {
        "word": "law",
        "frequency": "2"
    },
    {
        "word": "taxes",
        "frequency": "8"
    },
    {
        "word": "Mexico",
        "frequency": "5"
    },
    {
        "word": "Brexit",
        "frequency": "6"
    },
    {
        "word": "sex",
        "frequency": "7"
    }];

    return data;
}


function setupCanvasSize() {
    margin = {top: 200, left: 180, bottom: 120, right: 130},
    width = 960 - margin.left - margin.right;
    height = 800 - margin.top - margin.bottom;
    }

function appendSvg(domElement) {
    // SVG group
    svg = d3.select(domElement)
        .append("svg")
          .attr ({
            "width": width + margin.right + margin.left,
            "height": height + margin.top + margin.bottom
          })
        .append("g")
          .attr("transform","translate(" + margin.left + "," + margin.right + ")");
    }


function setupScales(){
    // Set scale and axis methods for X, Y
    xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .05, .05);

    yScale = d3.scale.linear()
        .range([height, 0])}


function setupAxis(){
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .ticks(20)
        .scale(yScale)
        .orient("left");}


function sortValuesDesc(){
    // Sort words by frquency of occurrence
    totalWords.sort(function(b,a) {return a.frequency - b.frequency;});}


function setupScaleDomains(){
    // Specify domains of X, Y scales
    xScale.domain(totalWords.map(function(d) { return d.word; }) );
    yScale.domain([0, 15])  //d3.max(totalWords, function(d) { return d.frequency; } ) ]);
    }


function drawChart(drawLegend){
    // Draw bars with initial animation
    svg.selectAll('rect')
       .data(totalWords)
       .enter()
       .append('rect')
       .attr("height", 0)
       .attr("y", height)
       .transition().duration(5000)
       .delay( function(d,i) { return i * 350; })
       .attr({
         "x": function(d) { return xScale(d.word); },
         "y": function(d) { return yScale(d.frequency); },
         "width": xScale.rangeBand(),
         "height": function(d) { return  height - yScale(d.frequency); }
       })

       // Generate colors gradually according to values
       .style("fill", function(d,i) { return 'rgb(' + ((i * 50) + 70) + ', ' + ((i * 20) + 50) + ', 100)'});

           svg.selectAll('text')
               .data(totalWords)
               .enter()
               .append('text')
               .text(function(d){
                   return d.frequency + "%";
               })
               .attr({
                   "x": function(d){ return xScale(d.word) +  xScale.rangeBand()/2; },
                   "y": function(d){ return yScale(d.frequency)+ 12; },
                   "font-family": 'serif',
                   "font-size": '15px',
                   "fill": "white",
                   "text-anchor": 'middle'
               });


       // Draw xAxis
       svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")
           .attr("dx", "-.8em")
           .attr("dy", ".25em")
           .attr("transform", "rotate(-45)" )
           .style("text-anchor", "end")
           .style("fill", function(d,i) { return 'rgb(' + ((i * 50) + 40) + ', ' + ((i * 20) + 20) + ', 70)'})
           .attr("font-size", "20px");

       // Draw yAxis
       svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height/2)
           .attr("dy", "-3em")
           .style("text-anchor", "end")
           .text("Frequency");

        if (drawLegend) {
           // Draw additional legend (simple colored squares)
           var legend = svg.append("g")
                            .attr("class", "legend")

           var legendRect = legend.selectAll("rect")
                                  .data(totalWords)
                                  .enter()
                                    .append('rect')
                                      .attr("width", 11)
                                      .attr("height", 11)
                                      .attr('fill', function(d,i) { return 'rgb(' + ((i * 50) + 70) + ', ' + ((i * 20) + 50) + ', 100)';})
                                      .attr('y', function(d, i) { return i * 20; })
                                      .attr("x", width - 65)

           var legenText = legend.selectAll('text')
                                 .data(totalWords)
                                 .enter()
                                   .append('text')
                                   .text(function(d) { return d.word; })
                                   .attr("x", width - 52)
                                   .attr("font-size", "12px")
                                   .attr('y', function(d, i) { return i * 20 + 9.8; })
        }
}
