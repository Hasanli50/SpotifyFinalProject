import { Route, Routes } from "react-router";
import "./App.css";
import User from "./routes/User";
import { Toaster } from "react-hot-toast";
import Artist from "./routes/Artist";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<User />} />
        <Route path="/artist/*" element={<Artist/>} />
      </Routes>
    </>
  );
}

export default App;
