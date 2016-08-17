var wid = 10;  // x 轴有10个格子
var hei = 18;
var size = 40;  // 每个格子尺寸

var canvas = document.getElementById("demo");
canvas.width = wid * size;
canvas.height = hei * size;

canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var logic = new Tetris.Logic(wid, hei, size, canvas.getContext("2d"));

document.body.addEventListener('keydown', function (ex) {
    // 87 83 65 68
    var dict = {
        '87': function () {
            logic.goUp();
        },
        '83': function () {
            logic.goDown();
        },
        '65': function () {
            logic.goLeft();
        },
        '68': function () {
            logic.goRight();
        }
    };
    dict[ex.keyCode] && dict[ex.keyCode]();
});

logic.start();