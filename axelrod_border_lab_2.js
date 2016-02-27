/** Axelrod border lab 2 *******************/

// Grid layout dimensions
var anchorElement = '#grid';
var numCols = 10;
var numRows = 5;
var cellSize = 25;
var gridSize = numRows * numCols;
var marginHoriz = 40;
var marginVert = 40;
var width = numCols * cellSize;
var height = numRows * cellSize;
var halfSize = cellSize / 2.0;
var wallThickness = 4;

// Feature initialization. 
// Ranges are 0 (inclusive) to N (exclusive).
var numFeatures = 6;
var numTraits = 12;

// Assuming svg origin [0,0] as upper left.
// [row, col] i.e. [horiz, vert]
var directions = [
    [0, 1],   // south
    [1, 0],   // east
    [-1, 0],  // north
    [0, -1]  // west
];

// svg:g element
var grid = d3.select(anchorElement).append("svg")
        .attr("width", width + marginHoriz)
        .attr("height", height + marginVert)
        .attr("class", "grid")
        .append("g")
        .attr("transform", "translate(10, 10)");

function gridFun() {

    var cell = grid.selectAll(".cell")
        .data(cellData, function (d) { 
            return d.count; // Bind by key, which is count (unique)
        })
      .enter().append("svg:g")
        .attr("class", "cell")
        .attr("id", function(d) { return d.id; });

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

function cycleInfluence(){
    // Randomization, no cell is favored.
    // Shuffling separate index array to randomly access featureData array.
    var newOrder = _.shuffle(_.range(gridSize)); 
    for(var i = 0; i < gridSize; i++){
        neighbors(cellData[newOrder[i]]);
    }
}

function neighbors(cell) {
    console.log("neighbors, cell: " + JSON.stringify(cell));

    // These two vars refer to same neighbor
    var mostSimilar; // neighbor
    var highestPercentage; // percentage

    // Loop all 4 directions in random order. This disallows bias based on commonality of ties.
    _.each(_.shuffle(directions), function(dir) {
        var neighborIndex = [
            cell.index[0] + dir[0], // x
            cell.index[1] + dir[1]  // y
        ];
        //console.log("neighborIndex: " + neighborIndex);

        if(gridContains(neighborIndex)) {
            var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
            neighbor = neighbor[0][0].__data__; // TODO: Hack!
            console.log("neighbors, neighbor: " + JSON.stringify(neighbor));
            // Calculate similarity percentage
            var ptcSim = percentSimilar(cell, neighbor);
            if(typeof mostSimilar === 'undefined' || ptcSim > highestPercentage) {
                highestPercentage = ptcSim;
                mostSimilar = neighbor;
            }
        }
    });

    if(highestPercentage === 1) {
        console.log("===> CELL FIXED: " + JSON.stringify(cell));
        // TODO: ???????
    }
    else adoptFeature(cell, mostSimilar, highestPercentage);
}

function adoptFeature(cell, mostSimilar, highestPercentage) {
    var unmatchedIndexes = [];
    for(var i = 0; i < numFeatures; i++){
        if(cell.features[i] !== mostSimilar.features[i]){
            unmatchedIndexes.push(i);
        }
    }
    var randomIndex = Math.floor(Math.random() * unmatchedIndexes.length);
    randomIndex = unmatchedIndexes[randomIndex];
    cell.features[randomIndex] = mostSimilar.features[randomIndex];
}

function percentSimilar(cell, neighbor) {
    var matchCount = 0;
    for(var i = 0; i < numFeatures; i++){
        //console.log("percentSimilar, neighbor: " + JSON.stringify(neighbor));
        //console.log(cell.features[i] === neighbor.features[i]);
        if(cell.features[i] === neighbor.features[i]) matchCount += 1;
    }
    var similiarity = round(matchCount / numFeatures);
    console.log("similiarity: " + similiarity);
    return similiarity;
}

function gridContains(neighbor) {
    result = true;
    // test on range
    if(
        neighbor[0] < 0 || numRows <= neighbor[0] ||
        neighbor[1] < 0 || numCols <= neighbor[1]
    ) result = false;

    return result;
}

function round(value) {
    return Number(Math.round(value+'e'+2)+'e-'+2);
}

//**** Starts here ***********************/

var featureData = initFeatures(); // Initial feature set (random values)

var cellData = cellDataFun(); // Data in cell form with x and y postion

gridFun(); // Bind data to Dom, draw walls

// Repeat cycle with local feature adoption
var timer;
// Repeat cycle until equilibrium reached.
timer = setInterval(function() {
    console.log("setInterval......");
    cycleInfluence();
    gridFun();
    clearInterval(timer); // TODO: NIX ##############
}, 3000);






