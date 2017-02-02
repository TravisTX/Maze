function Solver(settings, maze) {
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

    this.activate = function () {
        if (this.isActive) {
            return;
        }
        console.log('activating solver');
        this.isActive = true;
        this.maze.solverCurrentCell = this.maze.startCell;
        this.addEvent('keydown', this.keyDownHandler.bind(this));
        this.addEvent('keyup', this.keyUpHandler.bind(this));
        this.addEvent('touchstart', this.touchHandler.bind(this));
        this.addEvent('touchmove', this.touchHandler.bind(this));
        this.addEvent('touchend', this.touchEndHandler.bind(this));
    }

    this.reset = function () {
        console.log('resetting solver');
        this.isActive = false;
        this.maze.solverCurrentCell = undefined;
        this.direction = '';
        this.removeEvents();
    }

    this.addEvent = function(type, listener) {
        window.addEventListener(type, listener, false);
        this.eventHandlers.push({type: type, listener: listener});
    }

    this.removeEvents = function() {
        for(var i = 0; i < this.eventHandlers.length; i++) {
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
        console.log('touch: ' + touchX + ' / ' + touchY + ' ' + this.direction);
    }
    this.touchEndHandler = function (event) {
        this.direction = '';
    }
    this.keyDownHandler = function (event) {
        console.log('key down ' + this.isActive);
        if (!this.isActive) {
            return;
        }
        console.log('up keyPressed: ' + event.keyCode);

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
            if (!this.maze.solverCurrentCell.topWall) {
                this.maze.solverCurrentCell = this.maze.cells[this.maze.solverCurrentCell.row - 1][this.maze.solverCurrentCell.col];
            }
        }
        if (this.direction === 'e') {
            if (!this.maze.solverCurrentCell.rightWall) {
                this.maze.solverCurrentCell = this.maze.cells[this.maze.solverCurrentCell.row][this.maze.solverCurrentCell.col + 1];
            }
        }
        if (this.direction === 's') {
            if (!this.maze.solverCurrentCell.bottomWall) {
                this.maze.solverCurrentCell = this.maze.cells[this.maze.solverCurrentCell.row + 1][this.maze.solverCurrentCell.col];
            }
        }
        if (this.direction === 'w') {
            if (!this.maze.solverCurrentCell.leftWall) {
                this.maze.solverCurrentCell = this.maze.cells[this.maze.solverCurrentCell.row][this.maze.solverCurrentCell.col - 1];
            }
        }
        this.lastDirection = this.direction;
        this.lastMoveTime = time;
    }

}