(function () {
    var settings = function() {
        this.width = 30;
        this.height = 30;
        this.cellSize = window.innerWidth < 620 ? 10 : 20;
        this.speed = 5;
        this.bias = 'h';
        this.Generate = undefined;
    }

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var fpsLabel = document.getElementById('fpsLabel');

    var oldtime = +new Date;
    var fps = 0;
    var rowCount = undefined;
    var colCount = undefined;
    var cells = [];
    var currentCell = undefined;
    var startCell = undefined;
    var endCell = undefined;
    var stack = [];
    var maxSpeed = 11;
    var settings = new settings();
    settings.Generate = reset;

    function init() {
        var gui = new dat.GUI();
        gui.add(settings, 'width', 10, 100).step(1);
        gui.add(settings, 'height', 10, 100).step(1);
        gui.add(settings, 'cellSize', 10, 30).step(1);
        gui.add(settings, 'speed', 1, maxSpeed).step(1);
        gui.add(settings, 'bias', { Neutral: '', Horizontal: 'h', Vertical: 'v' } );
        gui.add(settings, 'Generate');
        window.settings = settings;

        reset();
    }
    init();

    function reset() {
        colCount = settings.width;
        rowCount = settings.height;

        canvas.width = settings.cellSize * colCount + 2;
        canvas.height = settings.cellSize * rowCount + 22;

        cells = [];
        stack = [];
        currentCell = startCell = endCell = undefined;
        for (var row = 0; row < rowCount; row++) {
            var rowArray = [];
            for (var col = 0; col < colCount; col++) {
                rowArray.push(new Cell(canvas, ctx, row, col));
            }
            cells.push(rowArray);
        }

        // populate neighbors
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var cell = cells[row][col];
                if (col > 0) {
                    cell.neighbors.push(cells[row][col - 1]);
                }
                if (col < colCount - 1) {
                    cell.neighbors.push(cells[row][col + 1]);
                }
                if (row > 0) {
                    cell.neighbors.push(cells[row - 1][col]);
                }
                if (row < rowCount - 1) {
                    cell.neighbors.push(cells[row + 1][col]);
                }
            }
        }

        startCell = currentCell = cells[0][Util.randomRangeInt(0, colCount - 1)];
        currentCell.visited = true;

        update();
    }

    window.reset = reset;


    function update() {
        var time = +new Date;
        fps = 1000 / (time - oldtime)
        oldtime = time;
        fpsLabel.innerText = Math.round(fps) + " fps";


        if (settings.speed === maxSpeed) {
            // max speed = disable animation
            while(currentCell) {
                processCurrentCell();
            }
        }
        else {
            // process {speed} cells at a time
            for (var i = 0; i < settings.speed; i++) {
                processCurrentCell();
            }
        }
        render();
        if (currentCell) {
            requestAnimationFrame(update);
        }
        else {
            fpsLabel.innerText = 'done';
            selectEndCell();
            render();
        }
    }

    function render() {
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var isCurrent = cells[row][col] === currentCell;
                var isStart = cells[row][col] === startCell;
                var isEnd = cells[row][col] === endCell;
                cells[row][col].render(isCurrent, isStart, isEnd);
            }
        }
    }

    function processCurrentCell() {
        if (!currentCell) {
            return;
        }
        var unvisitedNeighbors = [];
        for (var i = 0; i < currentCell.neighbors.length; i++) {
            if (!currentCell.neighbors[i].visited) {
                unvisitedNeighbors.push(currentCell.neighbors[i]);
            }
        }
        var biasedUnvisitedNeighbors = [];
        for (var i = 0; i < unvisitedNeighbors.length; i++) {
            if (
                (settings.bias === 'h' && unvisitedNeighbors[i].row === currentCell.row) ||
                (settings.bias === 'v' && unvisitedNeighbors[i].col === currentCell.col) ||
                (settings.bias === '')
                ) {
                biasedUnvisitedNeighbors.push(unvisitedNeighbors[i]);
            }
        }

        if (unvisitedNeighbors.length > 0) {
            var chosenCell = undefined;
            if (biasedUnvisitedNeighbors.length > 0 && Util.randomRangeInt(0, 10) < 9) {
                var chosenIx = Util.randomRangeInt(0, biasedUnvisitedNeighbors.length);
                var chosenCell = biasedUnvisitedNeighbors[chosenIx];
            }
            else {
                var chosenIx = Util.randomRangeInt(0, unvisitedNeighbors.length);
                var chosenCell = unvisitedNeighbors[chosenIx];
            }

            stack.push(currentCell);

            // remove wall between current and chosen
            if (currentCell.row < chosenCell.row) {
                currentCell.bottomWall = false;
                chosenCell.topWall = false;
            }
            if (currentCell.row > chosenCell.row) {
                currentCell.topWall = false;
                chosenCell.bottomWall = false;
            }
            if (currentCell.col < chosenCell.col) {
                currentCell.rightWall = false;
                chosenCell.leftWall = false;
            }
            if (currentCell.col > chosenCell.col) {
                currentCell.leftWall = false;
                chosenCell.rightWall = false;
            }

            chosenCell.visited = true;
            currentCell = chosenCell;

        }
        else {
            // Pop a cell from the stack
            // Make it the current cell
            currentCell = stack.pop();
        }
    }
    function selectEndCell() {
        endCell = cells[rowCount - 1][Util.randomRangeInt(0, colCount - 1)];
    }
})();
