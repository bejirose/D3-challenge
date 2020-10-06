var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#bonus")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var xSelect = "income";
var ySelect = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(peopleData, xSelect) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(peopleData, d => d[xSelect]) * 0.8,
      d3.max(peopleData, d => d[xSelect]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, xSelect) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xSelect]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(xSelect, circlesGroup) {
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
      return (`<h6>${d.state}</h6><hr>${xSelect} ${d[xSelect]}<br>${ySelect} ${d[ySelect]}`);
     });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(peopleData, err) {
  if (err) throw err;

  // parse data and cast as numbers
  peopleData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(peopleData, xSelect);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(peopleData, d => d[ySelect])])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(peopleData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[xSelect]))
    .attr("cy", d => yLinearScale(d[ySelect]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")  
    .attr("x", 0)
    .attr("y", 20)
    .attr("value","age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text") // label for the Y-axis
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

  var povertyLabel = labelsGroup.append("text") // label for the Y-axis
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty");

  var obesityLabel = labelsGroup.append("text") // label for the Y-axis
    .attr("x", 20)
    .attr("y", 0)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity");

  var smokesLabel = labelsGroup.append("text") // label for the Y-axis
    .attr("x", 40)
    .attr("y", 0)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");
  
  var hcLabel = labelsGroup.append("text") // label for the Y-axis
    .attr("x", 60)
    .attr("y", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Healthcare");

  // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");

  // updateToolTip function above csv import
  //var circlesGroup = updateToolTip(xSelect, xSelect, ySelect, ySelect, circlesGroup);
  var circlesGroup = updateToolTip(xSelect, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== xSelect) {

        // replaces xSelect with value
        xSelect = value;

        console.log(xSelect)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(peopleData, xSelect);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, xSelect);

        // updates tooltips with new info
        circlesGroup = updateToolTip(xSelect, circlesGroup);

        // changes classes to change bold text
        // if (xSelect == "age") {
        //   albumsLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        //   hairLengthLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        // }
        // else {
        //   albumsLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        //   hairLengthLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        // }
      }
    });
}).catch(function(error) {
  console.log(error);
});
