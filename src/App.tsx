// src/App.tsx
import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { format } from 'date-fns';
import { CgProfile } from "react-icons/cg";


const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

     // State for imported media
     const [mediaUrl, setMediaUrl] = useState<string | null>(null);
     const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
 

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

    const importMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // If no file is selected, return nothing
        if (!files) return;

        // Loop through selected files
        Array.from(files).forEach((file) => {
            // Check if the file is media (e.g., image or video)
            if (file.type.startsWith('image/')) {
                // If it's an image, set it as the media URL and type
                const imageUrl = URL.createObjectURL(file);
                setMediaUrl(imageUrl);
                setMediaType('image');
            } else if (file.type.startsWith('video/')) {
                // If it's a video, set it as the media URL and type
                const videoUrl = URL.createObjectURL(file);
                setMediaUrl(videoUrl);
                setMediaType('video');
            } else {
                console.log('Invalid file type:', file);
            }
        });
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
    return (
        <div className="App">
            <CgProfile />
            <h1>{formattedDate}</h1>
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
            
            {/* Custom Button for File Input */}
            Temporary design for the button
            <label htmlFor="file-input" style={{ 
                backgroundColor: 'lightgray', 
                color: 'black', 
                padding: '10px 20px', 
                cursor: 'pointer',
                border: 'none', 
                marginTop: '-20px',
                marginRight: '300px',
                // display: 'inline-block' 
            }}>
                Import Media
            </label>
            <input
                id="file-input"
                type="file"
                accept="image/*,video/*"
                onChange={importMedia}
                style={{ display: 'none' }} // Hides the default file input
            />

            
            {/* Display the imported media */}
            {mediaUrl && mediaType === 'image' && (
                <div>
                    <h3>Imported Image:</h3>
                    <img src={mediaUrl} alt="Imported Media" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                </div>
            )}
            {mediaUrl && mediaType === 'video' && (
                <div>
                    <h3>Imported Video:</h3>
                    <video
                        src={mediaUrl}
                        controls
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default App;