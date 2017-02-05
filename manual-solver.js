function ManualSolver(settings, maze) {
    // input
    this.settings = settings;
    this.maze = maze;

    // private
    this.isActive = false;
    this.direction = '';
    this.lastMoveTime = +new Date;
    this.lastDirection = '';
    this.repeateSpeed = 70;
    this.eventHandlers = [];
    this.currentCell = undefined;
    this.path = [];

    this.activate = function () {
        if (this.isActive) {
            return;
        }
        console.log('activating solver');
        this.isActive = true;
        this.currentCell = this.maze.startCell;
        this.addEvent('keydown', this.keyDownHandler.bind(this));
        this.addEvent('keyup', this.keyUpHandler.bind(this));
        this.addEvent('touchstart', this.touchHandler.bind(this));
        this.addEvent('touchmove', this.touchHandler.bind(this));
        this.addEvent('touchend', this.touchEndHandler.bind(this));
    }

    this.reset = function () {
        console.log('resetting solver');
        this.isActive = false;
        this.currentCell = undefined;
        this.direction = '';
        this.path.length = 0;
        this.removeEvents();
    }

    this.addEvent = function (type, listener) {
        window.addEventListener(type, listener, false);
        this.eventHandlers.push({ type: type, listener: listener });
    }

    this.removeEvents = function () {
        for (var i = 0; i < this.eventHandlers.length; i++) {
            window.removeEventListener(this.eventHandlers[i].type, this.eventHandlers[i].listener, false);
        }
        this.eventHandlers.length = 0;
    }



    // Get the position of a touch relative to the canvas
    this.touchHandler = function (event) {
        var touchX = event.touches[0].clientX;
        var touchY = event.touches[0].clientY;
        var xMid = window.innerWidth / 2;
        var yMid = window.innerHeight / 2;
        if (Math.abs(touchX - xMid) > Math.abs(touchY - yMid)) {
            // moving horizontally
            if (touchX < xMid) {
                this.direction = 'w';
            }
            else {
                this.direction = 'e';
            }
        }
        else {
            // moving vertically
            console.log('moving vert');
            if (touchY < yMid) {
                this.direction = 'n';
            }
            else {
                this.direction = 's';
            }
        }
    }
    this.touchEndHandler = function (event) {
        this.direction = '';
    }
    this.keyDownHandler = function (event) {
        if (!this.isActive) {
            return;
        }

        if (event.keyCode === 38) { // up
            this.direction = 'n';
        }
        if (event.keyCode === 39) { // right
            this.direction = 'e';
        }
        if (event.keyCode === 40) { // down
            this.direction = 's';
        }
        if (event.keyCode === 37) { // left
            this.direction = 'w';
        }
    }
    this.keyUpHandler = function (event) {
        this.direction = '';
    }


    this.update = function () {
        if (!this.direction) {
            return;
        }

        var time = +new Date;
        if (this.lastDirection === this.direction && time < this.lastMoveTime + this.repeateSpeed) {
            return;
        }

        if (this.direction === 'n') {
            if (!this.currentCell.topWall) {
                this.currentCell = this.maze.cells[this.currentCell.row - 1][this.currentCell.col];
            }
        }
        if (this.direction === 'e') {
            if (!this.currentCell.rightWall) {
                this.currentCell = this.maze.cells[this.currentCell.row][this.currentCell.col + 1];
            }
        }
        if (this.direction === 's') {
            if (!this.currentCell.bottomWall) {
                this.currentCell = this.maze.cells[this.currentCell.row + 1][this.currentCell.col];
            }
        }
        if (this.direction === 'w') {
            if (!this.currentCell.leftWall) {
                this.currentCell = this.maze.cells[this.currentCell.row][this.currentCell.col - 1];
            }
        }
        this.lastDirection = this.direction;
        this.lastMoveTime = time;
        if (this.direction !== '') {
            if (this.currentCell === this.path[this.path.length - 2]) {
                this.path.pop();
            }
            else {
                if (this.currentCell !== this.path[this.path.length - 1]) {
                    this.path.push(this.currentCell);
                }
            }
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