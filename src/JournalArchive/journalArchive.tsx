import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaLock } from 'react-icons/fa'; // Import the padlock icon

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
  const [selectedEntry, setSelectedEntry] = useState<LockedEntry | null>(null); // State for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

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

  // Function to handle opening the modal with the selected entry
  const handleCardClick = (entry: LockedEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const clearAll = () => {
    localStorage.clear();
  };

  return (
    <div className="JournalArchive">
      <h1>Journal Archive</h1>

      {/* Display Locked Entries */}
      {locked.length > 0 && (
        <div className="lockedEntries">
          <h3>Locked Entries:</h3>
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {locked.map((entry, index) => (
              <div key={index} className="card p-3 b-3 m-3" style={{ width: '250px' }} onClick={() => handleCardClick(entry)}>
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
              <div key={index} className="card p-3 b-3 m-3" style={{ width: '250px' }} onClick={() => handleCardClick(entry)}>
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

      {/* Clear Locked Entries Button at the bottom */}
      <div className="clearButtonContainer">
        <button onClick={clearAll} disabled={loading}>
          {loading ? 'Clearing...' : 'Clear Locked Entries'}
        </button>
        {message && <p>{message}</p>}
      </div>

      {/* Modal for showing the maximized image */}
      {isModalOpen && selectedEntry && (
        <div className="modalOverlay" onClick={handleModalClose}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            {/* Check if the entry is locked */}
            {selectedEntry.isLocked ? (
              <div className="padlockIcon text-center">
                <FaLock size={80} color="gray" />
                <p>This capsule is locked.</p>
              </div>
            ) : (
              <div>
                <img src={selectedEntry.image} alt="Maximized Journal Entry" className="modalImage" />
                <p className="modalDate">Created on: {safeFormatDate(selectedEntry.createdAt)}</p>
              </div>
            )}
            <button onClick={handleModalClose} className="closeButton">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalArchive;