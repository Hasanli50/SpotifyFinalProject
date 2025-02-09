import { Route, Routes } from "react-router";
import "./App.css";
// import Login from "./components/Login";
// import SignUp from "./components/SignUp";
import User from "./routes/User";

function App() {
  return (
    <>
      {/* <Login />
      <SignUp/> */}
      <Routes>
        <Route path="/*" element={<User />} />
      </Routes>
    </>
  );
}

export default App;
