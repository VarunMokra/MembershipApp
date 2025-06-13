import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Member from "./pages/Member";
import Testimonials from "./pages/Testimonials";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Testimonials />} />
        <Route path="/adminrkr" element={<Home />} />
        <Route path="/:departmentName/:departmentId" element={<Member />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
