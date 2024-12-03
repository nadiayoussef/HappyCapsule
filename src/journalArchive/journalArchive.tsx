import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaLock } from 'react-icons/fa'; // Import the padlock icon

interface LockedEntry {
  image: string;
  lockedUntil: Date;
  isLocked: boolean; // Add an isLocked property to track lock status
}

const JournalArchive: React.FC = () => {
  const [lockedEntries, setLockedEntries] = useState<LockedEntry[]>([]);

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

  return (
    <div className="JournalArchive">
      <h1>Journal Archive</h1>

      {/* Display Locked Entries */}
      <div className="lockedEntries">
        <h3>Locked Entries:</h3>
        
        {lockedEntries.length > 0 ? (
          <div className='row row-cols1 row-cols-md-5 g-4'>
            {lockedEntries.map((entry, index) => (

                <div className='card p-3 b-3 m-3' style={{width: "250px"}}>
              <div key={index} className="entryItem list-group">
                <p className='card-title'>Locked until: {format(entry.lockedUntil, 'MMMM dd, yyyy')}</p>

                {/* Show padlock icon for locked entries */}
                {entry.isLocked ? (
                  <div className="padlockIcon text-center">
                    <FaLock size={40} color="gray" />
                  </div>
                ) : (
                    <div className='card-body'>
                  <img src={entry.image} alt={`Locked Entry ${index}`} style={{ width: '100px' }} />
                  </div>
                )}
              </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No locked entries</p>
        )}
        </div>
      </div>
    
  );
};

export default JournalArchive;
