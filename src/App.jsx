import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Member from "./pages/Member";
import { useEffect } from "react";
import { initGoogleApi } from "./utils/googleUtils";

function App() {
  useEffect(() => {
    initGoogleApi()
      .then(() => console.log("Signed in & GAPI ready"))
      .catch((err) => console.error("Google API init failed", err));
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminrkr" element={<Home />} />
        <Route path="/:departmentName/:departmentId" element={<Member />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
