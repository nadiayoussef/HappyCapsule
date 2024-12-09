import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './LockCapsule.module.css';
import { FaLock } from 'react-icons/fa'; // Import lock icon

interface LockedEntry {
  image: string;
  lockedUntil: Date;
  createdAt: Date; // Add createdAt to track the creation date
  isLocked: boolean;
  tags: string[]; // Add a field to store tags
}

const LockCapsule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [isImageLocked, setIsImageLocked] = useState<boolean>(false);
  const [lockedEntries, setLockedEntries] = useState<LockedEntry[]>([]);
  const [tags, setTags] = useState<string>(''); // State for tags input

  useEffect(() => {
    // If the image was passed from the previous page, set it here
    if (location.state?.image) {
      setCanvasImage(location.state.image);
      setIsImageLocked(false); // The main image is initially unlocked
    }

    // Retrieve existing entries from localStorage
    const savedEntries = localStorage.getItem('lockedEntries');
    if (savedEntries) {
      setLockedEntries(JSON.parse(savedEntries));
    }
  }, [location.state]);

  // Handle date selection
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
  };

  // Handle the tag input change
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

  // Handle adding the tag to the capsule
  const handleLock = () => {
    if (!selectedDate || !canvasImage) {
      alert('Please select a date and capture the canvas first.');
      return;
    }

    // Split tags by commas and trim whitespace
    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    // Create a new locked entry with the current date as createdAt
    const newLockedEntry: LockedEntry = {
      image: canvasImage,
      lockedUntil: selectedDate,
      createdAt: new Date(), // Set the creation date as the current date
      isLocked: true, // The entry starts as locked
      tags: tagList, // Save the tags
    };

    // Update the locked entries array
    const updatedLockedEntries = [...lockedEntries, newLockedEntry];
    setLockedEntries(updatedLockedEntries);

    // Store the updated entries in localStorage
    localStorage.setItem('lockedEntries', JSON.stringify(updatedLockedEntries));

    // Set the image as locked
    setIsImageLocked(true);

    // Show a confirmation alert
    alert('Capsule locked until: ' + format(selectedDate, 'MMMM dd, yyyy'));

    // Navigate to the Journal Archive page
    navigate('/journal-archive');
  };

  const navigateToCanvas = () => {
    if (canvasImage) {
      localStorage.setItem('canvasImage', canvasImage);
    }
    navigate('/Canvas');
  };

  return (
    <div className={styles.LockCapsule}>
      <h1>Lock Capsule</h1>

      {/* Back to Editing Journal Button */}
      <button className="backButton" onClick={navigateToCanvas}>
        Back to Editing Journal
      </button>

      {/* Display captured image or padlock icon */}
      {canvasImage && (
        <div className={styles.imagePreview}>
          {isImageLocked ? (
            // If the image is locked, show the padlock icon
            <div className={styles.padlockIcon}>
              <FaLock size={80} color="gray" />
              <p>This capsule is locked.</p>
              <p>Tags: {lockedEntries[lockedEntries.length - 1]?.tags.join(', ')}</p> {/* Display tags */}
            </div>
          ) : (
            // If the image is not locked, show the captured image
            <img src={canvasImage} alt="Captured Canvas" className={styles.image} />
          )}
        </div>
      )}

      {/* Tag input */}
      {!isImageLocked && (
        <div className={styles.tagInputContainer}>
          <h3>Add tags to this capsule (comma separated):</h3>
          <input
            type="text"
            value={tags}
            onChange={handleTagChange}
            placeholder="Enter tags"
            className={styles.tagInput}
          />
        </div>
      )}

      {/* Date Picker */}
      <div className={styles.calendarContainer}>
        <h3>Select a date to lock the capsule</h3>
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate || new Date()}
        />
      </div>

      {/* Lock Capsule Button */}
      <div className={styles.lockButtonContainer}>
        <button onClick={handleLock}>Lock Capsule</button>
      </div>
    </div>
  );
};

export default LockCapsule;
