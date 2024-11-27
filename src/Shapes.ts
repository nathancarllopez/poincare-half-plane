import { CoordinatesManager } from "./CoordinatesManager";
import { POINT_COLOR, POINT_RADIUS, LABEL_COLOR, LABEL_FONT, AXIS_COLOR, GEODESIC_COLOR, EPSILON } from "./Constants";

export interface Shape {
  type: string;
  draw(context?: CanvasRenderingContext2D): void;
}

export class Point implements Shape {
  public type = "Point";
  public x: number;
  public y: number;
  public canvasX: number;
  public canvasY: number;
  public color: string;

  constructor(x?: number, y?: number, canvasX?: number, canvasY?: number, color: string = POINT_COLOR) {
    const onlyMathCoordsGiven = x !== undefined
      && y !== undefined
      && canvasX === undefined
      && canvasY === undefined;
    const onlyCanvasCoordsGiven = x === undefined
      && y === undefined
      && canvasX !== undefined
      && canvasY !== undefined;
    
    if (onlyMathCoordsGiven) {
      const { width, height } = CoordinatesManager.getCanvasDimensions();

      this.x = x;
      this.y = y;
      this.canvasX = x + width / 2;
      this.canvasY = y === Infinity ? 0 : Math.floor(height * 0.95 - y);
    }
    
    else if (onlyCanvasCoordsGiven) {
      const { width, height } = CoordinatesManager.getCanvasDimensions();

      this.x = canvasX - width / 2;
      this.y = Math.floor(height * 0.95 - canvasY);
      this.canvasX = canvasX;
      this.canvasY = canvasY;
    }
    
    else {
      throw new Error("Point constructor must be called with either math coordinates or canvas coordinates, not both.");
    }

    this.color = color;
  }

  setType(type: string): Point {
    this.type = type;
    return this;
  }

  setColor(color: string): Point {
    this.color = color;
    return this;
  }

  getCoordinates(): { x: number; y: number, canvasX: number, canvasY: number } {
    return { x: this.x, y: this.y, canvasX: this.canvasX, canvasY: this.canvasY };
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.canvasX, this.canvasY, POINT_RADIUS, 0, 2 * Math.PI);
    context.fill();
  }
}

export class Cursor extends Point {
  public readonly type = "Cursor";

  constructor(
    x?: number,
    y?: number,
    canvasX?: number,
    canvasY?: number,
  ) {
    super(x, y, canvasX, canvasY);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = LABEL_COLOR;
    context.font = LABEL_FONT;
    context.fillText(`(${this.x}, ${this.y})`, this.canvasX + 10, this.canvasY - 10);
  }
}

export class Axis implements Shape {
  public readonly type = "Axis";

  constructor(
    public start: Point,
    public end: Point,
    public color: string = AXIS_COLOR,
  ) {}

  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo(this.start.canvasX, this.start.canvasY);
    context.lineTo(this.end.canvasX, this.end.canvasY);
    context.stroke();
  }
}

export class Geodesic implements Shape {
  public readonly type = "Geodesic";
  public anchors: Point[];
  public endpoints: Point[];
  public center: Point | undefined;
  public radius: number = Infinity;
  public color: string;

  constructor(clicked1: Point, clicked2: Point, color: string = GEODESIC_COLOR) {
    const deltaX = clicked2.x - clicked1.x;
    const deltaY = clicked2.y - clicked1.y;
    const [midpointX, midpointY] = [(clicked1.x + clicked2.x) / 2, (clicked1.y + clicked2.y) / 2];

    if (Math.abs(deltaX) < EPSILON) {
      if (Math.abs(deltaY) < EPSILON) {
        throw new Error('The two points are the same');
      }

      this.anchors = [clicked1, clicked2].sort((a, b) => a.y - b.y);
      this.endpoints = [new Point(this.anchors[0].x, 0), new Point(this.anchors[0].x, Infinity)];
    }

    else {
      this.anchors = [clicked1, clicked2].sort((a, b) => a.x - b.x);

      if (Math.abs(deltaY) < EPSILON) {
        this.center = new Point(midpointX, 0);
      } else {
        const slope = deltaY / deltaX;
        const perpendicularSlope = -1 / slope;
        const perpYIntercept = midpointY - perpendicularSlope * midpointX;
        const centerX = -perpYIntercept / perpendicularSlope;
        this.center = new Point(centerX, 0);
      }

      this.radius = Math.sqrt((clicked1.x - this.center.x) ** 2 + clicked1.y ** 2);
      this.endpoints = [
        new Point(this.center.x - this.radius, 0),
        new Point(this.center.x + this.radius, 0),
      ];
    }

    this.color = color;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.color;
    context.beginPath();

    if (this.radius === Infinity) {
      context.moveTo(this.endpoints[0].canvasX, this.endpoints[0].canvasY);
      context.lineTo(this.endpoints[1].canvasX, this.endpoints[1].canvasY);
    }

    else if (this.center) {
      context.arc(this.center.canvasX, this.center.canvasY, this.radius, 0, Math.PI, true);
    }

    context.stroke();
  }
}