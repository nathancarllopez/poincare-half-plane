import { useState, useRef, useEffect } from 'react';
import { Shape, Point, Cursor, Axis, Geodesic } from './Shapes';
import { CoordinatesManager } from './CoordinatesManager';
import ToolbarConfig from './ToolbarConfig';
import { CANVAS_BACKGROUND_COLOR } from './Constants';

export default function Canvas({ toolbarConfig }: { toolbarConfig: ToolbarConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      console.log('resize');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context = canvas.getContext('2d');
      if (!context) return;

      drawAll(context);
    });
  }, []);

  const leftInfinity = new Point(undefined, undefined, 0, window.innerHeight * 0.95);
  const rightInfinity = new Point(undefined, undefined, window.innerWidth, window.innerHeight * 0.95);
  const topInfinity = new Point(undefined, undefined, window.innerWidth / 2, 0);
  const origin = new Point(0, 0);
  const axes = [ new Axis(leftInfinity, rightInfinity), new Axis(topInfinity, origin)];
  const [shapes, setShapes] = useState<Shape[]>(axes);

  function wipeCanvas(context: CanvasRenderingContext2D) {
    context.fillStyle = CANVAS_BACKGROUND_COLOR;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function drawAll(context: CanvasRenderingContext2D) {
    wipeCanvas(context);
    shapes.forEach(shape => shape.draw(context));
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    drawAll(context); // Consider adding the drawAll code here if the logic stays simple
  }, [shapes]);

  // function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    // To do: if more mousemove logic is added, extend this function like how handleClick is extended
  // }

  function displayCursorCoordinates(event: React.MouseEvent<HTMLCanvasElement>) {
    const { canvasX, canvasY } = CoordinatesManager.getMouseCoordinates(event);
    const shapesWithoutCursor = shapes.filter((shape) => shape.type !== 'Cursor');
    const finalShapes = [...shapesWithoutCursor];

    if (toolbarConfig.getToolbarValue('cursorCoordToggle')) {
      finalShapes.push(new Cursor(undefined, undefined, canvasX, canvasY));
    }

    setShapes(finalShapes);
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    switch (toolbarConfig.getToolbarValue('clickTool')) {
      case 'drawPoints': {
        addPointWithClick(event);
        break;
      }
      case 'drawGeodesics': {
        addGeodesicWithClick(event);
        break;
      }
    }
  }

  function addPointWithClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const coordinates = CoordinatesManager.getMouseCoordinates(event);
    if (coordinates.y < 0) return;

    setShapes([...shapes, new Point(coordinates.x, coordinates.y)]);
  }

  function addGeodesicWithClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const coordinates = CoordinatesManager.getMouseCoordinates(event);
    if (coordinates.y < 0) return;

    const clicked = new Point(coordinates.x, coordinates.y);
    const firstClicked = shapes.find(shape => shape.type === 'ClickedPoint') as Point | undefined;

    if (!firstClicked) {
      const coloredAndClicked = clicked.setType('ClickedPoint').setColor('red');
      setShapes([...shapes, coloredAndClicked]);
      return;
    }

    const shapesWithoutClicked = shapes.filter(shape => shape.type !== 'clickedPoint');
    setShapes([
      ...shapesWithoutClicked,
      clicked.setColor('green'),
      firstClicked.setType('Point').setColor('green'),
      new Geodesic(firstClicked, clicked)
    ]);
  }

  return <canvas ref={canvasRef} onMouseMove={displayCursorCoordinates} onClick={handleClick} />;
}

// function getCoordFromMouse(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) {
//   return {
//     x: event.clientX - canvas.width / 2,
//     y: Math.floor(canvas.height * 0.95 - event.clientY),
//     canvasX: event.clientX,
//     canvasY: event.clientY,
//   }
// }

// function getCoordFromMath(canvas: HTMLCanvasElement, x: number, y: number) {
//   return {
//     x,
//     y,
//     canvasX: x + canvas.width / 2,
//     canvasY: y === Infinity ? 0 : Math.floor(canvas.height * 0.95 - y),
//   }
// }

// function getGeodesic(canvas: HTMLCanvasElement, start: { type: string; [key: string]: any }, end: { type: string; [key: string]: any }) {
//   const geodesicValues = computeGeodesicValues(start, end);

//   if (geodesicValues.type === 'vertical') {
//     return {
//       type: 'geodesicVertical',
//       start: getCoordFromMath(canvas, start.x, 0),
//       end: getCoordFromMath(canvas, start.x, Infinity),
//     }
//   }
  
//   if (geodesicValues.type === 'circle') {
//     return {
//       type: 'geodesicCircle',
//       center: getCoordFromMath(canvas, geodesicValues.center, 0),
//       radius: geodesicValues.radius,
//     }
//   }
// }

// function drawAxis(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
//   context.strokeStyle = 'black';
//   context.beginPath();
//   context.moveTo(shape.start.x, shape.start.y);
//   context.lineTo(shape.end.x, shape.end.y);
//   context.stroke();
// }

// function drawCursor(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
//   context.fillStyle = 'black';
//   context.font = '20px Arial';
//   context.fillText(`(${shape.x}, ${shape.y})`, shape.canvasX + 10, shape.canvasY - 10);
// }

// function drawPoint(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
//   context.fillStyle = shape.type === 'point' ? 'black' : 'red';
//   context.beginPath();
//   context.arc(shape.canvasX, shape.canvasY, 5, 0, 2 * Math.PI);
//   context.fill();
// }

// function drawGeodesic(context: CanvasRenderingContext2D, shape: { type: string; [key: string]: any }) {
//   context.strokeStyle = 'black';
//   context.beginPath();
//   if (shape.type === 'geodesicVertical') {
//     context.moveTo(shape.start.canvasX, shape.start.canvasY);
//     context.lineTo(shape.end.canvasX, shape.end.canvasY);
//   } else {
//     context.arc(shape.center.canvasX, shape.center.canvasY, shape.radius, 0, Math.PI, true);
//   }
//   context.stroke();
// }