namespace Tetris.Shape {

    export interface ShapeInterface {
        x: number,
        y: number,
        size: number,
        color: string,
        draw(ctx: CanvasRenderingContext2D, xPos?: number, yPos?: number): any
    }
}