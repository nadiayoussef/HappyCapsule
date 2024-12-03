import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaLock } from 'react-icons/fa'; // Import the padlock icon
import { C } from 'react-router/dist/production/fog-of-war-CbNQuoo8';

interface LockedEntry {
  image: string;
  lockedUntil: Date;
  createdAt: Date; // Add createdAt to track the creation date
  isLocked: boolean; // Add an isLocked property to track lock status
}

const JournalArchive: React.FC = () => {
  const [lockedEntries, setLockedEntries] = useState<LockedEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const savedEntries = localStorage.getItem('lockedEntries');
    if (savedEntries) {
      const parsedEntries: LockedEntry[] = JSON.parse(savedEntries);
      // Update the entries with lock status based on the current date
      const updatedEntries = parsedEntries.map((entry) => ({
        ...entry,
        isLocked: new Date(entry.lockedUntil) > new Date(),
      }));
      setLockedEntries(updatedEntries);
    }
  }, []);

  // Separate the entries into locked and unlocked
  const locked = lockedEntries.filter(entry => entry.isLocked);
  const unlocked = lockedEntries.filter(entry => !entry.isLocked);

  // Helper function to safely format dates
  const safeFormatDate = (date: Date | string | undefined) => {
    if (!date) return 'Invalid Date';
    const formattedDate = new Date(date);
    return formattedDate instanceof Date && !isNaN(formattedDate.getTime())
      ? format(formattedDate, 'MMMM dd, yyyy')
      : 'Invalid Date';
  };

  // Function to clear locked entries from the backend and localStorage
  const clearLockedEntries = async () => {
    setLoading(true);
    try {
      // Call backend API to delete locked entries
      const response = await fetch('http://localhost:5000/api/clear-locked-capsules', {
        method: 'DELETE', // DELETE request to clear locked capsules
      });

      const data = await response.json();

      if (response.ok) {
        // Clear localStorage after successful deletion
        localStorage.removeItem('lockedEntries');
        setLockedEntries([]); // Clear the state as well

        // Show success message
        setMessage('All locked capsules have been cleared successfully!');
      } else {
        setMessage(data.message || 'Failed to clear locked capsules.');
      }
    } catch (error) {
      setMessage('Error clearing locked capsules.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    localStorage.clear();
  }

  return (
    <div className="JournalArchive">
      <h1>Journal Archive</h1>

      {/* Clear Locked Entries Button */}
      <button onClick={clearAll} disabled={loading}>
        {loading ? 'Clearing...' : 'Clear Locked Entries'}
      </button>
      {message && <p>{message}</p>}

      {/* Display Locked Entries */}
      {locked.length > 0 && (
        <div className="lockedEntries">
          <h3>Locked Entries:</h3>
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {locked.map((entry, index) => (
              <div key={index} className="card p-3 b-3 m-3" style={{ width: '250px' }}>
                <div className="entryItem list-group">
                  <p className="card-title">Locked until: {safeFormatDate(entry.lockedUntil)}</p>
                  {/* Show padlock icon for locked entries */}
                  <div className="padlockIcon text-center">
                    <FaLock size={40} color="gray" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Unlocked Entries */}
      {unlocked.length > 0 && (
        <div className="unlockedEntries">
          <h3>Unlocked Entries:</h3>
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {unlocked.map((entry, index) => (
              <div key={index} className="card p-3 b-3 m-3" style={{ width: '250px' }}>
                <div className="entryItem list-group">
                  <div className="card-body">
                    <img src={entry.image} alt={`Unlocked Entry ${index}`} style={{ width: '100px' }} />
                    {/* Display the creation date for unlocked entries */}
                    <p className="card-text">Created on: {safeFormatDate(entry.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message when there are no entries */}
      {locked.length === 0 && unlocked.length === 0 && <p>No entries available</p>}
    </div>
  );
};

export default JournalArchive;
