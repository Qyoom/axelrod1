/** Axelrod border lab 1 *******************/

function grid() {
    var marginHoriz = 40;
    var marginVert = 40;
    var width = numCols * cellSize;
    var height = numRows * cellSize;

    var gridData = cellData();

    var grid = d3.select(anchorElement).append("svg")
        .attr("width", width + marginHoriz)
        .attr("height", height + marginVert)
        .attr("class", "grid");

    var cells = grid.selectAll(".cell")
        .data(gridData, function (d) { return d.count; }) // Bind by key, which is count (unique).
        // TODO: Going to change from this point downward...
      .enter().append("svg:rect")
        .attr("class", "cell")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .style("fill", '#FFF')
        .style("stroke", '#555');

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
                y: yPos
            });

            xPos += stepX;
            count += 1;
        } // end column iterator

        xPos = startX;
        yPos += stepY;
    } // end row iterator

    return data;
} // end cellData

var anchorElement = '#grid';
var numCols = 10;
var numRows = 5;
var cellSize = 25;

// Starts here
grid();