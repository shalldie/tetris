var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tetris;
(function (Tetris) {
    var Shape;
    (function (Shape) {
        var Block = (function () {
            function Block(x, y, size, color) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
            }
            Block.prototype.clone = function () {
                return new Block(this.x, this.y, this.size, this.color);
            };
            Block.prototype.draw = function (ctx, xPos, yPos) {
                var x = (this.x + xPos) * this.size + 0.5;
                var y = (this.y + yPos) * this.size + 0.5;
                var round = 6;
                var wid = this.size - 1;
                var hei = this.size - 1;
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(x + round, y);
                ctx.arcTo(x + wid, y, x + wid, y + hei - round, round);
                ctx.arcTo(x + wid, y + hei, x + round, y + hei, round);
                ctx.arcTo(x, y + hei, x, y + round, round);
                ctx.arcTo(x, y, x + round, y, round);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                return this;
            };
            Block.prototype.offset = function (x, y) {
                this.x += x;
                this.y += y;
                return this;
            };
            return Block;
        }());
        Shape.Block = Block;
    })(Shape = Tetris.Shape || (Tetris.Shape = {}));
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    var Shape;
    (function (Shape_1) {
        var Block = Tetris.Shape.Block;
        var Shape = (function (_super) {
            __extends(Shape, _super);
            function Shape(x, y, size, color, blocks) {
                _super.call(this, x, y, size, color);
                this.blocks = blocks;
            }
            Shape.prototype.clone = function () {
                var newBlocks = this.blocks.map(function (b) { return b.clone(); });
                return new Shape(this.x, this.y, this.size, this.color, newBlocks);
            };
            Shape.newShape = function (x, y, size) {
                var blockArrs = [
                    [
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
                var len = blockArrs.length;
                var rndIndex = ~~(Math.random() * len);
                var arr = blockArrs[rndIndex];
                var colorArr = ["#2ad", "#CC3300", "#669966", "#CCCC33"];
                len = colorArr.length;
                rndIndex = ~~(Math.random() * len);
                var color = colorArr[rndIndex];
                var blocks = [];
                for (var m = 0; m < 4; m++) {
                    for (var n = 0; n < 4; n++) {
                        arr[m][n] && blocks.push(new Block(m, n, size, color));
                    }
                }
                return new Shape(x, y, size, color, blocks);
            };
            Shape.prototype.draw = function (ctx) {
                for (var i = 0, len = this.blocks.length; i < len; i++) {
                    this.blocks[i].draw(ctx, this.x, this.y);
                }
                return this;
            };
            Shape.prototype.rotate = function () {
                var rx0 = 1.5;
                var ry0 = 1.5;
                var func = function (x, y) {
                    var x0 = rx0 + ry0 - y;
                    var y0 = ry0 - rx0 + x;
                    return [x0, y0];
                };
                this.blocks.forEach(function (item) {
                    var tuple = func(item.x, item.y);
                    var x = tuple[0];
                    var y = tuple[1];
                    item.offset(x - item.x, y - item.y);
                });
                return this;
            };
            return Shape;
        }(Block));
        Shape_1.Shape = Shape;
    })(Shape = Tetris.Shape || (Tetris.Shape = {}));
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    var Shape = Tetris.Shape.Shape;
    var Logic = (function () {
        function Logic(width, height, size, ctx) {
            this.width = width;
            this.height = height;
            this.size = size;
            this.ctx = ctx;
            this.init();
        }
        Logic.prototype.init = function () {
            this.list = [];
            for (var x = 0; x < this.width; x++) {
                this.list.push(Array.apply(null, Array(this.height)).map(function (n) { return null; }));
            }
            this.newShape();
        };
        Logic.prototype.step = function () {
            if (!this.canMove(0, 1)) {
                this.newShape();
            }
            this.checkRow();
            this.goDown(true);
            this.draw();
        };
        Logic.prototype.checkRow = function (rowNum) {
            if (rowNum === undefined) {
                rowNum = this.height - 1;
            }
            else if (rowNum === 0) {
                this.pause();
                this.start();
                return this;
            }
            var fullRow = !this.list.some(function (row) { return !row[rowNum]; });
            if (fullRow) {
                for (var y = rowNum; y > 0; y--) {
                    for (var x = 0; x < this.width; x++) {
                        this.list[x][y] = this.list[x][y - 1];
                    }
                }
                this.checkRow(rowNum);
            }
            else {
                this.checkRow(rowNum - 1);
            }
            return this;
        };
        Logic.prototype.newShape = function () {
            var self = this;
            this.shape && this.shape.blocks.forEach(function (block) {
                var x = self.shape.x + block.x;
                var y = self.shape.y + block.y;
                block.x = x;
                block.y = y;
                self.list[x][y] = block;
            });
            var x = ~~(this.width / 2) - 2;
            var y = -2;
            this.shape = Shape.newShape(x, y, this.size);
        };
        Logic.prototype.canMove = function (x, y) {
            var self = this;
            return !self.shape.blocks.some(function (n) {
                var xPos = n.x + x + self.shape.x;
                var yPos = n.y + y + self.shape.y;
                if (xPos < 0 || xPos >= self.width || yPos >= self.height)
                    return true;
                return !!self.list[xPos][yPos];
            });
        };
        Logic.prototype.canRotate = function () {
            var self = this;
            var shape = this.shape.clone().rotate();
            return !shape.blocks.some(function (n) {
                var xPos = n.x + self.shape.x;
                var yPos = n.y + self.shape.y;
                if (xPos < 0 || xPos >= self.width || yPos >= self.height)
                    return true;
                return !!self.list[xPos][yPos];
            });
        };
        Logic.prototype.draw = function () {
            this.ctx.clearRect(0, 0, this.size * this.width, this.size * this.height);
            this.shape.draw(this.ctx);
            for (var x = 0; x < this.list.length; x++) {
                var col = this.list[x];
                for (var y = 0; y < col.length; y++) {
                    var block = col[y];
                    if (block) {
                        block.x = x;
                        block.y = y;
                        block.draw(this.ctx, 0, 0);
                    }
                }
            }
        };
        Logic.prototype.start = function () {
            var self = this;
            self.timer = setInterval(function () {
                self.step();
            }, 1000);
        };
        Logic.prototype.pause = function () {
            clearInterval(this.timer);
        };
        Logic.prototype.goDown = function (oneStep) {
            if (!this.canMove(0, 1)) {
                return;
            }
            if (!oneStep) {
                while (this.canMove(0, 1)) {
                    this.goDown(true);
                }
            }
            else {
                this.shape.offset(0, 1);
            }
            this.draw();
        };
        Logic.prototype.goLeft = function () {
            if (this.canMove(-1, 0)) {
                this.shape.offset(-1, 0);
            }
            this.draw();
        };
        Logic.prototype.goRight = function () {
            if (this.canMove(1, 0)) {
                this.shape.offset(1, 0);
            }
            this.draw();
        };
        Logic.prototype.goUp = function () {
            this.canRotate() && this.shape.rotate();
            this.draw();
        };
        return Logic;
    }());
    Tetris.Logic = Logic;
})(Tetris || (Tetris = {}));
