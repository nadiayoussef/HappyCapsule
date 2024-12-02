import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface LockedEntry {
  image: string;
  lockedUntil: Date;
}

const LockCapsule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [lockedEntries, setLockedEntries] = useState<LockedEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('lockedEntries');
    if (savedEntries) {
      setLockedEntries(JSON.parse(savedEntries));
    }

    // If the image was passed from the previous page, set it here
    if (location.state?.image) {
      setCanvasImage(location.state.image);
    }
  }, [location.state]);

  // Handle date selection
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
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

      {/* Preview captured canvas image */}
      {canvasImage && (
        <div>
          <h3>Preview of your captured image</h3>
          <img src={canvasImage} alt="Captured Canvas" style={{ width: '300px' }} />
        </div>
      )}

      {/* Date Picker */}
      <div>
        <h3>Select a date to lock the capsule</h3>
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate || new Date()}
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
