import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface LockedEntry {
  image: string;
  lockedUntil: Date;
}

const LockCapsule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [lockedEntries, setLockedEntries] = useState<LockedEntry[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEntries = localStorage.getItem('lockedEntries');
    if (savedEntries) {
      setLockedEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Handle date selection using onClickDay instead of onChange
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
    console.log("Selected date:", value);  // Debugging
  };

  const captureCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');
    setCanvasImage(image);
  };

  const handleLock = () => {
    if (!selectedDate || !canvasImage) {
      alert('Please select a date and capture the canvas first.');
      return;
    }

    const newLockedEntry: LockedEntry = {
      image: canvasImage,
      lockedUntil: selectedDate,
    };

    const updatedLockedEntries = [...lockedEntries, newLockedEntry];
    setLockedEntries(updatedLockedEntries);
    localStorage.setItem('lockedEntries', JSON.stringify(updatedLockedEntries));

    alert('Capsule locked until: ' + format(selectedDate, 'MMMM dd, yyyy'));
  };

  const navigateToMain = () => {
    navigate('/');
  };

  return (
    <div className="LockCapsule">
      <h1>Lock Capsule</h1>

      {/* Canvas Capture */}
      <div>
        <button onClick={captureCanvasImage}>Capture Canvas</button>
      </div>

      {canvasImage && (
        <div>
          <h3>Preview of your captured image</h3>
          <img src={canvasImage} alt="Captured Canvas" style={{ width: '300px' }} />
        </div>
      )}

      {/* Date Picker using onClickDay */}
      <div>
        <h3>Select a date to lock the capsule</h3>
        <Calendar
          onClickDay={handleDateClick}  // Handle date click event
          value={selectedDate || new Date()}  // Default to current date if no date is selected
        />
      </div>

      {/* Lock Capsule Button */}
      <div>
        <button onClick={handleLock}>Lock Capsule</button>
      </div>

      {/* Navigate Back to Main Page */}
      <div>
        <button onClick={navigateToMain}>Back to Main Page</button>
      </div>

      {/* Display Locked Entries */}
      <div>
        <h3>Locked Entries:</h3>
        {lockedEntries.length > 0 ? (
          <ul>
            {lockedEntries.map((entry, index) => (
              <li key={index}>
                <p>Locked until: {format(entry.lockedUntil, 'MMMM dd, yyyy')}</p>
                <img src={entry.image} alt={`Locked Entry ${index}`} style={{ width: '100px' }} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No locked entries</p>
        )}
      </div>
    </div>
  );
};

export default LockCapsule;