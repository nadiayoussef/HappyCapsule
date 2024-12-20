// App.tsx
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './Navigation';
import Analytics from './Analytics';
import Canvas from './Canvas';
import LockCapsule from './Canvas/LockCapsule';
import JournalArchive from './JournalArchive/journalArchive';
import Home from './Navigation/home';
import FAQ from './FAQ/FAQ';
// import FAQ from './FAQ';  // FAQ page (if it exists)

export default function App() {
  return (

      <div className="main">
        {/* Sidebar */}
        <Main />

        {/* Content area where different pages will be displayed */}
        <div className="canvas float-start">
          <Routes>
            {/* Define routes */}
            
            <Route path="/" element={<Canvas />} />  {/* New Entry page */}
            <Route path="/Analytics" element={<Analytics />} />  {/* Analytics page */}
            <Route path="/LockCapsule" element={<LockCapsule />} />  {/* LockCapsule page */}
            <Route path="/Journal-Archive" element={<JournalArchive />} />  {/* Journal Archive */}
            <Route path="/FAQ" element={<FAQ />} />  {/* FAQ page */}
          </Routes>
        </div>
      </div>
  );
}
