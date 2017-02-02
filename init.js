(function () {
    var Settings = function () {
        this.width = 30;
        this.height = 30;
        this.cellSize = window.innerWidth < 620 ? 10 : 20;
        this.speed = 5;
        this.bias = '';
        this.Generate = undefined;
        this.maxSpeed = 11;
    }
    var Maze = function() {
        this.cells = [];
        this.startCell = undefined;
        this.endCell = undefined;
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
    }

    var statusLabel = document.getElementById('statusLabel');
    
    var settings = new Settings();
    settings.Generate = reset; // assign the generate button event handler
    var maze = new Maze();
    var generator = new Generator(settings, maze);
    var solver = new Solver(settings, maze);

    function init() {
        var gui = new dat.GUI();
        gui.add(settings, 'width', 10, 100).step(1);
        gui.add(settings, 'height', 10, 100).step(1);
        gui.add(settings, 'cellSize', 10, 30).step(1);
        gui.add(settings, 'speed', 1, settings.maxSpeed).step(1);
        gui.add(settings, 'bias', { Neutral: '', Horizontal: 'h', Vertical: 'v' });
        gui.add(settings, 'Generate');
        window.settings = settings;
        reset();
    }
    init();

    function reset() {
        generator.reset();
        solver.reset();
        update();
    }


    function update() {
        generator.update();
        solver.update();
        statusLabel.innerText = 'generating at ' + Math.round(generator.fps) + " fps";
        render();

        if (!generator.generating) {
            statusLabel.innerText = 'done generating.  now solve!';
            solver.activate();
        }
        requestAnimationFrame(update);
    }

    function render() {
        maze.ctx.fillStyle = "#f8f9fa";
        maze.ctx.fillRect(0, 0, maze.canvas.width, maze.canvas.height);
        for (var row = 0; row < maze.cells.length; row++) {
            for (var col = 0; col < maze.cells[row].length; col++) {
                maze.cells[row][col].render();
            }
        }
        generator.render();
        solver.render();
    }

})();
