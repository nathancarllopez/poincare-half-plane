import { useState, useRef, useEffect } from 'react';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Question:
   * Here I want to initialize the canvas' dimensions based on the window dimensions.
   * My motivation to separate it was that none of the drawings should depend on the window dimensions.
   * Moreover, if I want this to work on mobile devices I suspect that this might be a good place to put code
   * that changes the layout based on whether you're on a mobile device or not. Does that make sense?
   * Should this be in its own component?
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  /**
   * Question:
   * Each of the shapes I'm drawing is right now an object with a "type" (a string) and some other properties (consisting of numbers or other shape objects).
   * How do I get typescript to chill out about the way these objects are structured? The type declaration on the line that I define the shapes state, and I'm also getting a big complaint from VS Code when I call setShapes in the addLineWithClick function.
   * Should I define a "Shapes" class and have each shape be an instance of that class? Or is there a different way that Typescript handles this?
   */
  const startingShapes = [
    { type: 'axis', start: { x: 0, y: window.innerHeight * 0.95 }, end: { x: window.innerWidth, y: window.innerHeight * 0.95 } },
    { type: 'axis', start: { x: window.innerWidth / 2, y: 0 }, end: { x: window.innerWidth / 2, y: window.innerHeight * 0.95 } },
  ];
  const [shapes, setShapes] = useState<{ type: string; [key: string]: any }[]>(startingShapes);

  function drawShapes(context: CanvasRenderingContext2D) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    shapes.forEach((shape) => {
      switch (shape.type) {
        case 'axis': {
          drawAxis(context, shape);
          break;
        }
        case 'cursor': {
          drawCursor(context, shape);
          break;
        }
        case 'clickedPoint':
        case 'point': {
          drawPoint(context, shape);
          break;
        }
        case 'geodesicCircle':
        case 'geodesicVertical': {
          drawGeodesic(context, shape);
          break;
        }
      }
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    drawShapes(context);
  }, [shapes]);

  /**
   * Question:
   * I've defined this function and the next one inside the component for now for simplicitiy, but I think they ought to be passed as props from a parent component. This is because clicking and mouse moving will be used for other things in the future, i.e., they will be one of a few options that are selected by the user with a Toolbar component (that I have yet to write). Then I'll need some parent component to keep track of which tool is selected and pass the appropriate function to this component based on what the user has done. Does that make sense?
   */
  function displayCursorCoordinates(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coordinates = getCoordFromMouse(canvas, event);
    const shapesWithoutCursor = [...shapes].filter((shape) => shape.type !== 'cursor');
    setShapes([...shapesWithoutCursor, { type: 'cursor', ...coordinates }]);
  }

  function addLineWithClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coordinates = getCoordFromMouse(canvas, event);
    if (coordinates.y < 0) return;

    const clicked = { type: 'clickedPoint', ...coordinates };
    const firstClicked = shapes.find((shape) => shape.type === 'clickedPoint');

    if (firstClicked) {
      const newShapes = [
        { ...firstClicked, type: 'point'},
        { ...clicked, type: 'point' },
        ...shapes.filter((shape) => shape.type !== 'clickedPoint'),
        getGeodesic(canvas, firstClicked, clicked)
      ];
      setShapes(newShapes);
    } else {
      setShapes([...shapes, clicked]);
    }
  }

  return <canvas ref={canvasRef} onMouseMove={displayCursorCoordinates} onClick={addLineWithClick} />;
}

function getCoordFromMouse(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) {
  return {
    x: event.clientX - canvas.width / 2,
    y: Math.floor(canvas.height * 0.95 - event.clientY),
    canvasX: event.clientX,
    canvasY: event.clientY,
  }
}

function getCoordFromMath(canvas: HTMLCanvasElement, x: number, y: number) {
  return {
    x,
    y,
    canvasX: x + canvas.width / 2,
    canvasY: y === Infinity ? 0 : Math.floor(canvas.height * 0.95 - y),
  }
}

function getGeodesic(canvas: HTMLCanvasElement, start: { type: string; [key: string]: any }, end: { type: string; [key: string]: any }) {
  const geodesicValues = computeGeodesicValues(start, end);

  if (geodesicValues.type === 'vertical') {
    return {
      type: 'geodesicVertical',
      start: getCoordFromMath(canvas, start.x, 0),
      end: getCoordFromMath(canvas, start.x, Infinity),
    }
  }
  
  if (geodesicValues.type === 'circle') {
    return {
      type: 'geodesicCircle',
      center: getCoordFromMath(canvas, geodesicValues.center, 0),
      radius: geodesicValues.radius,
    }
  }
}

function computeGeodesicValues(start: { type: string; [key: string]: any }, end: { type: string; [key: string]: any }) {
  const EPSILON = 1e-6;

  if (Math.abs(start.x - end.x) < EPSILON) {
    if (Math.abs(start.y - end.y) < EPSILON) {
      throw new Error('The two points are the same');
    }
    return {
      type: 'vertical',
      center: Infinity,
      radius: Infinity
    };
  }

  const [midpointX, midpointY] = [(start.x + end.x) / 2, (start.y + end.y) / 2];
  const slope = (end.y - start.y) / (end.x - start.x);
  if (Math.abs(slope) < EPSILON) {
    return {
      type: 'circle',
      center: midpointX,
      radius: Math.sqrt((start.x - midpointX) ** 2 + start.y ** 2),
    };
  }

  const perpendicularSlope = -1 / slope;
  const perpYIntercept = midpointY - perpendicularSlope * midpointX;
  const center = -perpYIntercept / perpendicularSlope;
  return {
    type: 'circle',
    center: center,
    radius: Math.sqrt((start.x - center) ** 2 + start.y ** 2),
  };
}

function drawAxis(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
  context.strokeStyle = 'black';
  context.beginPath();
  context.moveTo(shape.start.x, shape.start.y);
  context.lineTo(shape.end.x, shape.end.y);
  context.stroke();
}

function drawCursor(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
  context.fillStyle = 'black';
  context.font = '20px Arial';
  context.fillText(`(${shape.x}, ${shape.y})`, shape.canvasX + 10, shape.canvasY - 10);
}

function drawPoint(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
  context.fillStyle = shape.type === 'point' ? 'black' : 'red';
  context.beginPath();
  context.arc(shape.canvasX, shape.canvasY, 5, 0, 2 * Math.PI);
  context.fill();
}

function drawGeodesic(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
  context.strokeStyle = 'black';
  context.beginPath();
  if (shape.type === 'geodesicVertical') {
    context.moveTo(shape.start.canvasX, shape.start.canvasY);
    context.lineTo(shape.end.canvasX, shape.end.canvasY);
  } else {
    context.arc(shape.center.canvasX, shape.center.canvasY, shape.radius, 0, Math.PI, true);
  }
  context.stroke();
}