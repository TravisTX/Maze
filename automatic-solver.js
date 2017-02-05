function AutomaticSolver(settings, maze) {
    // input
    this.settings = settings;
    this.maze = maze;

    // private
    this.isActive = false;
    this.currentCell = undefined;
    this.path = [];
    this.visited = [];

    this.activate = function () {
        if (this.isActive) {
            return;
        }
        console.log('activating solver');
        this.isActive = true;
        this.currentCell = this.maze.startCell;
    }

    this.reset = function () {
        console.log('resetting solver');
        this.isActive = false;
        this.currentCell = undefined;
        this.path.length = 0;
        this.visited.length = 0;
    }

    this.update = function () {
        if (!this.isActive) {
            return;
        }

        this.processCurrentCell();
    }

    this.processCurrentCell = function () {
        if (!this.currentCell) {
            return;
        }

        var unvisitedNeighbors = [];
        if (!this.currentCell.topWall) {
            var cell = this.maze.cells[this.currentCell.row - 1][this.currentCell.col];
            if (this.visited.indexOf(cell) === -1) {
                unvisitedNeighbors.push(cell);
            }
        }
        if (!this.currentCell.rightWall) {
            var cell = this.maze.cells[this.currentCell.row][this.currentCell.col + 1];
            if (this.visited.indexOf(cell) === -1) {
                unvisitedNeighbors.push(cell);
            }
        }
        if (!this.currentCell.bottomWall) {
            var cell = this.maze.cells[this.currentCell.row + 1][this.currentCell.col];
            if (this.visited.indexOf(cell) === -1) {
                unvisitedNeighbors.push(cell);
            }
        }
        if (!this.currentCell.leftWall) {
            var cell = this.maze.cells[this.currentCell.row][this.currentCell.col - 1];
            if (this.visited.indexOf(cell) === -1) {
                unvisitedNeighbors.push(cell);
            }
        }

        if (unvisitedNeighbors.length > 0) {
            var chosenCell = undefined;
            var chosenIx = Util.randomRangeInt(0, unvisitedNeighbors.length);
            var chosenCell = unvisitedNeighbors[chosenIx];

            this.path.push(this.currentCell);

            this.visited.push(chosenCell);
            this.currentCell = chosenCell;
        }
        else {
            // Pop a cell from the stack
            // Make it the current cell
            this.currentCell = this.path.pop();
        }

        if (this.currentCell === this.maze.endCell) {
            console.log('done!');
            this.isActive = false;
        }
    }

    this.render = function () {
        if (this.path.length > 0) {
            this.maze.ctx.strokeStyle = "#cc5de8";
            this.maze.ctx.lineWidth = this.settings.cellSize - 8;
            this.maze.ctx.beginPath();
            this.maze.ctx.moveTo(this.maze.startCell.x + this.settings.cellSize / 2, this.maze.startCell.y + this.settings.cellSize / 2);
            for (var i = 0; i < this.path.length; i++) {
                var cell = this.path[i];
                this.maze.ctx.lineTo(cell.x + this.settings.cellSize / 2, cell.y + this.settings.cellSize / 2);
            }
            this.maze.ctx.lineTo(this.currentCell.x + this.settings.cellSize / 2, this.currentCell.y + this.settings.cellSize / 2);
            this.maze.ctx.stroke();
        }

        if (this.currentCell) {
            this.maze.ctx.beginPath();
            this.maze.ctx.fillStyle = "#862e9c";
            this.maze.ctx.arc(
                this.currentCell.x + this.settings.cellSize / 2,
                this.currentCell.y + this.settings.cellSize / 2,
                this.settings.cellSize / 3,
                0, Math.PI * 2, true);
            this.maze.ctx.fill();
        }
    }
}