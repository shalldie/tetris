/// <reference path="./Block.ts" />
namespace Tetris.Shape {
    import Block = Tetris.Shape.Block;
    /**
     * 形状类，表示若干个方块的组合
     */
    export class Shape extends Block {
        public blocks: Block[];

        constructor(x: number, y: number, size: number, color: string, blocks: Block[]) {
            super(x, y, size, color);
            this.blocks = blocks;
        }

        /**
         * 创建副本
         */
        public clone(): Shape {
            let newBlocks = this.blocks.map(b => b.clone());

            return new Shape(this.x, this.y, this.size, this.color, newBlocks);
        }

        public static newShape(x: number, y: number, size: number): Shape {

            // 随即个方块类型

            let blockArrs = [
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

            let len = blockArrs.length;

            let rndIndex = ~~(Math.random() * len);  // 随即个索引

            let arr = blockArrs[rndIndex];

            // 随即个颜色

            var colorArr = ["#2ad", "#CC3300", "#669966", "#CCCC33"];

            len = colorArr.length;

            rndIndex = ~~(Math.random() * len);  // 随即个索引 

            let color = colorArr[rndIndex];     // 随即出颜色

            // 生成blocks

            let blocks: Block[] = [];
            for (var m = 0; m < 4; m++) {
                for (var n = 0; n < 4; n++) {
                    arr[m][n] && blocks.push(new Block(m, n, size, color));
                }
            }

            return new Shape(x, y, size, color, blocks);
        }

        /**
         * 画出自身图形 
         */
        public draw(ctx: CanvasRenderingContext2D) {
            for (let i = 0, len = this.blocks.length; i < len; i++) {
                this.blocks[i].draw(ctx, this.x, this.y);
            }
            return this;
        }

        /**
         * 旋转
         */
        public rotate() {
            // x0= rx0 + ry0 -y;
            // y0= ry0 - rx0 +x;

            let rx0 = 1.5;
            let ry0 = 1.5;
            let func = function (x: number, y: number): [number, number] {
                let x0 = rx0 + ry0 - y;
                let y0 = ry0 - rx0 + x;
                return [x0, y0];
            };
            this.blocks.forEach(item => {
                let tuple = func(item.x, item.y);
                let x = tuple[0];
                let y = tuple[1];
                item.offset(x - item.x, y - item.y);
            });
            return this;
        }
    }

}