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
var svg2 = d3
  .select("#bonus")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var xSelect = "age";
var ySelect = "obesity";

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

function yScale(peopleData, ySelect) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(peopleData, d => d[ySelect]) * 0.8,
      d3.max(peopleData, d => d[ySelect]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}



// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup2, newXScale, xSelect) {

  circlesGroup2.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xSelect]));
  
    
    return circlesGroup2;
}

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup2) {
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
      return (`<h6>${d.state}</h6><hr>${xSelect} ${d[xSelect]}<br>${ySelect} ${d[ySelect]}`);
     });

  circlesGroup2.call(toolTip);

  circlesGroup2.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });

  
  return circlesGroup2;
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
  var xAxis = chartGroup2.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
   chartGroup2.append("g")
     .call(leftAxis);
  
  var yAxis = d3.axisLeft(yLinearScale);

  // append initial circles
  var circlesGroup2 = chartGroup2.selectAll("circle")
    .data(peopleData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[xSelect]))
    .attr("cy", d => yLinearScale(d[ySelect]))
    .attr("r", 20)
    .attr("fill", "orange")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroupX = chartGroup2.append("g")
    .classed("axis-text", true)
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var labelsGroupY = chartGroup2.append("g")
   // .attr("transform", `translate((0 - ${height / 2}), (0 - ${margin.left} - 20)`)
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2))
    //  .attr("dy", "1em")
    //  .classed("axis-text", true)
     .attr("transform", "rotate(-90)");
   // .attr("transform", `translate(${height / 2}, ${width - 40})`);

  var ageLabel = labelsGroupX.append("text")  
    .attr("x", 0)
    .attr("y", 20)
    .attr("value","age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroupX.append("text") // label for the Y-axis
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

  var povertyLabel = labelsGroupX.append("text") // label for the Y-axis
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty");

  var obesityLabel = labelsGroupY.append("text") // label for the Y-axis
    // .attr("x", 20)
    // .attr("y", 0)
    .attr("value", "obesity") // value to grab for event listener
    .attr("y", 0 - margin.left/2)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .attr("fill", "blue")
    .text("Obesity");

  var smokesLabel = labelsGroupY.append("text") // label for the Y-axis
    .attr("y", (0 - margin.left) + 40)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");
  
  var hcLabel = labelsGroupY.append("text") // label for the Y-axis
    .attr("y", (0 - margin.left) + 20)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Healthcare");

   //var circlesGroup2 = updateToolTip(xSelect, xSelect, ySelect, ySelect, circlesGroup2);
  var circlesGroup2 = updateToolTip(circlesGroup2);

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
    //  if (value !== xSelect) {

        // replaces xSelect with value
        xSelect = value;

        console.log(xSelect)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(peopleData, xSelect);

        // // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup2 = renderCircles( circlesGroup2, xLinearScale, xSelect);

        // updates tooltips with new info
        circlesGroup2 = updateToolTip(circlesGroup2);

        // changes classes to change bold text
        if (xSelect == "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (xSelect == "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
   //   }
    });

     // y axis labels event listener
    labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      //  if (value !== xSelect) {

        // replaces xSelect with value
        ySelect = value;

        console.log(ySelect)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(peopleData, ySelect);

        // updates x axis with transition
       // yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup2 = renderCircles(circlesGroup2, yLinearScale, ySelect);

        // updates tooltips with new info
        circlesGroup2 = updateToolTip(circlesGroup2);

        // changes classes to change bold text
        if (ySelect == "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          hcLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (ySelect == "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          hcLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          hcLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
    });
}).catch(function(error) {
  console.log(error);
});
