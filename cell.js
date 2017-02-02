function Cell(maze, row, col) {
    this.maze = maze;
    this.ctx = this.maze.ctx;
    this.row = row;
    this.col = col;
    this.neighbors = [];
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.width = window.settings.cellSize;
    this.visited = false;

    this.x = this.col * this.width + 1;
    this.y = this.row * this.width + 11; // leave gap for arrows

    this.render = function () {
        if (this.visited) {
            this.ctx.fillStyle = "#f8f9fa";
        }
        else {
            this.ctx.fillStyle = "#343a40";
        }
        this.ctx.fillRect(this.x, this.y, this.width, this.width);

        if (this === this.maze.startCell) {
            this.ctx.fillStyle = "#37b24d";
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width / 2, this.y + this.width / 2 - 10);
            this.ctx.lineTo(this.x + this.width / 5, this.y - 10);
            this.ctx.lineTo(this.x + this.width - this.width / 5, this.y - 10);
            this.ctx.fill();
        }
        if (this === this.maze.endCell) {
            this.ctx.fillStyle = "#f03e3e";
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width / 2, this.y + this.width + 10);
            this.ctx.lineTo(this.x + this.width / 5, this.y + this.width / 2 + 10);
            this.ctx.lineTo(this.x + this.width - this.width / 5, this.y + this.width / 2 + 10);
            this.ctx.fill();
        }

        this.renderWalls();
    }

    this.renderWalls = function() {
        this.ctx.strokeStyle = '#343a40';
        if (this.topWall && this !== this.maze.startCell) {
            this.ctx.lineWidth = this.row === 0 ? 3 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x + this.width, this.y);
            this.ctx.stroke();
        }
        if (this.rightWall) {
            this.ctx.lineWidth = this.col === window.settings.width - 1 ? 3 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width, this.y);
            this.ctx.lineTo(this.x + this.width, this.y + this.width);
            this.ctx.stroke();
        }
        if (this.bottomWall && this !== this.maze.endCell) {
            this.ctx.lineWidth = this.row === window.settings.height - 1 ? 3 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y + this.width);
            this.ctx.lineTo(this.x + this.width, this.y + this.width);
            this.ctx.stroke();
        }
        if (this.leftWall) {
            this.ctx.lineWidth = this.col === 0 ? 3 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x, this.y + this.width);
            this.ctx.stroke();
        }
    }
}