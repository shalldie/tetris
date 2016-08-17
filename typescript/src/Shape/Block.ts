/// <reference path="./ShapeInterface.ts" />
namespace Tetris.Shape {
    /**
     * 方块类，表示一个格子
     */
    export class Block implements ShapeInterface {
        /**
         * x 轴坐标
         */
        public x: number;

        /**
         * y 轴坐标 
         */
        public y: number;

        /**
         * 尺寸 
         */
        public size: number;

        /**
         * 颜色 
         */
        public color: string;

        constructor(x: number, y: number, size: number, color: string) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
        }

        /**
         * 创造副本
         */
        public clone(): Block {
            return new Block(this.x, this.y, this.size, this.color);
        }

        /**
         * 画出自身 
         */
        public draw(ctx: CanvasRenderingContext2D, xPos: number, yPos: number) {
            let x = (this.x + xPos) * this.size + 0.5;
            let y = (this.y + yPos) * this.size + 0.5;
            let round = 6;
            let wid = this.size - 1;
            let hei = this.size - 1;

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
        }

        /**
         * 移动 
         */
        public offset(x: number, y: number) {
            this.x += x;
            this.y += y;
            return this;
        }
    }
}