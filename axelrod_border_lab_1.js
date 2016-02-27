/** Axelrod border lab 1 *******************/

function grid() {
    var marginHoriz = 40;
    var marginVert = 40;
    var width = numCols * cellSize;
    var height = numRows * cellSize;
    var halfSize = cellSize / 2.0;
    var wallThickness = 4;

    var gridData = cellData();

    var grid = d3.select(anchorElement).append("svg")
        .attr("width", width + marginHoriz)
        .attr("height", height + marginVert)
        .attr("class", "grid")
        .append("g")
        .attr("transform", "translate(10, 10)");

    var cell = grid.selectAll(".cell")
        .data(gridData, function (d) { 
            return d.count; // Bind by key, which is count (unique)
        })
      .enter().append("svg:g")
        .attr("class", "cell");

    // TOP
    cell.append("line")
        .style("stroke", "black")
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize }) 
        .attr("y1", function(d) { return d.y - halfSize }) 
        .attr("x2", function(d) { return d.x + halfSize }) 
        .attr("y2", function(d) { return d.y - halfSize });

    // Left
    cell.append("line")
        .style("stroke", "black")
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize }) 
        .attr("y1", function(d) { return d.y - halfSize }) 
        .attr("x2", function(d) { return d.x - halfSize }) 
        .attr("y2", function(d) { return d.y + halfSize });

    // Bottom
    cell.append("line")
        .style("stroke", "black")
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize }) 
        .attr("y1", function(d) { return d.y + halfSize }) 
        .attr("x2", function(d) { return d.x + halfSize }) 
        .attr("y2", function(d) { return d.y + halfSize });

    // Right
    cell.append("line")
        .style("stroke", "black")
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x + halfSize }) 
        .attr("y1", function(d) { return d.y - halfSize }) 
        .attr("x2", function(d) { return d.x + halfSize }) 
        .attr("y2", function(d) { return d.y + halfSize });

} // end grid

function cellData() {
    var data = new Array();

    var startX = cellSize / 2;
    var startY = cellSize / 2;
    var stepX = cellSize;
    var stepY = cellSize;
    var xPos = startX;
    var yPos = startY;
    var count = 0;
    var newValue = 0;

    // Row iterator
    for (var row = 0; row < numRows; row++){

        // Column/cell iterator
        for (var col = 0; col < numCols; col++){

            // cell data
            data.push({
                count: count,
                x: xPos,
                y: yPos,
                features: featureData[count]
            });

            xPos += stepX;
            count += 1;
        } // end column iterator

        xPos = startX;
        yPos += stepY;
    } // end row iterator

    return data;
} // end cellData

// Grid dimensions
var anchorElement = '#grid';
var numCols = 15;
var numRows = 15;
var cellSize = 25;

// Feature initialization. 
// Ranges are 0 (inclusive) to N (exclusive).
var numFeatures = 4;
var numTraits = 8;

function genFeatureSet() {
    var features = [];
    for(var i = 0; i < numFeatures; i++){
        features[i] = Math.floor(Math.random() * numTraits);
    }
    return features;
}

function initFeatures() {
    var featureData = [];
    for(var i = 0; i < numRows * numCols; i++){
        featureData[i] = genFeatureSet();
    }
    return featureData;
}

// Starts here
var featureData = initFeatures();
grid();






