import Canvas from "./Canvas/index";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./Navigation";
import Analytics from "./Analytics";
import LockCapsule from "./Canvas/LockCapsule";
export default function App() {
  return (
    <HashRouter>
    <div className="main">
      <Main />
      <div className="canvas float-start">
            <Routes>
              <Route path="/Analytics" element={<Analytics />} />
              <Route path="/Canvas" element={< Canvas/>} />
              <Route path="/LockCapsule" element={<LockCapsule />} />
            </Routes>
          </div>
  
    </div>
    </HashRouter>
  );
}
