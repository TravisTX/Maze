function Cell(canvas, ctx, row, col) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.row = row;
    this.col = col;
    this.neighbors = [];
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.width = window.settings.cellSize;
    this.visited = false;

    this.x = this.col * this.width;
    this.y = this.row * this.width;

    this.update = function () {
    }

    this.render = function (isCurrent, isStart, isEnd) {
        this.ctx.fillStyle = "#495057";
        if (this.visited) {
            this.ctx.fillStyle = "#f8f9fa";
        }
        if (isStart) {
            this.ctx.fillStyle = "#8ce99a";
        }
        if (isEnd) {
            this.ctx.fillStyle = "#ffa8a8";
        }
        if (isCurrent) {
            this.ctx.fillStyle = "#da77f2";
        }
        this.ctx.fillRect(this.x, this.y, this.width, this.width);

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#495057';
        if (this.topWall) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x + this.width, this.y);
            this.ctx.stroke();
        }
        if (this.rightWall) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width, this.y);
            this.ctx.lineTo(this.x + this.width, this.y + this.width);
            this.ctx.stroke();
        }
        if (this.bottomWall) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y + this.width);
            this.ctx.lineTo(this.x + this.width, this.y + this.width);
            this.ctx.stroke();
        }
        if (this.leftWall) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x, this.y + this.width);
            this.ctx.stroke();
        }
    }
}