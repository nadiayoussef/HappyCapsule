import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CgProfile } from "react-icons/cg";
import '../index.css'
import { Route, Routes, useNavigate } from 'react-router-dom';
import LockCapsule from './LockCapsule';

export default function Canvas() {
    const navigate = useNavigate(); // Now works because we're in a Router context

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawnPaths, setDrawnPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [mediaFiles, setMediaFiles] = useState<
    { url: string; type: 'image'; element: HTMLImageElement, x: number, y: number, isDragging: boolean }[]
  >([]);
  const [mode, setMode] = useState<'drawing' | 'editing'>('drawing');
  const [draggingMediaIndex, setDraggingMediaIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [prompts, setPrompts] = useState<string[]>([]); // Store prompts from CSV
  const [currentPrompt, setCurrentPrompt] = useState<string>(''); // Store current prompt

  const currentDate: Date = new Date();
  const formattedDate: string = format(currentDate, 'MMMMMMMM dd, yyyy');

  // Fetch and parse the CSV file when the component mounts
  useEffect(() => {
    const loadPromptsFromCSV = async () => {
      try {
        const response = await fetch('/prompts.csv'); // Assuming 'prompts.csv' is in the public folder
        if (response.ok) {
          const csvData = await response.text();
          const rows = csvData.split('\n'); // Split the CSV by rows (lines)
          const parsedPrompts = rows.map((row) => {
            const columns = row.split(','); // Split each row by commas
            return columns[0].trim(); // Take the first column as the prompt (adjust if needed)
          });
          setPrompts(parsedPrompts);
        } else {
          console.error('Failed to load CSV file');
        }
      } catch (error) {
        console.error('Error fetching the CSV file:', error);
      }
    };

    loadPromptsFromCSV();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Triggered when the user clicks the "Generate Prompt" button
  const generatePrompt = () => {
    if (prompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomIndex]);
    } else {
      alert('No prompts available');
    }
  };

  const captureCanvasImage = (): string | null => {
    const canvas = canvasRef.current;
    if (canvas) {
      return canvas.toDataURL('image/png'); // Captures the image as a data URL
    }
    return null;
  };  

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'drawing') return;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: offsetX, y: offsetY }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'drawing') return;
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPath((prevPath) => [...prevPath, { x: offsetX, y: offsetY }]);
  };

  const endDrawing = () => {
    if (currentPath.length > 0) {
      setDrawnPaths((prevPaths) => [...prevPaths, currentPath]);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
    }
    setMediaFiles([]);
    setDrawnPaths([]);
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
        console.log('Invalid file type:', file);
      }
    });

    setMediaFiles((prevFiles) => [...prevFiles, ...newMedia]);
  };

  // Handle mouse down event in Edit Mode to start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === 'editing') {
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
      startDrawing(e);
    }
  };

  // Handle mouse move event in Edit Mode to drag the image
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === 'drawing') {
      draw(e);
    } else if (mode === 'editing' && draggingMediaIndex !== null) {
      const { offsetX, offsetY } = e.nativeEvent;
      const newX = offsetX - offset.x;
      const newY = offsetY - offset.y;

      setMediaFiles((prevFiles) => {
        const updatedMedia = [...prevFiles];
        const mediaToUpdate = updatedMedia[draggingMediaIndex];
        mediaToUpdate.x = newX;
        mediaToUpdate.y = newY;
        return updatedMedia;
      });
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    if (mode === 'drawing') {
      endDrawing();
    } else {
      setDraggingMediaIndex(null); // Stop dragging
    }
  };

  const handleLockCapsule = () => {
    const canvasImage = captureCanvasImage();
    if (canvasImage) {
      navigate('/LockCapsule', { state: { image: canvasImage } }); // Pass the image as state to the route
    } else {
      alert('No canvas image to lock.');
    }
  };  

  useEffect(() => {
    renderCanvas();
  }, [mediaFiles, drawnPaths, mode, currentPath]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    drawnPaths.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

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

    const targetWidth = canvasRef.current!.width / 2;
    const targetHeight = canvasRef.current!.height / 2;

    const scaleFactor = Math.min(targetWidth / mediaWidth, targetHeight / mediaHeight);
    const newWidth = mediaWidth * scaleFactor;
    const newHeight = mediaHeight * scaleFactor;

    ctx.drawImage(mediaElement, x, y, newWidth, newHeight);
  };

  return (
    <div>
      <h1 className='text-center'>{formattedDate}</h1>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
        <button className="btn btn-secondary" onClick={() => setMode('drawing')} style={{ marginTop: '10px' }}>Drawing Mode</button>
        <button className="btn btn-secondary" onClick={() => setMode('editing')} style={{ marginTop: '10px' }}>Edit Mode</button>
        <label htmlFor="file-input" style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '10px 20px',
          cursor: 'pointer',
          border: 'none',
        }}>
          Import Media
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={importMedia}
          multiple
          style={{ display: 'none' }}
        />
      </div>

      <button className="btn btn-success" onClick={generatePrompt} style={{ position: 'absolute', top: '10px', right: '10px' }}>
        Generate Prompt
      </button>

      {currentPrompt && (
        <div style={{ position: 'absolute', top: '50px', right: '10px', background: '#f0f0f0', padding: '10px' }}>
          {currentPrompt}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ border: '1px solid black', display: 'block', margin: '20px auto' }}
      />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', padding: '10px 20px' }}>
        <button className="btn btn-danger" onClick={clearCanvas}>Clear Canvas</button>
        <button className="btn btn-primary" onClick={handleLockCapsule}>
          Lock Capsule
        </button>
      </div>
    </div>
      );
    }