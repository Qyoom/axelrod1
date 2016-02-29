/** Axelrod border lab 2 *******************/

// Grid layout dimensions
var anchorElement = '#grid';
var numRows = 20;
var numCols = 20;
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
var numFeatures = 5;
var numTraits = 10;

// Assuming svg origin [0,0] as upper left.
// [row, col] i.e. [vert, horiz]
var directions = [
    { "index": 0, "coord": [-1, 0] },  // north (up)
    { "index": 1, "coord": [ 0,-1] },  // west  (left)
    { "index": 2, "coord": [ 1, 0] },  // south (down)
    { "index": 3, "coord": [ 0, 1] }   // east  (right)
];

// svg:g element
var grid = d3.select(anchorElement).append("svg")
    .attr("width", width + marginHoriz)
    .attr("height", height + marginVert)
    .attr("class", "grid")
    .append("g")
    .attr("transform", "translate(10, 10)");

function gridFun() {
    // Join data by key to <g> (.cell)
    var cell = grid.selectAll(".cell")
        .data(cellData, function (d) { 
            return d.id; // Bind by key, which is id (unique)
        });

    // UPDATE
    cell.selectAll(".north")
        .style("stroke", function(d) { return d.opacities[0]; })
        .style("stroke-width", wallThickness);

    cell.selectAll(".west")
        .style("stroke", function(d) { return d.opacities[1]; })
        .style("stroke-width", wallThickness);

    // ENTER happens just once at the beginning.
    var enterCell = cell.enter().append("svg:g")
        .attr("class", "cell")
        .attr("id", function(d) { return d.id; });

    // North, top
    enterCell.append("line")
        .attr("class", "north")
        .style("stroke", function(d) { return d.opacities[0]; })
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize +4}) 
        .attr("y1", function(d) { return d.y - halfSize })//+ 2}) 
        .attr("x2", function(d) { return d.x + halfSize -4}) 
        .attr("y2", function(d) { return d.y - halfSize });//+ 2 });

    // West, left
    enterCell.append("line")
        .attr("class", "west")
        .style("stroke", function(d) { return d.opacities[1]; })
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize })//+ 2}) 
        .attr("y1", function(d) { return d.y - halfSize + 4}) 
        .attr("x2", function(d) { return d.x - halfSize })//+ 2}) 
        .attr("y2", function(d) { return d.y + halfSize - 4});

    // // South, bottom
    // enterCell.append("line")
    //     .attr("class", "south")
    //     .style("stroke", function(d) { return d.opacities[2]; })
    //     .style("stroke-width", wallThickness)
    //     .style("stroke-linecap", "square")
    //     .attr("x1", function(d) { return d.x - halfSize }) 
    //     .attr("y1", function(d) { return d.y + halfSize })//- 2}) 
    //     .attr("x2", function(d) { return d.x + halfSize }) 
    //     .attr("y2", function(d) { return d.y + halfSize });//- 2});

    // // East, right
    // enterCell.append("line")
    //     .attr("class", "east")
    //     .style("stroke", function(d) { return d.opacities[3]; })
    //     .style("stroke-width", wallThickness)
    //     .style("stroke-linecap", "square")
    //     .attr("x1", function(d) { return d.x + halfSize })//- 2}) 
    //     .attr("y1", function(d) { return d.y - halfSize }) 
    //     .attr("x2", function(d) { return d.x + halfSize })//- 2}) 
    //     .attr("y2", function(d) { return d.y + halfSize });

    cell.exit().remove();

} // end grid

// This function only runs once at start.
function cellDataFun() {
    var data = new Array();

    var startX = cellSize / 2;
    var startY = cellSize / 2;
    var stepX = cellSize;
    var stepY = cellSize;
    var xPos = startX;
    var yPos = startY;
    var newValue = 0;

    // Row iterator, y
    for (var row = 0; row < numRows; row++){

        // Column/cell iterator, x
        for (var col = 0; col < numCols; col++){

            // cell data
            data.push({
                index: [row, col],
                id: 'r' + row + 'c' + col,
                value: newValue,
                x: xPos,
                y: yPos,
                features: randomFeatures(), // Randomized feature adoption has already taken place (data is in original order)
                opacities: [ // [0:north, 1:west, 2:south, 3:east] TODO: This initialization of wall shade does not acurately reflect similarity with neighbors.
                    "#000000",
                    "#000000",
                    "#000000",
                    "#000000"
                ]
            });

            xPos += stepX;
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

function updateInfluence(){
    // Randomization, no cell is favored.
    // Shuffling separate index array to randomly process cells (feature similarity).
    var randomCellOrder = _.shuffle(_.range(gridSize));
    for(var i = 0; i < gridSize; i++){
        interactNeighbor(cellData[randomCellOrder[i]]);
    }
}

// Modifies cell feature. Does not determine wall color on this pass.
function interactNeighbor(cell) {
    // Random iteration of all 4 directions
    var randDirOrder = _.shuffle(_.range(directions.length));
    for(var i = 0; i < directions.length; i++) {
        var direction = directions[randDirOrder[i]];

        var neighborIndex = [
            cell.index[0] + direction.coord[0], // x
            cell.index[1] + direction.coord[1]  // y
        ];

        if(gridContains(neighborIndex)) {
            var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
            neighbor = neighbor[0][0].__data__; // TODO: Hack!

            // Calculate similarity percentage
            var pctSim = percentSimilar(cell, neighbor);
            var prob = Math.random();

            // Determine (probability based on similarity) if can interact.
            //if(prob <= pctSim) { // && pctSim < 1) {
            if(prob <= pctSim && pctSim < 1) {
                adoptFeature(cell, neighbor);
            }
            // else no interaction for this cell this cycle!
            return; // Either way
        }
        // else continue with next direction since this direction not in grid.
    } // end loop of directions/neighbors
} // end function neighbors

function updateWalls() {
     // for each cell...
     for(var i = 0; i < gridSize; i++) {
         var cell = cellData[i];
         //console.log("updateWalls, cell: " + JSON.stringify(cell));

         // for north and west only...
         for(var j = 0; j < directions.length / 2; j++) {
            var direction = directions[j];
            //console.log("updateWalls, direction: " + JSON.stringify(direction));

            var neighborIndex = [
                cell.index[0] + direction.coord[0], // x
                cell.index[1] + direction.coord[1]  // y
            ];

            if(gridContains(neighborIndex)) {
                var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
                neighbor = neighbor[0][0].__data__; // TODO: Hack!

                // Calculate similarity percentage
                var pctSim = percentSimilar(cell, neighbor);

                // opacities: [0:north, 1:west, 2:south, 3:east]
                cell.opacities[direction.index] = wallColor(pctSim);
            }
         } // end loop each direction
     } // end loop each cell
}

function wallColor(pctSim) {
/*    
    if     (pctSim > .8)                 return "#FFFFFF";
    else if(pctSim > .6 && pctSim <= .8) return "#BFBFBF";
    else if(pctSim > .4 && pctSim <= .6) return "#808080";
    else if(pctSim > .2 && pctSim <= .4) return "#404040";
    else if(pctSim >= 0 && pctSim <= .2) return "#000000";
    else return "red";
*/
    //if(pctSim < 1e-5)
        //return '#FF00FF';

    var color = Math.round(pctSim * 255);
    var color_str = color.toString(16);
    if( color < 16) color_str = '0' + color_str;
    return '#' + color_str + color_str + color_str;    
}

function adoptFeature(cell, neighbor) {
    var unmatchedIndexes = [];
    for(var i = 0; i < numFeatures; i++){
        if(cell.features[i] !== neighbor.features[i]){
            unmatchedIndexes.push(i);
        }
    }
    var randomIndex = Math.floor(Math.random() * unmatchedIndexes.length);
    randomIndex = unmatchedIndexes[randomIndex];
    cell.features[randomIndex] = neighbor.features[randomIndex];
}

function percentSimilar(cell, neighbor) {
    var matchCount = 0;
    for(var i = 0; i < numFeatures; i++){
        if(cell.features[i] === neighbor.features[i]) matchCount += 1;
    }
    var similiarity = round(matchCount / numFeatures);
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
    //return Number(Math.round(value+'e'+2)+'e-'+2);
    return Math.round(value*100)/100;
}

//**** Starts here ***********************/

var cellData = cellDataFun(); // Data in cell form with x and y postion

gridFun(); // Bind data to Dom, draw walls

// Repeat cycle with local feature adoption
var timer;
// Repeat cycle until equilibrium reached.
var timerCnt = 0;
timer = setInterval(function() {
    if(timerCnt % 10 == 0) console.log("setInterval, timerCnt: " + timerCnt);
    updateInfluence();
    updateWalls();
    gridFun();
    timerCnt += 1;
    if(timerCnt > 5000) clearInterval(timer); // TODO: NIX ##############
}, 50);






