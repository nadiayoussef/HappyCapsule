import Canvas from "./Canvas/index";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./Navigation";
import Analytics from "./Analytics";
export default function App() {
  return (
    <HashRouter>
    <div>
      <Main />
      <div className="wd-main-content-offset p-3 flex ">
            <Routes>
              <Route path="/Analytics" element={<Analytics />} />
              <Route path="/Canvas" element={< Canvas/>} />
            </Routes>
          </div>
  
    </div>
    </HashRouter>
  );
}
