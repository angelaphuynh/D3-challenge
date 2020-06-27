//============Set up chart=====================
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// ====Create an SVG wrapper,append an SVG group that will hold chart and set margins=====
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// ========== Retrieve data from the CSV file and execute =======================    
d3.csv("assets/data/data.csv").then(function(censusRecord){
    censusRecord.forEach(function(record){
        record.smokes = +record.smokes;
        record.age = +record.age;
        record.poverty = +record.poverty;
        record.healthcare = +record.healthcare;
        record.obesity = +record.obesity;
    });
    
    console.log(censusRecord)
    
    // ==============Create scales & axes====================
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusRecord, d=>d["poverty"]-1),
        d3.max(censusRecord,d=>d["poverty"])])
        .range([0,chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusRecord, d=>d["healthcare"]-1),
        d3.max(censusRecord, d=>d["healthcare"])])
        .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // ============Append axes to the chartGroup==========
    chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

    //============Generate scatter plot=========
    var gdots =  chartGroup.selectAll("g.dot")
        .data(censusRecord)
        .enter()
        .append('g');

    gdots.append("circle")
        .attr("cx", d => xLinearScale(d["poverty"]))
        .attr("cy", d => yLinearScale(d["healthcare"]))
        .attr("r", d=>d.obesity / 2)
        .attr("fill", "steelblue")
        .attr("opacity", ".5");

//============Add labels to datapoints & axes =========
    gdots.append("text").text(d=>d.abbr)
        .attr("x", d => xLinearScale(d.poverty)-4)
        .attr("y", d => yLinearScale(d.healthcare)+2)
        .style("font-size",".6em")
        .classed("fill-text", true);

    console.log(d => xLinearScale(d.poverty));
    console.log(d => yLinearScale(d.healthcare));
   
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .attr("class", "aText")
    .text("Poverty %");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare Coverage %");
});