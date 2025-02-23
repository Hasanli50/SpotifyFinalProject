import "./App.css";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import User from "./routes/User";
import Artist from "./routes/Artist";
import Admin from "./routes/Admin";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<User />} />
        <Route path="/artist/*" element={<Artist/>} />
        <Route path="/admin/*" element={<Admin/>} />
      </Routes>
    </>
  );
}

export default App;
