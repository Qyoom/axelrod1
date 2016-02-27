/** Axelrod border lab 1 *******************/

function grid() {
    var marginHoriz = 40;
    var marginVert = 40;
    var width = numCols * cellSize;
    var height = numRows * cellSize;
    var halfSize = cellSize / 2.0;
    var wallThickness = 4;

    var grid = d3.select(anchorElement).append("svg")
        .attr("width", width + marginHoriz)
        .attr("height", height + marginVert)
        .attr("class", "grid")
        .append("g")
        .attr("transform", "translate(10, 10)");

    var cell = grid.selectAll(".cell")
        .data(cellData, function (d) { 
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

// TODO: Follow General Update Pattern so that this function only runs once.
function cellDataFun() {
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
                index: [row, col],
                id: 'r' + row + 'c' + col,
                value: newValue,
                x: xPos,
                y: yPos,
                features: featureData[count] // Randomized feature adoption has already taken place (data is in original order)
            });

            xPos += stepX;
            count += 1;
        } // end column iterator

        xPos = startX;
        yPos += stepY;
    } // end row iterator

    return data;
} // end cellDataFun

// Initialize feature set for one cell.
function randomFeatures() {
    var features = [];
    for(var i = 0; i < numFeatures; i++){
        features[i] = Math.floor(Math.random() * numTraits);
    }
    return features;
}

// Initialize features for each cell in grid.
function initFeatures() {
    var featureData = [];
    for(var i = 0; i < gridSize; i++){
        featureData[i] = randomFeatures();
    }
    return featureData;
}

function adoptFeatures(){
    // Randomization, no cell is favored.
    // Shuffling separate index array to randomly access featureData array.
    var newOrder = _.shuffle(_.range(gridSize)); 
    for(var i = 0; i < gridSize; i++){
        neighbors(cellData[newOrder[i]]);
    }
}

function neighbors(cell) {
    console.log(cell.id);
}

//*********************************/

// Grid dimensions
var anchorElement = '#grid';
var numCols = 15;
var numRows = 15;
var cellSize = 25;
var gridSize = numRows * numCols;

// Feature initialization. 
// Ranges are 0 (inclusive) to N (exclusive).
var numFeatures = 4;
var numTraits = 8;

// Assuming svg origin [0,0] as upper left.
// [row, col] i.e. [horiz, vert]
var directions = [
    [0, 1],   // south
    [1, 0],   // east
    [-1, 0],  // north
    [0, -1]  // west
];

var init = true; // initFeatures; i.e. first time.

//**** Starts here **************/
var featureData = initFeatures(); // Initial feature set (random values)

var cellData = cellDataFun(); // Data in cell form with x and y postion

grid(); // Bind data to Dom, draw walls

// Repeat cycle with local feature adoption
var timer;
// Repeat cycle until equilibrium reached.
timer = setInterval(function() {
    console.log("setInterval......");
    adoptFeatures()
}, 4000);






