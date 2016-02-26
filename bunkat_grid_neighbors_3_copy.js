/**
*   grid                  Setup a search space grid: 
*                         Configurable number of rows and columns
*/
function grid() {
    var marginHoriz = 40;
    var marginVert = 40;
    var width = numCols * cellSize;
    var height = numRows * cellSize;

    // mouseover, mouseout
    var over = 1;
    var out = 2;

    var gridData = cellData();

    /** TODO: NIX Diagnostics *******************************/
    //console.log("gridData.length: " + gridData.length);
    //console.log("gridData: " + JSON.stringify(gridData));
    // console.log("each cell:")
    // _.each(gridData, function(cell) {
    //     console.log("cell: " + JSON.stringify(cell));
    // });
    // console.log("--------------------------")
    /********************************************************/
    
    var grid = d3.select(anchorElement).append("svg")
        .attr("width", width + marginHoriz)
        .attr("height", height + marginVert)
        .attr("class", "grid");

    var cells = grid.selectAll(".cell")
        .data(gridData, function (d) { return d.id; }) // bind by key, which is id, which is row_col
      .enter().append("svg:rect")
        .attr("id", function(d) { return d.id; })
        .attr("class", "cell")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .on('mouseover', function(d) {
            d3.select(this)
                .style('fill', '#009900');
            neighbors(d, over);
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .style('fill', '#FFF');
            neighbors(d, out);
        })
        .on('click', function() {
            console.log(d3.select(this));
        })
        .style("fill", '#FFF')
        .style("stroke", '#555');
}

/**
 *   cellData()        returns an two dimensional array of rows and columns
 */
function cellData() {
    // Array of cells
    var data = new Array();

    var startX = cellSize / 2;
    var startY = cellSize / 2;
    var stepX = cellSize;
    var stepY = cellSize;
    var xPos = startX;
    var yPos = startY;
    var newValue = 0;
    var count = 0;

    // Row iterator
    for (var row = 0; row < numRows; row++){
        // Column/cell iterator
        for (var col = 0; col < numCols; col++){
            // TODO: What is the use of value? Make it uniform? Put it to some good use?
            var newValue = -1;

            // cell data
            data.push({
              count: count,
              index: [row, col],
              id: 'r' + row + 'c' + col,
              value: newValue,
              width: cellSize,
              height: cellSize,
              x: xPos,
              y: yPos
            });

            xPos += stepX;
            count += 1;
        }
        xPos = startX;
        yPos += stepY;
    }
    return data;
}

// Including diagonals
// Assuming svg origin [0,0] as upper left.
// [row, col] i.e. [horiz, vert]
var directions = [
    [0, 1],   // south
    [1, 1],   // south-east
    [1, 0],   // east
    [1, -1],  // north-east
    [-1, 0],  // north
    [-1, -1], // north-west
    [0, -1],  // west
    [-1, 1]   // south-west
];

function neighbors(cell, overout) {
    // loop all 8 directions
    _.each(directions, function(dir) {
        var neighborIndex = [
            cell.index[0] + dir[0], // x
            cell.index[1] + dir[1]  // y
        ];

        if(nodesContains(neighborIndex)) {
            var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
            neighbor.style("fill", overout==1 ? "#80FF80" : "#FFF");
        }
    });
}

function nodesContains(neighbor) {
    result = true;
    // test on range
    if(
        neighbor[0] < 0 || numRows <= neighbor[0] ||
        neighbor[1] < 0 || numCols <= neighbor[1]
    ) result = false;

    return result;
}

var anchorElement = '#grid';
var numCols = 40;
var numRows = 20;
var cellSize = 20;

// Starts here
grid();



