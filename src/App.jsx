import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Member from "./pages/Member";

function App() {
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
