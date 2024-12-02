import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { format } from 'date-fns';
import { CgProfile } from "react-icons/cg";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [drawnPaths, setDrawnPaths] = useState<{ x: number; y: number }[][]>([]); // To store drawn paths
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]); // To store the current path being drawn

    // State for imported media (only images now)
    const [mediaFiles, setMediaFiles] = useState<
        { url: string; type: 'image'; element: HTMLImageElement, x: number, y: number, isDragging: boolean }[]
    >([]);

    // State for the current mode (Drawing Mode or Edit Mode)
    const [mode, setMode] = useState<'drawing' | 'editing'>('drawing');

    // For detecting dragging position
    const [draggingMediaIndex, setDraggingMediaIndex] = useState<number | null>(null);
    const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    // Current date and time
    const currentDate: Date = new Date();
    const formattedDate: string = format(currentDate, 'MMMMMMMM dd, yyyy');

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (mode !== 'drawing') return; // Only allow drawing in drawing mode
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true); // Mark drawing as started
        setCurrentPath([{ x: offsetX, y: offsetY }]); // Initialize the current path
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || mode !== 'drawing') return; // Only allow drawing in drawing mode
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPath((prevPath) => [...prevPath, { x: offsetX, y: offsetY }]); // Add to current path
    };

    const endDrawing = () => {
        if (currentPath.length > 0) {
            setDrawnPaths((prevPaths) => [...prevPaths, currentPath]); // Save the drawn path
        }
        setIsDrawing(false); // Mark drawing as finished
        setCurrentPath([]); // Clear current path
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx!.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
        }
        setMediaFiles([]); // Optionally clear media files
        setDrawnPaths([]); // Clear the drawn paths
    };

    const importMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newMedia: { url: string; type: 'image'; element: HTMLImageElement, x: number, y: number, isDragging: boolean }[] = [];

        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(file);
                const imageElement = new Image();
                imageElement.src = imageUrl;
                newMedia.push({ url: imageUrl, type: 'image', element: imageElement, x: 100, y: 100, isDragging: false });
            } else {
                console.log('Invalid file type:', file); // Only process images
            }
        });

        setMediaFiles((prevFiles) => [...prevFiles, ...newMedia]);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (mode === 'editing') {
            // Only handle drag events when in Edit mode
            const { offsetX, offsetY } = e.nativeEvent;

            // Find the media item under the mouse
            const clickedMediaIndex = mediaFiles.findIndex((media) => {
                const mediaWidth = media.element.width;
                const mediaHeight = media.element.height;
                return (
                    offsetX >= media.x &&
                    offsetX <= media.x + mediaWidth &&
                    offsetY >= media.y &&
                    offsetY <= media.y + mediaHeight
                );
            });

            if (clickedMediaIndex !== -1) {
                setDraggingMediaIndex(clickedMediaIndex);
                setOffset({ x: offsetX - mediaFiles[clickedMediaIndex].x, y: offsetY - mediaFiles[clickedMediaIndex].y });
            }
        } else if (mode === 'drawing') {
            // Start drawing
            startDrawing(e);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (mode === 'drawing') {
            // Only draw while in Drawing mode
            draw(e);
        } else if (mode === 'editing' && draggingMediaIndex !== null) {
            // Move the media if dragging in edit mode
            const { offsetX, offsetY } = e.nativeEvent;
            const newX = offsetX - offset.x;
            const newY = offsetY - offset.y;

            // Update the position of the dragged image in the state
            setMediaFiles((prevFiles) => {
                const updatedMedia = [...prevFiles];
                const mediaToUpdate = updatedMedia[draggingMediaIndex];
                mediaToUpdate.x = newX;
                mediaToUpdate.y = newY;
                return updatedMedia;
            });
        }
    };

    const handleMouseUp = () => {
        if (mode === 'drawing') {
            endDrawing();
        } else {
            setDraggingMediaIndex(null); // Stop dragging in Edit mode
        }
    };

    // Automatically re-render canvas when media files or points are updated
    useEffect(() => {
        renderCanvas();
    }, [mediaFiles, drawnPaths, mode, currentPath]); // Redraw when mode, media files, paths, or current drawing changes

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas for redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before re-rendering images and drawings

        // Draw all media files (images only now)
        mediaFiles.forEach((media) => {
            const imageElement = media.element;
            if (imageElement.complete) {
                drawImageQuarter(imageElement, media.x, media.y, ctx);
            } else {
                imageElement.onload = () => {
                    drawImageQuarter(imageElement, media.x, media.y, ctx);
                };
            }
        });

        // Redraw all paths that have been drawn (lines)
        drawnPaths.forEach((path) => {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y); // Start at the first point
            path.forEach((point, index) => {
                if (index > 0) {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Redraw the current drawing (if any)
        if (currentPath.length > 0) {
            ctx.beginPath();
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            currentPath.forEach((point, index) => {
                if (index > 0) {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    const drawImageQuarter = (mediaElement: HTMLImageElement, x: number, y: number, ctx: CanvasRenderingContext2D) => {
        const mediaWidth = mediaElement.width;
        const mediaHeight = mediaElement.height;

        // Set the size to 1/2 of the canvas size
        const targetWidth = canvasRef.current!.width / 2; // Half the canvas width
        const targetHeight = canvasRef.current!.height / 2; // Half the canvas height

        // Calculate scale factor to fit the media within 1/4 of the canvas size while maintaining aspect ratio
        const scaleFactor = Math.min(targetWidth / mediaWidth, targetHeight / mediaHeight);

        // Calculate the new width and height for the media based on the scale factor
        const newWidth = mediaWidth * scaleFactor;
        const newHeight = mediaHeight * scaleFactor;

        // Draw media at its current x, y position
        ctx.drawImage(mediaElement, x, y, newWidth, newHeight);
    };

    return (
        <div className="App">
            <CgProfile />
            <h1>{formattedDate}</h1>

            {/* Mode Switch Buttons */}
            <button onClick={() => setMode('drawing')} style={{ marginTop: '10px' }}>Drawing Mode</button>
            <button onClick={() => setMode('editing')} style={{ marginTop: '10px' }}>Edit Mode</button>

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown} // Start drawing or dragging
                onMouseMove={handleMouseMove} // Continue drawing or move images
                onMouseUp={handleMouseUp} // Stop drawing or dragging
                onMouseLeave={handleMouseUp} // Stop drawing or dragging when mouse leaves
                style={{ border: '1px solid black' }}
            />
            <button onClick={clearCanvas} style={{ marginTop: '10px' }}>Clear Canvas</button>

            {/* Custom Button for File Input */}
            <label htmlFor="file-input" style={{
                backgroundColor: 'lightgray',
                color: 'black',
                padding: '10px 20px',
                cursor: 'pointer',
                border: 'none',
                marginTop: '-20px',
                marginRight: '300px',
            }}>
                Import Media
            </label>
            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={importMedia}
                multiple // Allow multiple files to be selected
                style={{ display: 'none' }} // Hides the default file input
            />
        </div>
    );
};

export default App;
