export class CoordinatesManager {
  static getCanvasDimensions(): { width: number; height: number } {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  static getMouseCoordinates(event: React.MouseEvent<HTMLCanvasElement>) {
    const { width, height } = this.getCanvasDimensions();
    return {
      x: event.clientX - width / 2,
      y: Math.floor(height * 0.95 - event.clientY),
      canvasX: event.clientX,
      canvasY: event.clientY,
    };
  }

  static toCanvasX(x: number): number {
    const { width } = this.getCanvasDimensions();
    return x + width / 2;
  }

  static toCanvasY(y: number): number {
    const { height } = this.getCanvasDimensions();
    return y === Infinity ? 0 : Math.floor(height * 0.95 - y);
  }

  static toX(canvasX: number): number {
    const { width } = this.getCanvasDimensions();
    return canvasX - width / 2;
  }

  static toY(canvasY: number): number {
    const { height } = this.getCanvasDimensions();
    return Math.floor(height * 0.95 - canvasY);
  }
}
