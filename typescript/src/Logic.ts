/// <reference path="./Shape/Shape.ts" />
namespace Tetris {

    import Shape = Tetris.Shape.Shape;

    import Block = Tetris.Shape.Block;

    /**
     * 逻辑类，用于控制游戏
     */
    export class Logic {

        private width: number;

        private height: number;

        private size: number;

        private ctx: CanvasRenderingContext2D;

        private timer: number;

        private list: Block[][];      // 静止的所有方块

        private shape: Shape;          // 当前活动的模块

        constructor(width: number, height: number, size: number, ctx: CanvasRenderingContext2D) {
            this.width = width;
            this.height = height;
            this.size = size;
            this.ctx = ctx;
            this.init();
        }

        /**
         * 初始化工作 
         */
        private init() {
            // 初始化列表
            this.list = [];
            for (let x = 0; x < this.width; x++) {
                this.list.push(Array.apply(null, Array(this.height)).map(n => null));
            }

            // 初始化模块
            this.newShape();
        }

        //---------------------- step相关 ----------------------

        /**
         * 每次执行的行为入口 
         */
        private step() {
            if (!this.canMove(0, 1)) {
                this.newShape();
            }

            this.checkRow();

            this.goDown(true);

            this.draw();
        }

        /**
         * 检查，并消除行 
         */
        private checkRow(rowNum?: number) {
            if (rowNum === undefined) {
                rowNum = this.height - 1;
            } else if (rowNum === 0) {
                this.pause();
                this.start();
                return this;
            }

            let fullRow = !this.list.some(row => !row[rowNum]);

            if (fullRow) {   //如果这一行满了
                for (let y = rowNum; y > 0; y--) {                 //整体下移
                    for (let x = 0; x < this.width; x++) {
                        this.list[x][y] = this.list[x][y - 1];
                    }
                }
                this.checkRow(rowNum);  // 再次从当前行开始检查
            } else {
                this.checkRow(rowNum - 1);
            }
            return this;   // 万一要用上链式调用呢  0.0 
        }


        /**
         * 生成一个新模块 
         */
        private newShape() {
            let self = this;

            // 保存旧的shape到背景
            this.shape && this.shape.blocks.forEach(block => {
                let x = self.shape.x + block.x;
                let y = self.shape.y + block.y;
                block.x = x;
                block.y = y;
                self.list[x][y] = block;
            });

            // 生成新的shape
            let x = ~~(this.width / 2) - 2;
            let y = -2;
            this.shape = Shape.newShape(x, y, this.size);
        }

        /**
         * 是否可以移动 
         */
        private canMove(x: number, y: number): boolean {
            let self = this;
            return !self.shape.blocks.some(n => {
                let xPos = n.x + x + self.shape.x;
                let yPos = n.y + y + self.shape.y;

                // 出界
                if (xPos < 0 || xPos >= self.width || yPos >= self.height) return true;

                // 有方块阻碍 
                return !!self.list[xPos][yPos];
            });
        }

        /**
         * 是否可以旋转 
         */
        private canRotate(): boolean {
            let self = this;
            let shape = this.shape.clone().rotate();
            return !shape.blocks.some(n => {
                let xPos = n.x + self.shape.x;
                let yPos = n.y + self.shape.y;

                // 出界
                if (xPos < 0 || xPos >= self.width || yPos >= self.height) return true;

                // 有方块阻碍 
                return !!self.list[xPos][yPos];
            });
        }

        /**
         * 画出所有
         */
        private draw() {
            this.ctx.clearRect(0, 0, this.size * this.width, this.size * this.height);
            this.shape.draw(this.ctx);

            for (let x = 0; x < this.list.length; x++) {
                let col = this.list[x];
                for (let y = 0; y < col.length; y++) {
                    let block = col[y];
                    if (block) {
                        block.x = x;
                        block.y = y;
                        block.draw(this.ctx, 0, 0);
                    }
                }
            }

            // this.list.forEach(rows => {
            //     rows.forEach(block => {
            //         block && block.draw(self.ctx, 0, 0);
            //     });
            // });
        }

        //---------------------- 开始/暂停 ----------------------

        /**
         * 开始游戏
         */
        public start() {
            let self = this;
            self.timer = setInterval(function () {
                self.step();
            }, 1000);
        }

        /**
         * 暂停 
         */
        public pause() {
            clearInterval(this.timer);
        }
        //---------------------- 控制 ----------------------

        /**
         * 向下 
         */
        public goDown(oneStep?: boolean) {
            if (!this.canMove(0, 1)) {
                return;
            }

            if (!oneStep) {  // 如果是一路向下
                while (this.canMove(0, 1)) {
                    this.goDown(true);
                }
            } else {         // 如果只向下一格
                this.shape.offset(0, 1);
            }
            this.draw();
        }

        /**
         * 向左 
         */
        public goLeft() {
            if (this.canMove(-1, 0)) {
                this.shape.offset(-1, 0);
            }
            this.draw();
        }

        /**
         * 向右 
         */
        public goRight() {
            if (this.canMove(1, 0)) {
                this.shape.offset(1, 0);
            }
            this.draw();
        }

        /**
         * 旋转 
         */
        public goUp() {
            this.canRotate() && this.shape.rotate();
            this.draw();
        }
    }
}