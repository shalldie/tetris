// 扩展canvas
CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, wid, hei, round) {
    this.beginPath();
    this.moveTo(x + round, y);
    this.arcTo(x + wid, y, x + wid, y + hei - round, round);
    this.arcTo(x + wid, y + hei, x + round, y + hei, round);
    this.arcTo(x, y + hei, x, y + round, round);
    this.arcTo(x, y, x + round, y, round);
    this.closePath();
    this.fill();
};

/*
* 点
*/
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    offset(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    clone() {
        return Object.assign({}, this);
    }

    static new() {
        // 任性的代码，去实现优雅的继承
        var argStr = [].map.call(arguments, (n, i) => `arguments[${i}]`).join(",");
        return eval(`new this(${argStr})`);
    }
}

/*
* Block
*/
class Block extends Point {
    constructor(x, y, color, size, ctx) {
        super(x, y);
        this.color = color;
        this.size = size;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRoundRect(this.x * this.size + 0.5, this.y * this.size + 0.5, this.size - 1, this.size - 1, 6);
        this.ctx.restore();
        return this;
    }

    static new(x, y, color, size, ctx) {
        return new this(x, y, color, size, ctx);
    }
}

/*
* Shape
*/
class Shape extends Point {
    constructor(x, y, blocks) {
        super(x, y);
        this.blocks = blocks || [];
    }

    rotate() {
        var x0 = this.x,
            y0 = this.y;

        var arr = [];

        var func = (x, y) => {
            return new Point(x0 + y0 - y + 4, x - x0 + y0);
        };

        for (var i = 0, len = this.blocks.length; i < len; i++) {
            let item = this.blocks[i];
            var newItem = func(item.x, item.y);
            // item.x = newItem.x;
            // item.y = newItem.y;

            arr.push(Block.new(newItem.x, newItem.y, item.color, item.size, item.ctx));
        }
        // this.draw();

        return new Shape(this.x, this.y, arr);
        // return Object.assign({}, this);
    }

    offset(x, y) {
        super.offset(x, y);
        this.blocks.forEach(n => n.offset(x, y));
    }

    draw() {
        this.blocks.forEach(n => n.draw());
    }
}

class ShapeFactory {
    static new(x, y, size, ctx) {
        var blockArrs = [
            [   //所有方块类型
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ], [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ], [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]];


        var colorArr = ["#2ad", "#CC3300", "#669966", "#CCCC33"];

        // arr end
        var blockArr = blockArrs[Math.floor(Math.random() * blockArrs.length)];  // 形状
        var color = colorArr[Math.floor(Math.random() * colorArr.length)];       //颜色
        var blocks = [];
        for (let xp = 0, xlen = blockArr.length; xp < xlen; xp++) {
            for (let yp = 0, ylen = blockArr[yp].length; yp < ylen; yp++) {
                // blockArr[xp][yp] && blocks.push(Block.new(this.x + xp, this.y + yp, color, size, ctx));
                blockArr[xp][yp] && blocks.push(
                    new Block(x + xp, y + yp, color, size, ctx)
                );
            }
        }
        return new Shape(x || 0, y || 0, blocks);
    }
}

class Logic {
    constructor(width, height, size, ctx, bgcolor) {
        this.width = width;
        this.height = height;
        this.size = size;
        this.ctx = ctx;
        this.bgcolor = bgcolor;
        this.init();
    }

    init() {
        // 构建二维数组，作为判断依据
        // let cells = Array.apply(null, Array(this.width));
        // cells.map(n => Array.apply(null, Array(this.height)));
        this.cells = [];
        this.newShape();
    }

    start(level) {
        this.pause();
        var levelArr = [1000, 800, 600];
        var self = this;
        this.timer = setInterval(function () {
            self.goDown();
        }, levelArr[level || 0]);
    }

    pause() {
        clearInterval(this.timer);
    }

    newShape() {
        this.shape = ShapeFactory.new(~~(this.width / 2) - 2, -2, this.size, this.ctx);
    }

    goTop() {
        var self = this;
        var newShape = this.shape.rotate();
        var canRotate = !newShape.blocks.some(block =>
            block.x < 0 ||
            block.x >= self.width ||
            block.y >= self.height ||
            self.cells.some(cell => cell.x == block.x && cell.y == block.y)
        );

        if (!canRotate) return this;

        this.shape = newShape;

        this.draw();
    }

    goLeft() {
        let cells = this.cells;
        let canLeft = !this.shape.blocks.some(block =>
            block.x <= 0 ||
            cells.some(cell =>
                block.x - 1 == cell.x && block.y == cell.y
            )
        );

        if (!canLeft) return;

        this.shape.offset(-1, 0);
        this.draw();
    }

    goRight() {
        let self = this;
        let cells = this.cells;
        let canRight = !this.shape.blocks.some(block =>
            block.x >= self.width - 1 ||
            cells.some(cell =>
                block.x + 1 == cell.x && block.y == cell.y
            )
        );

        if (!canRight) return;

        this.shape.offset(1, 0);
        this.draw();
    }

    goDown() {
        let self = this;
        let cells = this.cells;
        let canDown = !this.shape.blocks.some(block =>
            block.y >= self.height - 1  // 到了底部
            ||
            cells.some(cell =>  //有方块阻挡
                block.x == cell.x && block.y + 1 == cell.y
            )
        );

        // let canDown = !this.cells.some(arr =>
        //     arr.some(n => n.y == shape.y + 1 && n.x == shape.x)
        // );
        if (!canDown) {  // 下移禁止，重启方块
            [].push.apply(this.cells, this.shape.blocks);
            this.check();
            this.newShape();
            return;
        }

        this.shape.offset(0, 1);
        this.draw();
    }

    draw() {
        //清空画布
        this.ctx.clearRect(0, 0, this.width * this.size, this.height * this.size);

        //画出之前的格子和当前shape
        // this.cells.forEach(arr =>
        //     arr.forEach(n => n && n.draw())
        // );
        this.cells.forEach(n => n.draw());
        this.shape.draw();
    }

    check() {
        for (let i = this.height - 1; i > 0; i--) {
            //检测该行是否已经填满
            var row = this.cells.filter(item => item.y == i);
            if (row.length < this.width) continue;
            // 如果填满，上部所有模块下移
            this.cells = this.cells.filter(item => i != item.y);
            this.cells.filter(item => item.y < i).forEach(n => n.offset(0, 1));
            i++;
            // break;
        } // for end
    }
}

window.onload = function () {
    var xnum = 10;
    var ynum = 16;
    var size = 50;


    var wrap = document.getElementById("wrap");

    var canvas = document.getElementById("demo");

    wrap.style.width = xnum * size + "px";
    wrap.style.height = ynum * size + "px";
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;


    var ctx = canvas.getContext("2d");

    var logic = new Logic(xnum, ynum, size, ctx, "#fff");
    logic.start(2);
    window.logic = logic;


    //key
    document.body.onkeydown = function (e) {
        var dict = {
            "37": logic.goLeft,
            "38": logic.goTop,
            "39": logic.goRight,
            "40": logic.goDown
        };
        dict[e.keyCode] && dict[e.keyCode].call(logic);
    };
}