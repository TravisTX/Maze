function Generator(settings, maze) {
    // input
    this.settings = settings;
    this.maze = maze;

    // public output
    this.fps = 0;
    this.generating = false;


    // private
    this.oldtime = +new Date;
    this.stack = [];


    this.reset = function () {
        colCount = this.settings.width;
        rowCount = this.settings.height;

        this.maze.canvas.width = this.settings.cellSize * colCount + 2;
        this.maze.canvas.height = this.settings.cellSize * rowCount + 22;

        this.maze.cells.length = 0;
        this.stack.length = 0;
        this.maze.generatorCurrentCell = this.maze.startCell = this.maze.endCell = undefined;
        for (var row = 0; row < rowCount; row++) {
            var rowArray = [];
            for (var col = 0; col < colCount; col++) {
                rowArray.push(new Cell(this.maze, row, col));
            }
            this.maze.cells.push(rowArray);
        }

        // populate neighbors
        for (var row = 0; row < this.maze.cells.length; row++) {
            for (var col = 0; col < this.maze.cells[row].length; col++) {
                var cell = this.maze.cells[row][col];
                if (col > 0) {
                    cell.neighbors.push(this.maze.cells[row][col - 1]);
                }
                if (col < colCount - 1) {
                    cell.neighbors.push(this.maze.cells[row][col + 1]);
                }
                if (row > 0) {
                    cell.neighbors.push(this.maze.cells[row - 1][col]);
                }
                if (row < rowCount - 1) {
                    cell.neighbors.push(this.maze.cells[row + 1][col]);
                }
            }
        }

        this.maze.startCell = this.maze.generatorCurrentCell = this.maze.cells[0][Util.randomRangeInt(0, colCount - 1)];
        this.maze.generatorCurrentCell.visited = true;
        this.generating = true;
    }

    this.update = function() {
        if (!this.generating) {
            return;
        }
        var time = +new Date;
        this.fps = 1000 / (time - this.oldtime)
        this.oldtime = time;

        if (this.settings.speed === this.settings.maxSpeed) {
            // max speed = disable animation
            while (this.maze.generatorCurrentCell) {
                this.processCurrentCell();
            }
        }
        else {
            // process {speed} cells at a time
            for (var i = 0; i < this.settings.speed; i++) {
                this.processCurrentCell();
            }
        }
        if (!this.maze.generatorCurrentCell) {
            this.generating = false;
            this.selectEndCell();
        }
    }


    this.processCurrentCell = function() {
        if (!this.maze.generatorCurrentCell) {
            return;
        }
        var unvisitedNeighbors = [];
        for (var i = 0; i < this.maze.generatorCurrentCell.neighbors.length; i++) {
            if (!this.maze.generatorCurrentCell.neighbors[i].visited) {
                unvisitedNeighbors.push(this.maze.generatorCurrentCell.neighbors[i]);
            }
        }
        var biasedUnvisitedNeighbors = [];
        for (var i = 0; i < unvisitedNeighbors.length; i++) {
            if (
                (this.settings.bias === 'h' && unvisitedNeighbors[i].row === this.maze.generatorCurrentCell.row) ||
                (this.settings.bias === 'v' && unvisitedNeighbors[i].col === this.maze.generatorCurrentCell.col) ||
                (this.settings.bias === '')
            ) {
                biasedUnvisitedNeighbors.push(unvisitedNeighbors[i]);
            }
        }

        if (unvisitedNeighbors.length > 0) {
            var chosenCell = undefined;
            // 90% of the time, choose the bias
            if (biasedUnvisitedNeighbors.length > 0 && Util.randomRangeInt(0, 10) < 9) {
                var chosenIx = Util.randomRangeInt(0, biasedUnvisitedNeighbors.length);
                var chosenCell = biasedUnvisitedNeighbors[chosenIx];
            }
            else {
                var chosenIx = Util.randomRangeInt(0, unvisitedNeighbors.length);
                var chosenCell = unvisitedNeighbors[chosenIx];
            }

            this.stack.push(this.maze.generatorCurrentCell);

            // remove wall between current and chosen
            if (this.maze.generatorCurrentCell.row < chosenCell.row) {
                this.maze.generatorCurrentCell.bottomWall = false;
                chosenCell.topWall = false;
            }
            if (this.maze.generatorCurrentCell.row > chosenCell.row) {
                this.maze.generatorCurrentCell.topWall = false;
                chosenCell.bottomWall = false;
            }
            if (this.maze.generatorCurrentCell.col < chosenCell.col) {
                this.maze.generatorCurrentCell.rightWall = false;
                chosenCell.leftWall = false;
            }
            if (this.maze.generatorCurrentCell.col > chosenCell.col) {
                this.maze.generatorCurrentCell.leftWall = false;
                chosenCell.rightWall = false;
            }

            chosenCell.visited = true;
            this.maze.generatorCurrentCell = chosenCell;

        }
        else {
            // Pop a cell from the stack
            // Make it the current cell
            this.maze.generatorCurrentCell = this.stack.pop();
        }
    }
    this.selectEndCell = function() {
        this.maze.endCell = this.maze.cells[rowCount - 1][Util.randomRangeInt(0, colCount - 1)];
    }
}