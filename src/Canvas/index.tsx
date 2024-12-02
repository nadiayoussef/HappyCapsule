import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CgProfile } from "react-icons/cg";
import '../index.css'

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

    // Current date and time
    const currentDate: Date = new Date();
    const formattedDate: string = format(currentDate, 'MMMMMMMM dd, yyyy');

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setPoints([{ x: offsetX, y: offsetY }]);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = e.nativeEvent;
        const newPoint = { x: offsetX, y: offsetY };

        // Add new point to the array
        setPoints((prevPoints) => [...prevPoints, newPoint]);

        // Draw lines using quadratic curve
        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    const endDrawing = () => {
        setIsDrawing(false);
        setPoints([]);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);
    //  const { currentUser } = useSelector((state: any) => state.accountReducer);
      return (
<div >
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                style={{ border: '1px solid black' }}
            />
            <button onClick={clearCanvas} style={{ marginTop: '10px' }}>Clear Canvas</button>
        </div>
      );
    }